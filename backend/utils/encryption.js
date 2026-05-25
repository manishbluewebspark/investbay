// utils/encryption.js
import crypto from 'crypto';

const KEY = process.env.DEMAT_ENCRYPT_KEY; // 64-char hex string (32 bytes)

// ✅ Validate key on startup
if (!KEY || KEY.length !== 64) {
  console.error('❌ DEMAT_ENCRYPT_KEY missing or invalid — must be 64 hex characters');
  console.error('   Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
}

export const encrypt = (text) => {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(KEY, 'hex'),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text) => {
  if (!text) return null;
  try {
    const [ivHex, encHex] = text.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(KEY, 'hex'),
      Buffer.from(ivHex, 'hex')
    );
    return Buffer.concat([
      decipher.update(Buffer.from(encHex, 'hex')),
      decipher.final()
    ]).toString();
  } catch (err) {
    console.error('❌ Decryption failed:', err.message);
    return null;
  }
};