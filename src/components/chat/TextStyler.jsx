
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Quote, 
  List, 
  ListOrdered,
  Type,
  Palette,
  X
} from 'lucide-react';

export default function TextStyler({ 
  isOpen, 
  onClose, 
  onApplyStyle, 
  selectedText = '',
  cursorPosition = 0 
}) {
  const [activeStyles, setActiveStyles] = useState(new Set());
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('normal');

  const textColors = [
    '#ffffff', '#ff4444', '#44ff44', '#4444ff', 
    '#ffff44', '#ff44ff', '#44ffff', '#ff8844',
    '#8844ff', '#44ff88', '#888888', '#000000'
  ];

  const fontSizes = [
    { label: 'Small', value: 'small', class: 'text-sm' },
    { label: 'Normal', value: 'normal', class: 'text-base' },
    { label: 'Large', value: 'large', class: 'text-lg' },
    { label: 'Extra Large', value: 'xl', class: 'text-xl' }
  ];

  const styleButtons = [
    { id: 'bold', icon: Bold, label: 'Bold', markdown: '**', class: 'font-bold' },
    { id: 'italic', icon: Italic, label: 'Italic', markdown: '*', class: 'italic' },
    { id: 'underline', icon: Underline, label: 'Underline', markdown: '__', class: 'underline' },
    { id: 'strikethrough', icon: Strikethrough, label: 'Strikethrough', markdown: '~~', class: 'line-through' },
    { id: 'code', icon: Code, label: 'Code', markdown: '`', class: 'font-mono bg-muted px-1 rounded' },
    { id: 'quote', icon: Quote, label: 'Quote', markdown: '> ', class: 'border-l-4 border-primary pl-3 italic' }
  ];

  const toggleStyle = (styleId) => {
    const newActiveStyles = new Set(activeStyles);
    if (newActiveStyles.has(styleId)) {
      newActiveStyles.delete(styleId);
    } else {
      newActiveStyles.add(styleId);
    }
    setActiveStyles(newActiveStyles);
  };

  const applyStyles = () => {
    const styles = {
      activeStyles: Array.from(activeStyles),
      textColor,
      fontSize,
      selectedText
    };
    onApplyStyle(styles);
    onClose();
  };

  const generateStyledText = () => {
    let styledText = selectedText || 'Sample text';
    
    // Apply markdown-style formatting
    activeStyles.forEach(styleId => {
      const style = styleButtons.find(s => s.id === styleId);
      if (style) {
        if (styleId === 'quote') {
          styledText = `${style.markdown}${styledText}`;
        } else {
          styledText = `${style.markdown}${styledText}${style.markdown}`;
        }
      }
    });

    return styledText;
  };

  const getPreviewClasses = () => {
    let classes = fontSizes.find(f => f.value === fontSize)?.class || 'text-base';
    
    activeStyles.forEach(styleId => {
      const style = styleButtons.find(s => s.id === styleId);
      if (style) {
        classes += ` ${style.class}`;
      }
    });

    return classes;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-lg w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Type className="w-5 h-5" />
            Text Styling
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Preview */}
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <p 
              className={getPreviewClasses()}
              style={{ color: textColor }}
            >
              {selectedText || 'Sample text with styling'}
            </p>
          </div>

          {/* Style Buttons */}
          <div>
            <p className="text-sm font-medium mb-2">Text Formatting:</p>
            <div className="grid grid-cols-3 gap-2">
              {styleButtons.map((style) => {
                const Icon = style.icon;
                return (
                  <Button
                    key={style.id}
                    variant={activeStyles.has(style.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleStyle(style.id)}
                    className="flex items-center gap-1"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{style.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <p className="text-sm font-medium mb-2">Font Size:</p>
            <div className="grid grid-cols-2 gap-2">
              {fontSizes.map((size) => (
                <Button
                  key={size.value}
                  variant={fontSize === size.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFontSize(size.value)}
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div>
            <p className="text-sm font-medium mb-2">Text Color:</p>
            <div className="grid grid-cols-6 gap-2">
              {textColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    textColor === color ? 'border-primary scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setTextColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Markdown Output */}
          {activeStyles.size > 0 && (
            <div className="border border-border rounded-lg p-3 bg-muted/10">
              <p className="text-xs text-muted-foreground mb-1">Markdown:</p>
              <code className="text-xs font-mono text-primary">
                {generateStyledText()}
              </code>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={applyStyles}>
              Apply Styling
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
