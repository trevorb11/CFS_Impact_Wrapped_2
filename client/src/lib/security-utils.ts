/**
 * Security Utilities
 * 
 * This module provides functions for encrypting and decrypting data
 * to improve security when passing sensitive donor information in URLs.
 */
import CryptoJS from 'crypto-js';

// The encryption key - in a real production environment, this should be:
// 1. Stored securely (e.g., environment variable)
// 2. Complex and unique to your application
// 3. Rotated periodically
const ENCRYPTION_KEY = 'COMMUNITY_FOOD_SHARE_APP_KEY_2025';

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
export function decryptData(encryptedData: string): any {
  try {
    // Decode the URL-safe string back to the encrypted string
    const encrypted = atob(encryptedData);
    
    // Decrypt the string
    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    
    // Parse the decrypted JSON back to an object
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data');
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