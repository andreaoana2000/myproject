import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmojiPicker from '@/components/chat/EmojiPicker';
import { 
  Smile,
  Paperclip,
  Mic,
  Send,
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough
} from 'lucide-react';

export default function ChannelInput({
  newMessage,
  showEmojiPicker,
  channelName,
  onMessageChange,
  onSendMessage,
  onToggleEmojiPicker,
  onEmojiSelect,
  onFileUpload,
  onVoiceRecord,
  onApplyStyle
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const styleButtons = [
    { icon: Bold, style: 'bold', shortcut: 'Ctrl+B' },
    { icon: Italic, style: 'italic', shortcut: 'Ctrl+I' },
    { icon: Underline, style: 'underline', shortcut: 'Ctrl+U' },
    { icon: Strikethrough, style: 'strikethrough', shortcut: 'Ctrl+Shift+X' },
    { icon: Code, style: 'code', shortcut: 'Ctrl+`' }
  ];

  return (
    <div className="border-t border-border bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm p-4">
      {/* Style Toolbar */}
      <div className="flex items-center gap-1 mb-3 p-2 bg-muted/30 rounded-lg">
        {styleButtons.map(({ icon: Icon, style, shortcut }) => (
          <Button
            key={style}
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:bg-primary/20 transition-all duration-200"
            onClick={() => onApplyStyle(style)}
            title={`${style} (${shortcut})`}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder={`Message #${channelName}...`}
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pr-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-primary/20 transition-all duration-200"
              onClick={onToggleEmojiPicker}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onFileUpload}
          className="hover:bg-primary/20 transition-all duration-200"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onVoiceRecord}
          className="hover:bg-primary/20 transition-all duration-200"
        >
          <Mic className="w-4 h-4" />
        </Button>

        <Button 
          onClick={onSendMessage} 
          disabled={!newMessage.trim()}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 right-4 z-50"
          >
            <EmojiPicker
              onEmojiSelect={onEmojiSelect}
              onClose={() => onToggleEmojiPicker(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}