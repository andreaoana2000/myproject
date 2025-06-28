import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Reply, X, Send, Quote, Copy, Forward } from 'lucide-react';

export default function MessageReplySystem({ 
  replyingTo, 
  onSendReply, 
  onCancelReply,
  onQuoteMessage 
}) {
  const [replyText, setReplyText] = useState('');
  const [replyMode, setReplyMode] = useState('reply'); // 'reply' or 'quote'

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const replyData = {
      content: replyText.trim(),
      replyTo: replyingTo.id,
      originalMessage: replyingTo.content,
      originalSender: replyingTo.senderName,
      type: replyMode === 'quote' ? 'quote' : 'reply',
      timestamp: new Date().toISOString()
    };

    onSendReply(replyData);
    setReplyText('');
    onCancelReply();

    toast({
      title: replyMode === 'quote' ? "Message Quoted! 💬" : "Reply Sent! 💬",
      description: `Your ${replyMode} to ${replyingTo.senderName} has been sent`
    });
  };

  const handleQuote = () => {
    setReplyMode('quote');
    if (onQuoteMessage) {
      onQuoteMessage(replyingTo);
    }
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(replyingTo.content);
    toast({
      title: "Message Copied! 📋",
      description: "Original message copied to clipboard"
    });
  };

  const handleForward = () => {
    toast({
      title: "🚧 Forward Feature",
      description: "Message forwarding isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  if (!replyingTo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="border-t border-border bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm"
    >
      {/* Reply Preview */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-start gap-3">
          <Reply className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary">
                {replyMode === 'quote' ? 'Quoting' : 'Replying to'}
              </span>
              <span className="text-xs text-muted-foreground">{replyingTo.senderName}</span>
              <div className="flex items-center gap-1 ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => setReplyMode(replyMode === 'reply' ? 'quote' : 'reply')}
                  title={replyMode === 'reply' ? 'Switch to quote' : 'Switch to reply'}
                >
                  <Quote className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={handleCopyOriginal}
                  title="Copy original message"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={handleForward}
                  title="Forward message"
                >
                  <Forward className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className={`bg-muted/50 rounded-lg p-3 ${
              replyMode === 'quote' ? 'border-l-4 border-primary' : 'border border-border/30'
            }`}>
              <p className="text-sm text-foreground line-clamp-3">
                {replyingTo.content}
              </p>
              {replyingTo.type !== 'text' && (
                <span className="text-xs text-muted-foreground italic mt-1 block">
                  {replyingTo.type === 'image' && '📷 Image'}
                  {replyingTo.type === 'file' && '📎 File'}
                  {replyingTo.type === 'voice' && '🎤 Voice message'}
                  {replyingTo.type === 'location' && '📍 Location'}
                  {replyingTo.type === 'video' && '🎥 Video'}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={onCancelReply}
            title="Cancel reply"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Reply Input */}
      <div className="p-3">
        <form onSubmit={handleSendReply} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`${replyMode === 'quote' ? 'Quote' : 'Reply to'} ${replyingTo.senderName}...`}
              className="bg-background/50 border-border/50 focus:border-primary/50 pr-20"
              autoFocus
            />
            
            {/* Reply Mode Indicator */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                replyMode === 'quote' 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {replyMode === 'quote' ? 'Quote' : 'Reply'}
              </span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!replyText.trim()}
            size="icon"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyMode('reply')}
            className={`text-xs ${replyMode === 'reply' ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Reply className="w-3 h-3 mr-1" />
            Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyMode('quote')}
            className={`text-xs ${replyMode === 'quote' ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Quote className="w-3 h-3 mr-1" />
            Quote
          </Button>
        </div>
      </div>
    </motion.div>
  );
}