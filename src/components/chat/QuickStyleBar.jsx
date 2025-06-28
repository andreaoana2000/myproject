
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Type,
  Palette
} from 'lucide-react';

export default function QuickStyleBar({ 
  onStyleClick, 
  onOpenFullStyler, 
  selectedText = '' 
}) {
  const quickStyles = [
    { id: 'bold', icon: Bold, markdown: '**', tooltip: 'Bold' },
    { id: 'italic', icon: Italic, markdown: '*', tooltip: 'Italic' },
    { id: 'underline', icon: Underline, markdown: '__', tooltip: 'Underline' },
    { id: 'code', icon: Code, markdown: '`', tooltip: 'Code' }
  ];

  const handleQuickStyle = (style) => {
    const styledText = selectedText 
      ? `${style.markdown}${selectedText}${style.markdown}`
      : `${style.markdown}text${style.markdown}`;
    
    onStyleClick(styledText, style.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-1 p-2 bg-card border border-border rounded-lg shadow-lg"
    >
      {quickStyles.map((style) => {
        const Icon = style.icon;
        return (
          <Button
            key={style.id}
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => handleQuickStyle(style)}
            title={style.tooltip}
          >
            <Icon className="w-3 h-3" />
          </Button>
        );
      })}
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onOpenFullStyler}
        title="More Styles"
      >
        <Type className="w-3 h-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onOpenFullStyler}
        title="Text Color"
      >
        <Palette className="w-3 h-3" />
      </Button>
    </motion.div>
  );
}
