const mLogger = require('../../../helpers/logger.js').log4js.getLogger('src/userService');
const SequenlizeUsersRepository = require('../../infra/user/SequelizeUsersRepository');
const SequelizeDevicesRepository = require('../../infra/device/SequelizeDevicesRepository');
const SequelizePackagesRepository = require('../../infra/package/SequelizePackagesRepository');
const UserModel = require('../../../models/database/models/').user_voucher;
const VoucherModel = require('../../../models/database/models/').voucher;
const PackageModel = require('../../../models/database/models/').package;
const DeviceModel = require('../../../models/database/models').device;
const OMClient = require('../../client/omClient');
const Response = require('../../../models/Response');
const moment = require('moment');
const limitedTimeOfferEnabled = (process.env.LIMITED_TIME_OFFER_ENABLED === 'true');
async function getUserVoucher(userId) {
    let vouchers = [];
    const sequenlizeUsersRepository = new SequenlizeUsersRepository(UserModel, VoucherModel);
    const sequelizeDevicesRepository = new SequelizeDevicesRepository(DeviceModel);
    const sequelizePackagesRepository = new SequelizePackagesRepository(PackageModel);
    let userVoucher = await sequenlizeUsersRepository.getVouchers(userId);

    for (let voucher of userVoucher) {
        let deviceInfo = await sequelizeDevicesRepository.getOne({serialNo: voucher.deviceSerialNo});
        let voucherInfo = {
            code: voucher.code,
            status: voucher.status,
            deviceSerialNo: voucher.deviceSerialNo,
            deviceModelName: deviceInfo.modelName,
            provider: null,
            name: voucher['voucher.name'],
            description: voucher['voucher.description'] || ''
        };

        let voucherProvider = await sequelizePackagesRepository.getNotNecessaryServices({packageId: voucher.packageId});
        let providerList = [];
        for (let {package_service: {alias}} of voucherProvider[0].services) {
            providerList.push(alias);
        }
        voucherInfo.provider = providerList;
        vouchers.push(voucherInfo);
    }
    mLogger.info('%s voucher list: %O', userId, vouchers);
    return vouchers;
}

async function getUserVoucherV2(userId) {
    let vouchers = [];
    const sequenlizeUsersRepository = new SequenlizeUsersRepository(UserModel, VoucherModel);
    const sequelizeDevicesRepository = new SequelizeDevicesRepository(DeviceModel);
    const sequelizePackagesRepository = new SequelizePackagesRepository(PackageModel);
    let userVoucher = await sequenlizeUsersRepository.getVouchers(userId);

    for (let voucher of userVoucher) {
        let deviceInfo = await sequelizeDevicesRepository.getOne({serialNo: voucher.deviceSerialNo});
        let voucherInfo = {
            code: voucher.code,
            status: voucher.status,
            deviceSerialNo: voucher.deviceSerialNo,
            deviceModelName: deviceInfo.modelName,
            provider: null,
            name: voucher['voucher.name'],
            description: voucher['voucher.description'] || '',
            redeemedService: voucher.redeemedService || '',
            redeemedDate: (voucher.updatedAt ? moment(voucher.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '')
        };

        let voucherProvider = await sequelizePackagesRepository.getNotNecessaryServices({packageId: voucher.packageId});
        let providerList = [];
        for (let {package_service: {alias}} of voucherProvider[0].services) {
            providerList.push(alias);
        }
        voucherInfo.provider = providerList;
        vouchers.push(voucherInfo);
    }
    mLogger.info('%s voucher list: %O', userId, vouchers);
    return vouchers;
}

async function getUserVoucherV3(userId) {
    let vouchers = [];
    const sequenlizeUsersRepository = new SequenlizeUsersRepository(UserModel, VoucherModel);
    const sequelizeDevicesRepository = new SequelizeDevicesRepository(DeviceModel);
    const sequelizePackagesRepository = new SequelizePackagesRepository(PackageModel);
    let userVoucher = await sequenlizeUsersRepository.getVouchers(userId);
    let isInLimitedTimeOffer = isLimitedTimeOfferOrNot();
    for (let voucher of userVoucher) {
        // determine in limited time offer or not
        if (limitedTimeOfferEnabled || isInLimitedTimeOffer) {
            if (voucher['voucher.name'].indexOf('friDay 4個月/KKBOX 2個月') >= 0) {
                voucher['voucher.name'] = voucher['voucher.name'].replace('2', '4');
            }
        }
        let deviceInfo = await sequelizeDevicesRepository.getOne({serialNo: voucher.deviceSerialNo});
        let voucherInfo = {
            code: voucher.code,
            status: voucher.status,
            deviceSerialNo: voucher.deviceSerialNo,
            deviceModelName: deviceInfo.modelName,
            contentProvider: null,
            name: voucher['voucher.name'],
            description: voucher['voucher.description'] || '',
            redeemedService: voucher.redeemedService || '',
            redeemedDate: (voucher.updatedAt ? moment(voucher.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '')
        };

        let voucherProvider = await sequelizePackagesRepository.getNotNecessaryServices({packageId: voucher.packageId});
        let contentProviderList = [];
        for (let {package_service: {alias, displayName}} of voucherProvider[0].services) {
            let contentProviderListItem = new Object();
            contentProviderListItem.alias = alias;
            // determine in limited time offer or not
            if (limitedTimeOfferEnabled || isInLimitedTimeOffer) {
                if (alias === 'music-friday') {
                    displayName = 'friDay音樂(免費贈送4個月)';
                } else if (alias === 'music-kkbox') {
                    displayName = 'KKBOX(免費贈送4個月)';
                }
            }
            contentProviderListItem.displayName = displayName;
            contentProviderList.push(contentProviderListItem);
        }
        voucherInfo.contentProvider = contentProviderList;
        vouchers.push(voucherInfo);
    }
    mLogger.info('%s voucher list: %O', userId, vouchers);
    return vouchers;
}

/**
 * Redeem voucher.
 * 1. Get voucher information
 * 1-1. If the voucher is null, return invalid request
 * 1-2. If the voucher status is 1, return 541 Already redeemed
 * 1-3. If the voucher status is 0, go to 2
 * 2. Verify provider
 * 2-1. If the provider is null, return invalid request
 * 2-2. If the provider is valid, go to 3
 * 3. Notify OM
 * 4. Update status(limitedTimeOffer condition)
 *
 * @param {String} userId
 * @param {Object} vouchers
 * @param {String} vouchers.deviceSerialNo
 * @param {String} vouchers.voucherCode
 * @param {String} vouchers.provider
 */
async function redeem(userId, vouchers) {
    let redeemResultList = [];
    const sequenlizeUsersRepository = new SequenlizeUsersRepository(UserModel, VoucherModel);
    const sequelizeDevicesRepository = new SequelizeDevicesRepository(DeviceModel);
    const sequelizePackagesRepository = new SequelizePackagesRepository(PackageModel);

    for (let {deviceSerialNo, voucherCode: code, provider} of vouchers) {
        let response = new Response();
        let voucher;
        let deviceInfo;
        let packageInfo;

        try {
            voucher = await sequenlizeUsersRepository.getVoucher({userId, deviceSerialNo, code});
            if (voucher) {
                mLogger.info('The voucher with %s and %s result: %O', code, userId, voucher.get());
                if (voucher.status) {
                    // Already redeemed
                    redeemResultList.push(response.alreadyRedeemed());
                    continue;
                }
            } else {
                // Cannot find the voucher with code and userId
                mLogger.info('Cannot find the voucher with %s and %s', code, userId);
                redeemResultList.push(response.invalidRequest('The voucher is not exist.'));
                continue;
            }
            // Get related information of voucher
            deviceInfo = await sequelizeDevicesRepository.getOne({serialNo: deviceSerialNo});
            packageInfo = await sequelizePackagesRepository.getService(provider, {packageId: voucher.packageId});
            mLogger.info('The device information: %O', deviceInfo.get());
            mLogger.info('The package information of voucher: %O', packageInfo);

            if (!packageInfo) {
                // The package does not exist.
                redeemResultList.push(response.internalServerError());
                continue;
            }

            if (!packageInfo['services.sdpProductId']) {
                // The provider is invalid
                mLogger.info('The provider %s is invalid in package %s', provider, voucher.packageId);
                redeemResultList.push(response.invalidRequest('The provider is invalid.'));
                continue;
            };

        } catch (error) {
            mLogger.error('Get device or package occurred error: %O', error);
            redeemResultList.push(response.internalServerError());
            continue;
        }

        try {
            let redeemResult = await OMClient.transact(userId, {
                    sdpProductId: packageInfo['services.sdpProductId'],
                    sdpPartnerId: packageInfo['services.sdpPartnerId'],
                }, deviceInfo, code);
            if (redeemResult.errCode === '00') {
                // determine in limited time offer or not
                let voucherUpdateObj = {
                    status: 1,
                    redeemedService: provider
                };
                if (limitedTimeOfferEnabled || isLimitedTimeOfferOrNot()) {
                    voucherUpdateObj.voucherId = 'music004';
                    mLogger.info('enter limited time offer');
                }
                mLogger.info('%s Redeem voucher successfully: %s %s %s', userId, code, packageInfo['services.sdpProductId'], packageInfo['services.sdpPartnerId']);
                // Redeem successfuly, update voucher status and redeemedService
                let updateVoucherStatus = await voucher.update(voucherUpdateObj);
                mLogger.info('Update the voucher %s status to %s successfully.', voucher.code, 1);
                redeemResultList.push(response.success());
            } else if (redeemResult.errCode === '407') {
                if (redeemResult.errDetail === 'Already redeemed') {
                    // Something error, update voucher status to -1. the voucher status is 0 in DB, but is 1 in KKBOX.
                    let updateVoucherStatus = await voucher.update({status: -1});
                    mLogger.warn('Something error, update the voucher %s status to %s.', voucher.code, -1);
                    redeemResultList.push(response.alreadyRedeemed());
                } else {
                    redeemResultList.push(response.invalidRequest(redeemResult.errDetail));
                }
            } else {
                redeemResultList.push(response.internalServerError(redeemResult.errDetail));
            }
        } catch (error) {
            if (error.message === 'unknownError') {
                mLogger.error('Notify OM error: %O', error);
            } else {
                mLogger.error('Update the voucher status failed. %O', error);
            }
            redeemResultList.push(response.internalServerError());
        }
    }
    return redeemResultList;

}

function isLimitedTimeOfferOrNot(){
    //limitedTimeOffer condition
    let isInLimitedTimeOffer = false;
    if (moment().isBetween(process.env.LIMITED_TIME_OFFER_START_TIME || '2019-08-07', process.env.LIMITED_TIME_OFFER_END_TIME || '2019-10-31', 'day', '[]')) {
        isInLimitedTimeOffer = true;
    }
    return isInLimitedTimeOffer;
}

exports.getUserVoucher = getUserVoucher;
exports.getUserVoucherV2 = getUserVoucherV2;
exports.getUserVoucherV3 = getUserVoucherV3;
exports.redeem = redeem;
