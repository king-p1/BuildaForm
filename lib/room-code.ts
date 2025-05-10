import { randomBytes, createHash } from 'crypto';

export const generateRoomCode = () => {
  // Generate a random 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const salt = randomBytes(16).toString('hex');
  
  // Hash the code with the salt
  const hashedCode = createHash('sha256')
    .update(code + salt)
    .digest('hex');
    
  return {
    code, // The original code to show to the user
    hashedCode, // The hashed version to store in DB
    salt // The salt to store in DB
  };
};

export const verifyRoomCode = (inputCode: string, hashedCode: string, salt: string) => {
  const hashedInput = createHash('sha256')
    .update(inputCode + salt)
    .digest('hex');
    
  return hashedInput === hashedCode;
};