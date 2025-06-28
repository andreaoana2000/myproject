import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Link
} from 'lucide-react';

export default function AdvancedTextStyler({ 
  isOpen, 
  onClose, 
  onApplyStyle, 
  selectedText = '',
  cursorPosition = 0 
}) {
  const [activeStyles, setActiveStyles] = useState(new Set());
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState(400);
  const [textAlign, setTextAlign] = useState('left');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const textColors = [
    '#ffffff', '#000000', '#ff4444', '#44ff44', '#4444ff', 
    '#ffff44', '#ff44ff', '#44ffff', '#ff8844', '#8844ff',
    '#88ff44', '#4488ff', '#ff4488', '#888888', '#444444', '#cccccc'
  ];

  const backgroundColors = [
    'transparent', '#ffffff', '#000000', '#ff4444', '#44ff44', '#4444ff', 
    '#ffff44', '#ff44ff', '#44ffff', '#ff8844', '#8844ff',
    '#88ff44', '#4488ff', '#ff4488', '#f0f0f0', '#e0e0e0'
  ];

  const styleButtons = [
    { id: 'bold', icon: Bold, label: 'Bold', markdown: '**', shortcut: 'Ctrl+B' },
    { id: 'italic', icon: Italic, label: 'Italic', markdown: '*', shortcut: 'Ctrl+I' },
    { id: 'underline', icon: Underline, label: 'Underline', markdown: '__', shortcut: 'Ctrl+U' },
    { id: 'strikethrough', icon: Strikethrough, label: 'Strikethrough', markdown: '~~', shortcut: 'Ctrl+Shift+X' },
    { id: 'code', icon: Code, label: 'Code', markdown: '`', shortcut: 'Ctrl+`' },
    { id: 'quote', icon: Quote, label: 'Quote', markdown: '> ', shortcut: 'Ctrl+Shift+.' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight', markdown: '==', shortcut: 'Ctrl+H' },
    { id: 'link', icon: Link, label: 'Link', markdown: '[text](url)', shortcut: 'Ctrl+K' }
  ];

  const alignmentOptions = [
    { id: 'left', icon: AlignLeft, label: 'Left' },
    { id: 'center', icon: AlignCenter, label: 'Center' },
    { id: 'right', icon: AlignRight, label: 'Right' }
  ];

  const fontSizes = [
    { label: 'Tiny', value: 12 },
    { label: 'Small', value: 14 },
    { label: 'Normal', value: 16 },
    { label: 'Large', value: 18 },
    { label: 'Extra Large', value: 24 },
    { label: 'Huge', value: 32 }
  ];

  const fontWeights = [
    { label: 'Light', value: 300 },
    { label: 'Normal', value: 400 },
    { label: 'Medium', value: 500 },
    { label: 'Bold', value: 700 },
    { label: 'Extra Bold', value: 900 }
  ];

  const toggleStyle = (styleId) => {
    const newActiveStyles = new Set(activeStyles);
    if (newActiveStyles.has(styleId)) {
      newActiveStyles.delete(styleId);
    } else {
      newActiveStyles.add(styleId);
      if (styleId === 'link') {
        setShowLinkInput(true);
      }
    }
    setActiveStyles(newActiveStyles);
  };

  const applyStyles = () => {
    let styledText = selectedText || 'Sample text';
    
    // Apply markdown-style formatting
    activeStyles.forEach(styleId => {
      const style = styleButtons.find(s => s.id === styleId);
      if (style) {
        if (styleId === 'quote') {
          styledText = `${style.markdown}${styledText}`;
        } else if (styleId === 'link' && linkUrl) {
          styledText = `[${styledText}](${linkUrl})`;
        } else if (styleId !== 'link') {
          styledText = `${style.markdown}${styledText}${style.markdown}`;
        }
      }
    });

    const styleData = {
      text: styledText,
      styles: {
        color: textColor,
        backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined,
        fontSize: fontSize !== 16 ? `${fontSize}px` : undefined,
        fontWeight: fontWeight !== 400 ? fontWeight : undefined,
        textAlign: textAlign !== 'left' ? textAlign : undefined,
        activeStyles: Array.from(activeStyles)
      }
    };

    onApplyStyle(styleData);
    onClose();
  };

  const resetStyles = () => {
    setActiveStyles(new Set());
    setTextColor('#ffffff');
    setBackgroundColor('transparent');
    setFontSize(16);
    setFontWeight(400);
    setTextAlign('left');
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const getPreviewStyles = () => {
    let styles = {
      color: textColor,
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      textAlign: textAlign
    };

    if (backgroundColor !== 'transparent') {
      styles.backgroundColor = backgroundColor;
      styles.padding = '4px 8px';
      styles.borderRadius = '4px';
    }

    if (activeStyles.has('bold')) styles.fontWeight = 'bold';
    if (activeStyles.has('italic')) styles.fontStyle = 'italic';
    if (activeStyles.has('underline')) styles.textDecoration = 'underline';
    if (activeStyles.has('strikethrough')) styles.textDecoration = 'line-through';

    return styles;
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
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Type className="w-5 h-5" />
            Advanced Text Styling
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Preview */}
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <div 
              className="min-h-[60px] flex items-center justify-center border border-dashed border-border rounded p-4"
              style={getPreviewStyles()}
            >
              {selectedText || 'Sample text with styling'}
            </div>
          </div>

          {/* Style Buttons */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Text Formatting:</Label>
            <div className="grid grid-cols-4 gap-2">
              {styleButtons.map((style) => {
                const Icon = style.icon;
                return (
                  <Button
                    key={style.id}
                    variant={activeStyles.has(style.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleStyle(style.id)}
                    className="flex items-center gap-2"
                    title={`${style.label} (${style.shortcut})`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{style.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Link URL Input */}
          <AnimatePresence>
            {showLinkInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="linkUrl">Link URL:</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Alignment */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Text Alignment:</Label>
            <div className="flex gap-2">
              {alignmentOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant={textAlign === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTextAlign(option.id)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Font Size: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              max={48}
              min={8}
              step={1}
              className="w-full"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
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

          {/* Font Weight */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Font Weight:</Label>
            <div className="grid grid-cols-3 gap-2">
              {fontWeights.map((weight) => (
                <Button
                  key={weight.value}
                  variant={fontWeight === weight.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFontWeight(weight.value)}
                >
                  {weight.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div>
            <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Text Color:
            </Label>
            <div className="grid grid-cols-8 gap-2">
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

          {/* Background Color */}
          <div>
            <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
              <Highlighter className="w-4 h-4" />
              Background Color:
            </Label>
            <div className="grid grid-cols-8 gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    backgroundColor === color ? 'border-primary scale-110' : 'border-border'
                  } ${color === 'transparent' ? 'bg-gradient-to-br from-red-500 to-red-500' : ''}`}
                  style={{ 
                    backgroundColor: color === 'transparent' ? 'transparent' : color,
                    backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                    backgroundSize: color === 'transparent' ? '8px 8px' : 'auto',
                    backgroundPosition: color === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                  }}
                  onClick={() => setBackgroundColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={resetStyles}>
              Reset
            </Button>
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