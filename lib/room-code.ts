import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Use a secure key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-fallback-key-32-chars-long!!';
const IV_LENGTH = 16; // For AES, this is always 16

export const encryptRoomCode = (code: string) => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(code);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return {
    encryptedCode: encrypted.toString('hex'),
    iv: iv.toString('hex')
  };
};

export const decryptRoomCode = (encryptedCode: string, iv: string) => {
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, 'hex')
  );
  
  let decrypted = decipher.update(Buffer.from(encryptedCode, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
};