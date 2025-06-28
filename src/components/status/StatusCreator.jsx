import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Camera, Type, Palette, Clock, X, Bold, Italic, Underline } from 'lucide-react';

export default function StatusCreator({ isOpen, onClose, onCreateStatus }) {
  const [statusText, setStatusText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#1a73e8');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('text-lg');
  const [fontWeight, setFontWeight] = useState('normal');
  const [textAlign, setTextAlign] = useState('center');
  const [gradient, setGradient] = useState(false);
  const [gradientColors, setGradientColors] = useState(['#1a73e8', '#9c27b0']);

  const backgroundColors = [
    '#1a73e8', '#34a853', '#ea4335', '#fbbc04',
    '#9c27b0', '#ff5722', '#607d8b', '#795548',
    '#e91e63', '#00bcd4', '#4caf50', '#ff9800'
  ];

  const textColors = [
    '#ffffff', '#000000', '#ff4444', '#44ff44', 
    '#4444ff', '#ffff44', '#ff44ff', '#44ffff'
  ];

  const fontSizes = [
    { label: 'Small', value: 'text-sm' },
    { label: 'Medium', value: 'text-lg' },
    { label: 'Large', value: 'text-xl' },
    { label: 'Extra Large', value: 'text-2xl' }
  ];

  const alignments = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' }
  ];

  const handleCreate = () => {
    if (!statusText.trim()) {
      toast({
        title: "Status Required",
        description: "Please enter some text for your status",
        variant: "destructive"
      });
      return;
    }

    const status = {
      id: Date.now(),
      type: 'text',
      content: statusText,
      backgroundColor: gradient ? 
        `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})` : 
        backgroundColor,
      textColor,
      fontSize,
      fontWeight,
      textAlign,
      gradient,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    onCreateStatus(status);
    setStatusText('');
    onClose();
  };

  const getPreviewStyle = () => {
    const style = {
      color: textColor,
      textAlign,
      fontWeight
    };

    if (gradient) {
      style.background = `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`;
    } else {
      style.backgroundColor = backgroundColor;
    }

    return style;
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
            Create Text Status
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Preview */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div 
              className="w-full h-64 flex items-center justify-center p-6"
              style={getPreviewStyle()}
            >
              <p 
                className={`${fontSize} font-medium max-w-full break-words`}
                style={{ 
                  color: textColor,
                  textAlign,
                  fontWeight
                }}
              >
                {statusText || 'Your status text will appear here...'}
              </p>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Status Text</label>
            <Input
              placeholder="What's on your mind?"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              className="text-lg"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {statusText.length}/200 characters
            </p>
          </div>

          {/* Background Style */}
          <div>
            <label className="text-sm font-medium mb-3 block">Background Style</label>
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant={!gradient ? "default" : "outline"}
                size="sm"
                onClick={() => setGradient(false)}
              >
                Solid Color
              </Button>
              <Button
                variant={gradient ? "default" : "outline"}
                size="sm"
                onClick={() => setGradient(true)}
              >
                Gradient
              </Button>
            </div>

            {!gradient ? (
              <div className="grid grid-cols-6 gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110 ${
                      backgroundColor === color ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBackgroundColor(color)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">First Color</label>
                  <div className="grid grid-cols-6 gap-2 mt-1">
                    {backgroundColors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 ${
                          gradientColors[0] === color ? 'border-primary' : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setGradientColors([color, gradientColors[1]])}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Second Color</label>
                  <div className="grid grid-cols-6 gap-2 mt-1">
                    {backgroundColors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 ${
                          gradientColors[1] === color ? 'border-primary' : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setGradientColors([gradientColors[0], color])}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Color */}
          <div>
            <label className="text-sm font-medium mb-2 block">Text Color</label>
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

          {/* Font Size */}
          <div>
            <label className="text-sm font-medium mb-2 block">Font Size</label>
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

          {/* Text Style */}
          <div>
            <label className="text-sm font-medium mb-2 block">Text Style</label>
            <div className="flex gap-2">
              <Button
                variant={fontWeight === 'normal' ? "default" : "outline"}
                size="sm"
                onClick={() => setFontWeight('normal')}
              >
                Normal
              </Button>
              <Button
                variant={fontWeight === 'bold' ? "default" : "outline"}
                size="sm"
                onClick={() => setFontWeight('bold')}
              >
                <Bold className="w-4 h-4 mr-1" />
                Bold
              </Button>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="text-sm font-medium mb-2 block">Text Alignment</label>
            <div className="grid grid-cols-3 gap-2">
              {alignments.map((align) => (
                <Button
                  key={align.value}
                  variant={textAlign === align.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTextAlign(align.value)}
                >
                  {align.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleCreate}>
              Share Status
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}