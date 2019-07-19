const Operation = require('../../../Operation.js');
const mLogger = require('../../../../helpers/logger.js').log4js.getLogger('app/device/v2/ActivateDevice');
const fs = require('fs');
const NotificationService = require('../../../infra/NotificationService');
const OM_OPTIONS = require('../../../../configs/OM_config');
var voucher_codes = require('voucher-code-generator');
var moment = require('moment');
var testAccountsList;
const checkFileExists = (function () {
    fs.stat(process.env.TEST_ACCOUNTS_FILE_PATH, function(err, stat) {
        if (err) mLogger.error('Load file failed ', err);
        if (stat && stat.isFile()) {
            mLogger.info('Test account file exists.')
            testAccountsList = require(process.env.TEST_ACCOUNTS_FILE_PATH).userId;
        } else {
            mLogger.info('Test account file does not exist.')
            testAccountsList = [];
        }
    });
})();
const REASON = {
    firstActivate : "Activation successful.",
    userChange: "Owner changed.",
    activationFailed: "Activation failed. Detail:",
    rightsLimitation: "Already reached the high rights.",
    voucherCodeFailed: ";Voucher code duplicated. VoucherId:"
}
class ActivateDevice extends Operation {
    constructor(devicesRepository, packagesRepository, recordsRepository, devicesRightsRepository, usersRepository) {
        super();
        this.devicesRepository = devicesRepository;
        this.packagesRepository = packagesRepository;
        this.recordsRepository = recordsRepository;
        this.devicesRightsRepository = devicesRightsRepository;
        this.usersRepository = usersRepository;
    }
    /*
    * - Test accounts don't need to follow normal procedure
    *
    * 1. Get the deviceId by serialNo, macAddr.
    * 2. Get the services.
    * 3. Replace default device id with WW device id.
    * 4. Check if the device activate.
    *   Yes ->
    *       a. Overwrite userId only.
    *       b. Record Owner changeds.
    *   No ->
    *       Count the user rights. (Need to avoid users from getting rights over 3 default package. )
    *       a. if user rights < 3,
    *           - Notify order management, send {userId:string, shoppingList: {partnerId: string, productId:string}}
    *           - Update device userId and insert devices_dispatched_rights(status=1)
    *       b. else, update device userId and insert devices_dispatched_rights(status=0)
    *       c. Record Activation successfully.
    */
    async execute(user, data) {
        const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND, ACTIVATED_ERROR} = this.outputs;
        let reason, deviceInfo, dup_reason, results = [];

        // Test accounts don't need to follow normal procedure
        if (testAccountsList.includes(user.userId)) return this.emit(SUCCESS, `test account ${user.userId}`);
        try {
            const {serialNo, macAddr} = data;
            const device = await this.devicesRepository.getOne({serialNo, macAddr}); //get device info
            const service = await this.packagesRepository.getServices({ packageId:device.packageId});
            // Replace default device id with WW device id.
            await device.update({
                deviceId : data.deviceId
            })
            .then(function (result) {
                mLogger.info(`Replace default deviceId with ${data.deviceId} successful`);
            })
            .catch(async function (err) {
                mLogger.error(`The user with ${user.userId} and ${data.deviceId}: Replace device id occurred error: `, err);
                // Fetch the current data from database and record duplicated information
                await device.reload()
                .then(() => {
                    mLogger.info('Fetch the current data from database because duplicate entry');
                    dup_reason = 'Duplicated deviceId from WW. ' + data.deviceId;
                });
            });

            if (!device.currentUserId && service.length) {
                /**
                 * First Activation, count the user rights
                 * If the user rights = 3, update devices userId and insert devices_dispatched_rights (status=0)
                 * else activated and notify order management, update devices userId and insert devices_dispatched_rights (status=1)
                 */
                mLogger.info(`The user with ${user.userId} and ${data.deviceId}: Prepare to activate...`);
                const userRights = await this.devicesRightsRepository.countByUserId(user.userId);
                mLogger.info(`The user with ${user.userId} rights is ${userRights} `);
                if (userRights < 3) {
                    // Notify order management to give user rights.
                    // Update device userId and insert devices_dispatched_rights(status=1)
                    mLogger.info(`The user with ${user.userId} and ${data.deviceId}: Prepare the signaled service by OM.`);
                    const notificationService = new NotificationService(OM_OPTIONS);

                    for (let element of service[0].services) {
                        mLogger.info('The necessary service result of %s', element.sdpProductId);
                        const { sdpProductId : productId, sdpPartnerId : partnerId } = element;
                        let notifyData = {
                            userId : user.userId,
                            shoppingList : {
                                partnerId,
                                productId
                            }
                        }
                        try {
                            // Notify orderManagement
                            mLogger.info('Notify OM with data: ', notifyData);
                            const notifyResult = await notificationService.post(notifyData);
                        } catch (error) {
                            // A-1 Activate failed: Notify failed, collect failed servies.
                            mLogger.error(error)
                            results.push(notifyData);
                        }
                    }

                    if (results.length) {
                        reason = REASON.activationFailed + JSON.stringify(results);
                    } else {
                        mLogger.info(`The user with ${user.userId} and ${data.deviceId}: First activate successfully.`);
                        reason = REASON.firstActivate;
                    }

                    device.currentUserId = user.userId;  //assign new device owner
                    const vouchers = await this.packagesRepository.getVouchers({packageId:device.packageId});
                    mLogger.debug('The package contains voucher info: %O', vouchers);
                    for (let {'vouchers.package_voucher.voucherId': voucherId, 'vouchers.package_voucher.packageId': packageId} of vouchers) {
                        if (!voucherId) continue; // 此歡樂包並無兌換券
                        // 配發兌換券給使用者
                        let code = voucher_codes.generate({
                            postfix: '-' + moment().format('DD'),
                            length: 10,
                            count: 1
                        })[0];
                        const userVoucher = await this.usersRepository.add({code, voucherId, packageId, userId: user.userId, deviceSerialNo: serialNo});
                        mLogger.info('User receives voucher info: ', userVoucher.get());
                        if (!userVoucher.code) {
                            mLogger.error(`Given %s voucher occurred error: %O`, user.userId, userVoucher);

                            reason = reason + REASON.voucherCodeFailed + voucherId;
                        }
                    }

                    await this.devicesRightsRepository.add(device, 1);

                } else {
                    // For the new biz model, which limits users to retrieve 3-years rights at most.
                    // Update device userId and insert devices_dispatched_rights(status=0)
                    mLogger.info(`The user with ${user.userId}: Already reached the high rights of default package.`);
                    device.currentUserId = user.userId;  //assign new device owner
                    reason = REASON.rightsLimitation;
                    await this.devicesRightsRepository.add(device, 0);
                }
            } else {
                // B: Device owner changed
                mLogger.info(`The user with ${user.userId} and ${data.deviceId}: User change successfully.`)
                device.currentUserId = user.userId;
                reason = REASON.userChange;
            }
            // Update device owner
            await device.save()
            .catch((error) => {
                mLogger.error('Update device owner occurred error ', error);
                this.recordsRepository.add(device, 'Update device owner failed.');
                return this.emit(ACTIVATED_ERROR)
            });

            this.recordsRepository.add(device, reason); //Record device usage info
            if (dup_reason) this.recordsRepository.add(device, dup_reason);
            if (results.length) return this.emit(ACTIVATED_ERROR, results);
            this.emit(SUCCESS, JSON.stringify(device));
        } catch (error) {
            mLogger.error('Occurred error ', error)
            if (error.message === 'ValidationError') {
                this.emit(VALIDATION_ERROR, {
                    type: error.message,
                    details: error.details
                });
            } else if (error.message === 'NotFoundError') {
                if (error.type === 'serviceNotFound') {
                    return this.emit(ACTIVATED_ERROR, {
                        type: error.message,
                        details: error.details
                    });
                }
                this.emit(NOT_FOUND, {
                    type: error.message,
                    details: error.details
                });
            } else {
                this.emit(ERROR, error);
            }
        }
    }
}

ActivateDevice.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND', 'ACTIVATED_ERROR']);

module.exports = ActivateDevice;
