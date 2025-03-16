/**
 * Security Utilities
 * 
 * This module provides functions for encrypting and decrypting data
 * to improve security when passing sensitive donor information in URLs.
 */
import CryptoJS from 'crypto-js';

// Get encryption key from environment variables
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

/**
 * Encrypts an object to a URL-safe string
 * 
 * @param data - The data object to encrypt
 * @returns An encrypted, URL-safe string
 */
export function encryptData(data: any): string {
  try {
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data);
    
    // Encrypt the JSON string
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    
    // Make the encrypted string URL-safe by base64 encoding
    return btoa(encrypted);
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts a URL-safe string back to an object
 * 
 * @param encryptedData - The encrypted URL-safe string
 * @returns The decrypted data object
 */
interface DonorData {
  firstName?: string;
  email?: string;
  firstGiftDate?: string;
  lastGiftDate?: string;
  lastGiftAmount?: number;
  lifetimeGiving?: number;
  consecutiveYearsGiving?: number;
  totalGifts?: number;
  largestGiftAmount?: number;
  largestGiftDate?: string;
  givingFY22?: number;
  givingFY23?: number;
  givingFY24?: number;
  givingFY25?: number;
}

/**
 * Validates decrypted donor data
 * @param data - The decrypted data to validate
 * @returns boolean indicating if data is valid
 */
function validateDonorData(data: any): data is DonorData {
  // Check if data is an object
  if (!data || typeof data !== 'object') return false;

  // Validate string fields
  const stringFields = ['firstName', 'email', 'firstGiftDate', 'lastGiftDate', 'largestGiftDate'];
  for (const field of stringFields) {
    if (field in data && typeof data[field] !== 'string') return false;
  }

  // Validate numeric fields
  const numericFields = [
    'lastGiftAmount', 'lifetimeGiving', 'consecutiveYearsGiving', 'totalGifts',
    'largestGiftAmount', 'givingFY22', 'givingFY23', 'givingFY24', 'givingFY25'
  ];
  for (const field of numericFields) {
    if (field in data && typeof data[field] !== 'number') return false;
  }

  // Validate date formats if present
  const dateFields = ['firstGiftDate', 'lastGiftDate', 'largestGiftDate'];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
  for (const field of dateFields) {
    if (field in data && !dateRegex.test(data[field])) return false;
  }

  // Validate email format if present
  if ('email' in data && data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return false;
  }

  // Validate numeric ranges
  if ('lifetimeGiving' in data && data.lifetimeGiving < 0) return false;
  if ('lastGiftAmount' in data && data.lastGiftAmount < 0) return false;
  if ('largestGiftAmount' in data && data.largestGiftAmount < 0) return false;

  return true;
}

export function decryptData(encryptedData: string): DonorData {
  try {
    // Check if encryption key is available
    if (!ENCRYPTION_KEY) {
      throw new Error('Encryption key not found');
    }

    // Decode the URL-safe string back to the encrypted string
    const encrypted = atob(encryptedData);
    
    // Decrypt the string
    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    
    // Parse the decrypted JSON back to an object
    const data = JSON.parse(decrypted);

    // Validate the decrypted data
    if (!validateDonorData(data)) {
      throw new Error('Invalid donor data format');
    }

    return data;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Encrypts multiple parameters into a single payload
 * 
 * This is useful for converting multiple URL parameters into a single encrypted parameter
 * 
 * @param params - Record of parameter names and values
 * @returns An encrypted, URL-safe string
 */
export function encryptParams(params: Record<string, string | number | null>): string {
  // Filter out null or undefined values
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== null && value !== undefined)
  );
  
  return encryptData(filteredParams);
}

/**
 * Creates a secure URL with encrypted parameters
 * 
 * @param baseUrl - The base URL path
 * @param params - Record of parameter names and values to encrypt
 * @returns A URL with encrypted parameters
 */
export function createSecureUrl(baseUrl: string, params: Record<string, string | number | null>): string {
  const encryptedData = encryptParams(params);
  return `${baseUrl}?data=${encodeURIComponent(encryptedData)}`;
}