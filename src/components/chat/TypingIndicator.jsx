import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator({ contact, users }) {
  // Handle both single contact and multiple users
  const displayContact = contact || (users && users.length > 0 ? users[0] : null);
  
  if (!displayContact) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3"
    >
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
        {displayContact.avatar || '👤'}
      </div>
      
      <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" />
          <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" />
          <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" />
        </div>
      </div>
    </motion.div>
  );
}