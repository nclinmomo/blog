'strict mode'
module.exports = class Response {
    constructor() {
        this.errCode = '';
        this.errMsg = '';
        this.errDetail = '';
    }

    success() {
        this.errCode = '00';
        this.errMsg = '';
        this.errDetail = '';
        return this;
    }

    invalidRequest(errDetail) {
        this.errCode = '101';
        this.errMsg = 'Invalid Request';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    internalServerError(errDetail) {
        this.errCode = '102';
        this.errMsg = 'Internal Server Error';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    invalidToken(errDetail) {
        this.errCode = '103';
        this.errMsg = 'Invalid Token';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    duplicatedDevice(errDetail) {
        this.errCode = '501';
        this.errMsg = 'Duplicated Device';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    deviceNotFound(errDetail) {
        this.errCode = '502';
        this.errMsg = 'Device Not Found';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    duplicatedBound(errDetail) {
        this.errCode = '503';
        this.errMsg = 'Duplicated Bound';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    duplicatedPackage(errDetail) {
        this.errCode = '511';
        this.errMsg = 'Duplicated Package';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    packageNotFound(errDetail) {
        this.errCode = '512';
        this.errMsg = 'Package Not Found';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    duplicatedService(errDetail) {
        this.errCode = '521';
        this.errMsg = 'Duplicated Service';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    serviceNotFound(errDetail) {
        this.errCode = '522';
        this.errMsg = 'Service Not Found';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    activationError(errDetail) {
        this.errCode = '531';
        this.errMsg = 'Activation Error';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    recordNotFound(errDetail) {
        this.errCode = '532';
        this.errMsg = 'Record Not Found';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }

    alreadyRedeemed(errDetail) {
        this.errCode = '541';
        this.errMsg = 'Already redeemed';
        if (errDetail) this.errDetail = errDetail;
        return this;
    }
}
