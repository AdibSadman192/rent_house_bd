// Password validation
exports.validatePassword = (password) => {
  // At least 8 characters long
  // Contains at least one uppercase letter
  // Contains at least one lowercase letter
  // Contains at least one number
  // Contains at least one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Email validation
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Bangladesh format)
exports.validatePhone = (phone) => {
  // Supports formats:
  // +880XXXXXXXXXX
  // 880XXXXXXXXXX
  // 0XXXXXXXXXX
  const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return phoneRegex.test(phone);
};

// Website URL validation
exports.validateWebsite = (url) => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Profile validation
exports.validateProfile = (profile) => {
  const errors = {};

  if (!profile.firstName || profile.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters long';
  }

  if (!profile.lastName || profile.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters long';
  }

  if (profile.phone && !exports.validatePhone(profile.phone)) {
    errors.phone = 'Invalid phone number format';
  }

  if (profile.website && !exports.validateWebsite(profile.website)) {
    errors.website = 'Invalid website URL';
  }

  if (profile.bio && profile.bio.length > 500) {
    errors.bio = 'Bio must not exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Image validation
exports.validateImage = (file) => {
  const errors = [];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    errors.push('Invalid file type. Only JPEG, PNG and GIF are allowed');
  }

  if (file.size > maxSize) {
    errors.push('File size too large. Maximum size is 5MB');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Theme validation
exports.validateTheme = (theme) => {
  const validModes = ['light', 'dark', 'system'];
  const validFontSizes = ['small', 'medium', 'large'];

  const errors = {};

  if (theme.mode && !validModes.includes(theme.mode)) {
    errors.mode = 'Invalid theme mode';
  }

  if (theme.fontSize && !validFontSizes.includes(theme.fontSize)) {
    errors.fontSize = 'Invalid font size';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Language validation
exports.validateLanguage = (language) => {
  // Add more languages as needed
  const validLanguages = ['en', 'bn'];
  return validLanguages.includes(language);
};
