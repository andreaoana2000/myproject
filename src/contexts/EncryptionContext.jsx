
import React, { createContext, useContext, useState } from 'react';
import { generateEncryptionKey, encryptData, decryptData } from '@/lib/encryption';

const EncryptionContext = createContext();

export function EncryptionProvider({ children }) {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  const encryptMessage = async (message, recipientPublicKey) => {
    if (!encryptionEnabled) return message;
    
    try {
      return await encryptData(message, recipientPublicKey);
    } catch (error) {
      console.error('Encryption error:', error);
      return message;
    }
  };

  const decryptMessage = async (encryptedMessage, privateKey) => {
    if (!encryptionEnabled) return encryptedMessage;
    
    try {
      return await decryptData(encryptedMessage, privateKey);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedMessage;
    }
  };

  return (
    <EncryptionContext.Provider value={{
      encryptionEnabled,
      setEncryptionEnabled,
      encryptMessage,
      decryptMessage
    }}>
      {children}
    </EncryptionContext.Provider>
  );
}

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};
