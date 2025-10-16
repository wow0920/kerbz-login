export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.staging.kerbzadventures.com';

export const INACTIVITY_LOCK_TIMEOUT: number = Number(
  (Number(process.env.EXPO_PUBLIC_INACTIVITY_LOCK_TIMEOUT) || 5 * 60) * 1000,
);
