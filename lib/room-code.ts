import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Use a secure key from environment variables
// Ensure the key is exactly 32 bytes (256 bits) for AES-256-CBC
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!.slice(0, 32);
const IV_LENGTH = 16; // For AES, this is always 16

export const encryptRoomCode = (code: string, existingIv?: string) => {
  // Use provided IV if it exists, otherwise generate a new one
  const iv = existingIv ? Buffer.from(existingIv, 'hex') : randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(code);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return {
    encryptedCode: encrypted.toString('hex'),
    iv: iv.toString('hex')
  };
};

export const decryptRoomCode = (encryptedCode: string, iv: string) => {
  try {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY), // Already sliced to 32 bytes
      Buffer.from(iv, 'hex')
    );
    
    let decrypted = decipher.update(Buffer.from(encryptedCode, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}; 
 
