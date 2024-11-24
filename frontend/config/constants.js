// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

// Authentication
export const TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_KEY = 'user';
export const SESSION_STORAGE_KEY = 'session-storage';

// Routes
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/properties',
  '/properties/[id]',
];

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
};

export const DASHBOARD_ROUTES = {
  USER: '/dashboard',
  RENTER: '/dashboard/properties',
  ADMIN: '/admin',
  SUPER_ADMIN: '/admin/settings',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZES = [10, 20, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILES = 10;

// Chat
export const MAX_MESSAGE_LENGTH = 1000;
export const CHAT_PAGE_SIZE = 50;

// UI Constants
export const TOAST_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;
export const INFINITE_SCROLL_THRESHOLD = 0.8;

// Date Formats
export const DATE_FORMAT = 'MMMM DD, YYYY';
export const TIME_FORMAT = 'hh:mm A';
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
