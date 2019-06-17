'strict mode'
module.exports = class Response {
    constructor() {
        this.errCode = '';
        this.errMsg = '';
        this.errDetail = '';
    }

    success() {
        this.errCode = '00';
        return this;
    }

    invalidRequest(errDetail) {
        this.errCode = '101';
        this.errMsg = 'Invalid Request';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    internalServerError() {
        this.errCode = '102';
        this.errMsg = 'Internal Server Error';
        this.errDetail = '伺服器發生錯誤,請稍候再試';
        return this;
    }

    invalidToken(errDetail) {
        this.errCode = '103';
        this.errMsg = 'Invalid Token';
        if (errDetail) this.errDetail = errDetail
        return this;
    }

    thirdPartyServiceError(errDetail) {
        this.errCode = '104';
        this.errMsg = 'Third Party Service Error';
        if (errDetail) this.errDetail = errDetail
        return this;
    }

    invalidProdId() {
        this.errCode = '451';
        this.errMsg = 'ProductId Not Found';
        this.errDetail = 'Product不存在';
        return this;
    }

    invalidOrderId() {
        this.errCode = '452';
        this.errMsg = 'Duplicated Order';
        this.errDetail = 'OrderID重複';
        return this;
    }

    unrecoverableError(errDetail) {
        this.errCode = '453';
        this.errMsg = 'Unrecoverable Error';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    recoverableError (errDetail) {
        this.errCode = '454';
        this.errMsg = 'Recoverable Error';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    validateError (errDetail) {
        this.errCode = '1401';
        this.errMsg = 'Validate Failed';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

}