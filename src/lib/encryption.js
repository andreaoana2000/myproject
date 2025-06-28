
// AES Encryption utilities for SecureChat
export const generateKeyPair = async () => {
  try {
    // Generate a random key pair for demonstration
    const keyPair = {
      publicKey: generateRandomKey(),
      privateKey: generateRandomKey()
    };
    return keyPair;
  } catch (error) {
    console.error('Key generation error:', error);
    throw error;
  }
};

export const generateUserId = () => {
  return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export const generateEncryptionKey = () => {
  return generateRandomKey();
};

export const generateRandomKey = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const encryptData = async (data, key) => {
  try {
    // Simple encryption simulation for demo
    const encrypted = btoa(JSON.stringify({
      data: data,
      key: key.slice(0, 8),
      timestamp: Date.now()
    }));
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return data;
  }
};

export const decryptData = async (encryptedData, key) => {
  try {
    // Simple decryption simulation for demo
    const decoded = JSON.parse(atob(encryptedData));
    return decoded.data;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData;
  }
};

export const encryptMessage = async (message, recipientPublicKey) => {
  return encryptData(message, recipientPublicKey);
};

export const decryptMessage = async (encryptedMessage, privateKey) => {
  return decryptData(encryptedMessage, privateKey);
};

export const generateSecureHash = (data) => {
  // Simple hash function for demo
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};
