'strict mode'
var crypto = require('crypto');

module.exports = class CSRCrypto {
    constructor() {
        this.key = process.env.CSR_DES_KEY;
        this.messageEncoding = 'utf-8';
        this.cipherEncoding = 'base64';
        this.algorithm = 'des-ecb';
    }

    /* istanbul ignore next */
    encryption(message) {
        var cipher = crypto.createCipheriv(this.algorithm, this.key, '');
        var crypted = cipher.update(message, this.messageEncoding, this.cipherEncoding);
        crypted += cipher.final(this.cipherEncoding);
        return crypted;
    }

    decrytion(encryptedMessage) {
        try {
            encryptedMessage = encryptedMessage.replace(/\ /g, '+');
            var decipher = crypto.createDecipheriv(this.algorithm, this.key, '');
            var decrypted = decipher.update(encryptedMessage, this.cipherEncoding, this.messageEncoding);
            decrypted += decipher.final(this.messageEncoding);
            return decrypted;
        } catch (error) {
            throw new Error(error);
        }
    }
}