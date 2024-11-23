const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Generate a new secret key for 2FA
exports.generateTwoFactorSecret = () => {
    const secret = speakeasy.generateSecret({
        name: 'House Rental BD',
        issuer: 'House Rental BD'
    });
    return secret.base32;
};

// Generate QR code for 2FA setup
exports.generateQRCode = async (secret) => {
    const otpauth_url = `otpauth://totp/House%20Rental%20BD?secret=${secret}&issuer=House%20Rental%20BD`;
    try {
        const qrCodeUrl = await qrcode.toDataURL(otpauth_url);
        return qrCodeUrl;
    } catch (error) {
        throw new Error('Error generating QR code');
    }
};

// Verify 2FA token
exports.verifyTwoFactorToken = (token, secret) => {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1 // Allow 30 seconds clock skew
    });
};

// Generate backup codes
exports.generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
        codes.push(Math.random().toString(36).substr(2, 10).toUpperCase());
    }
    return codes;
};
