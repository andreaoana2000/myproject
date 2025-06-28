
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function PhotoPreview({ 
  capturedImage, 
  statusText, 
  textColor, 
  textPosition, 
  fontSize, 
  selectedFilter, 
  onReset 
}) {
  const getFilterStyle = () => {
    const filterMap = {
      sepia: 'sepia(100%)',
      grayscale: 'grayscale(100%)',
      blur: 'blur(1px)',
      brightness: 'brightness(120%)',
      contrast: 'contrast(120%)'
    };
    
    return selectedFilter && selectedFilter !== 'none' 
      ? { filter: filterMap[selectedFilter] || 'none' } 
      : {};
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <img
        src={capturedImage}
        alt="Status preview"
        className="w-full h-64 object-cover"
        style={getFilterStyle()}
      />
      
      {/* Text Overlay */}
      {statusText && (
        <div
          className={`absolute ${fontSize} font-bold text-center pointer-events-none`}
          style={{
            color: textColor,
            left: `${textPosition.x}%`,
            top: `${textPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {statusText}
        </div>
      )}
      
      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        size="icon"
        className="absolute top-2 right-2"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
}
