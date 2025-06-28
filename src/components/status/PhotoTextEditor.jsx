
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Type, Palette } from 'lucide-react';

export default function PhotoTextEditor({ 
  statusText, 
  setStatusText, 
  textColor, 
  setTextColor, 
  fontSize, 
  setFontSize, 
  textPosition, 
  setTextPosition 
}) {
  const textColors = [
    '#ffffff', '#000000', '#ff4444', '#44ff44', '#4444ff', 
    '#ffff44', '#ff44ff', '#44ffff', '#ff8844', '#8844ff'
  ];

  const fontSizes = [
    { label: 'Small', value: 'text-lg' },
    { label: 'Medium', value: 'text-xl' },
    { label: 'Large', value: 'text-2xl' },
    { label: 'Extra Large', value: 'text-3xl' }
  ];

  return (
    <div className="space-y-4">
      {/* Text Input */}
      <div>
        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
          <Type className="w-4 h-4" />
          Add Text
        </label>
        <Input
          placeholder="Add text to your photo..."
          value={statusText}
          onChange={(e) => setStatusText(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Text Styling */}
      {statusText && (
        <>
          {/* Text Color */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Text Color
            </label>
            <div className="flex gap-2">
              {textColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    textColor === color ? 'border-primary scale-110' : 'border-border'
                  } transition-transform hover:scale-110`}
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

          {/* Text Position */}
          <div>
            <label className="text-sm font-medium mb-2 block">Text Position</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={textPosition.y === 20 ? "default" : "outline"}
                size="sm"
                onClick={() => setTextPosition({ x: 50, y: 20 })}
              >
                Top
              </Button>
              <Button
                variant={textPosition.y === 50 ? "default" : "outline"}
                size="sm"
                onClick={() => setTextPosition({ x: 50, y: 50 })}
              >
                Center
              </Button>
              <Button
                variant={textPosition.y === 80 ? "default" : "outline"}
                size="sm"
                onClick={() => setTextPosition({ x: 50, y: 80 })}
              >
                Bottom
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
