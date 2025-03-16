/**
 * Security Utilities
 * 
 * This module provides functions for encrypting and decrypting data
 * to improve security when passing sensitive donor information in URLs.
 */
import CryptoJS from 'crypto-js';
import { toast } from '@/hooks/use-toast';

// Get encryption key from environment variables
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Check if encryption key is available and provide clear error if missing
if (!ENCRYPTION_KEY) {
  console.error('ENCRYPTION_KEY is not defined in environment variables!');
  toast({
    title: 'Configuration Error',
    description: 'Encryption key is missing. Please contact the administrator.',
    variant: 'destructive',
  });
}

/**
 * Encrypts an object to a URL-safe string
 * 
 * @param data - The data object to encrypt
 * @returns An encrypted, URL-safe string
 * @throws Error if encryption fails or if encryption key is missing
 */
export function encryptData(data: any): string {
  try {
    // Verify encryption key is available
    if (!ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable is not defined');
    }
    
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data);
    
    // Encrypt the JSON string
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    
    // Make the encrypted string URL-safe by base64 encoding
    return btoa(encrypted);
  } catch (error) {
    console.error('Error encrypting data:', error);
    toast({
      title: 'Encryption Failed',
      description: 'Could not encrypt donor data securely. Please try again or contact support.',
      variant: 'destructive',
    });
    throw new Error('Failed to encrypt data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Decrypts a URL-safe string back to an object
 * 
 * @param encryptedData - The encrypted URL-safe string
 * @returns The decrypted data object
 */
export interface DonorData {
  firstName?: string;
  first_name?: string; // Allow both camelCase and snake_case for compatibility
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

/**
 * Decrypts a URL-safe string back to an object
 * Provides comprehensive error handling and validation
 * 
 * @param encryptedData - The encrypted URL-safe string
 * @returns The decrypted and validated donor data object
 * @throws Error with detailed message if decryption fails
 */
export function decryptData(encryptedData: string): DonorData {
  try {
    // Check if encryption key is available
    if (!ENCRYPTION_KEY) {
      toast({
        title: 'Configuration Error',
        description: 'Encryption key is missing. Please contact the administrator.',
        variant: 'destructive',
      });
      throw new Error('Encryption key not found');
    }

    // Decode the URL-safe string back to the encrypted string
    let encrypted;
    try {
      encrypted = atob(encryptedData);
    } catch (error) {
      throw new Error('Invalid URL format: data is not properly base64 encoded');
    }
    
    // Decrypt the string
    let decrypted;
    try {
      decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error('Decryption failed: Could not decrypt data with the provided key');
      }
    } catch (error) {
      throw new Error('Decryption failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
    
    // Parse the decrypted JSON back to an object
    let data;
    try {
      data = JSON.parse(decrypted);
    } catch (error) {
      throw new Error('Invalid data format: Decrypted content is not valid JSON');
    }

    // Validate the decrypted data
    if (!validateDonorData(data)) {
      throw new Error('Invalid donor data format: Data validation failed');
    }

    return data;
  } catch (error) {
    console.error('Error decrypting data:', error);
    toast({
      title: 'Decryption Failed',
      description: 'Could not decrypt donor data. The URL may be invalid or tampered with.',
      variant: 'destructive',
    });
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