
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import { X, Reply } from 'lucide-react';

export default function MessageReply({ replyingTo, onCancel }) {
  const [replyText, setReplyText] = useState('');
  const { sendMessage, activeChat } = useChat();

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;

    await sendMessage(activeChat.id, replyText.trim(), 'reply', {
      replyTo: replyingTo.id,
      originalMessage: replyingTo.content,
      originalSender: replyingTo.senderId
    });

    setReplyText('');
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="border-t border-border bg-card/50 p-3"
    >
      <div className="flex items-start gap-3 mb-3">
        <Reply className="w-4 h-4 text-primary mt-1" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Replying to:</p>
          <p className="text-sm text-foreground bg-muted/50 rounded p-2 line-clamp-2">
            {replyingTo.content}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6"
          onClick={onCancel}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      <form onSubmit={handleSendReply} className="flex gap-2">
        <Input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          className="flex-1"
          autoFocus
        />
        <Button type="submit" disabled={!replyText.trim()}>
          Send
        </Button>
      </form>
    </motion.div>
  );
}
