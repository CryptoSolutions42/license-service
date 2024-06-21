import crypto from 'crypto-js';
import { config } from 'dotenv';
config();

export const decryptData = (encryptedData: string): string => {
  const decryptedData = crypto.AES.decrypt(encryptedData, process.env.ENCRYPTO_KEY).toString(crypto.enc.Utf8);
  return decryptedData;
};
