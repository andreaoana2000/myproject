import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthProvider';
import { ChatProvider } from '@/contexts/ChatContext';
import { EncryptionProvider } from '@/contexts/EncryptionContext';
import MainLayout from '@/components/layout/MainLayout';
import AuthScreen from '@/components/auth/AuthScreen';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading SecureChat...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {user ? (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MainLayout />
        </motion.div>
      ) : (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <Helmet>
        <title>SecureChat - End-to-End Encrypted Messaging</title>
        <meta name="description" content="Ultra-secure messaging app with end-to-end encryption, auto-delete messages, and advanced privacy controls." />
      </Helmet>
      
      <ThemeProvider>
        <AuthProvider>
          <EncryptionProvider>
            <ChatProvider>
              <AppContent />
              <Toaster />
            </ChatProvider>
          </EncryptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;