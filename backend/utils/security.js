const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Get client information from request
exports.getClientInfo = (req) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const parser = new UAParser(userAgent);
  const geo = geoip.lookup(ip);

  return {
    ip,
    device: `${parser.getBrowser().name} on ${parser.getOS().name}`,
    location: geo ? `${geo.city}, ${geo.country}` : 'Unknown Location'
  };
};

// Generate backup codes
exports.generateBackupCodes = (count = 8) => {
  const codes = [];
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // Add dashes for readability
    code = code.match(/.{1,4}/g).join('-');
    codes.push(code);
  }

  return codes;
};

// Generate 2FA secret
exports.generateTwoFactorSecret = () => {
  return speakeasy.generateSecret({
    name: 'House Rental Platform'
  });
};

// Verify 2FA token
exports.verifyTwoFactorToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
    window: 1 // Allow 30 seconds clock skew
  });
};

// Generate QR code for 2FA
exports.generateQRCode = async (secret) => {
  try {
    return await qrcode.toDataURL(secret.otpauth_url);
  } catch (error) {
    throw new Error('Error generating QR code');
  }
};
