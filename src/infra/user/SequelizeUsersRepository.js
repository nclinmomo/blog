class SequelizeUsersRepository {
    constructor(UserVoucher, VoucherModel) {
        this.UserVoucherModel = UserVoucher;
        this.VoucherModel = VoucherModel;
    }

    async add(voucher) {
        try {
            const newVoucher = await this.UserVoucherModel.create(voucher);
            return newVoucher;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicateError = new Error('DuplicateError');
                duplicateError.details = `[ ${error.errors[0].type} ] Code with ${error.errors[0].value} can't be add.`;
                return duplicateError;
            }
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                const validationError = new Error('ValidationError');
                validationError.details = error.message;
                return validationError;
            }
            return error;
        }
    }

    async getVouchers(userId) {
        try {
            return await this.UserVoucherModel.findAll(
                {
                    attributes: [
                        'code', 'deviceSerialNo', 'voucherId', 'packageId', 'status', 'redeemedService', 'updatedAt'
                    ],
                    where: {userId},
                    raw: true,
                    include : [
                        {
                            model: this.VoucherModel,
                            attributes: ['voucherId', 'name', 'description']
                        }
                    ]
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async getVoucher(...args) {
        try {
            return await this.UserVoucherModel.findOne(
                {
                    attributes: [
                        'code', 'deviceSerialNo', 'voucherId', 'packageId', 'status', 'redeemedService'
                    ],
                    where: args
                }
            );
        } catch (error) {
            throw error;
        }
    }

}
module.exports = SequelizeUsersRepository;
