export { COLORS, default as Colors } from './colors';
export { SIZES, default as Sizes } from './sizes';
export { STRINGS, default as Strings } from './strings';

// Re-export for convenience
export * from './colors';
export * from './sizes';
export * from './strings';

// Storage keys constants
export const STORAGE_KEYS = {
  USER_EMAIL: 'userEmail',
  USER_PASSWORD: 'userPassword',
  USER_LOGGED_IN: 'userLoggedIn',
  TERMS_ACCEPTED: 'termsAccepted',
  USER_DATA: 'userData',
  SETTINGS: 'settings',
} as const; 