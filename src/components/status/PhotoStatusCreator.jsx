
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import PhotoCapture from '@/components/status/PhotoCapture';
import PhotoPreview from '@/components/status/PhotoPreview';
import PhotoFilters from '@/components/status/PhotoFilters';
import PhotoTextEditor from '@/components/status/PhotoTextEditor';
import { Camera, X } from 'lucide-react';

export default function PhotoStatusCreator({ isOpen, onClose, onCreateStatus }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [statusText, setStatusText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [fontSize, setFontSize] = useState('text-xl');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [showCamera, setShowCamera] = useState(false);
  const streamRef = useRef(null);

  const handleCreatePhotoStatus = () => {
    if (!capturedImage) {
      toast({
        title: "Photo Required",
        description: "Please capture or upload a photo first",
        variant: "destructive"
      });
      return;
    }

    const status = {
      id: Date.now(),
      type: 'photo',
      content: statusText,
      photoUrl: capturedImage,
      textColor,
      textPosition,
      fontSize,
      filter: selectedFilter,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    onCreateStatus(status);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCapturedImage(null);
    setStatusText('');
    setTextColor('#ffffff');
    setTextPosition({ x: 50, y: 50 });
    setFontSize('text-xl');
    setSelectedFilter('none');
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
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
            <Camera className="w-5 h-5" />
            Create Photo Status
          </h3>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Photo Capture/Upload */}
          {!capturedImage && (
            <PhotoCapture
              onPhotoCapture={setCapturedImage}
              showCamera={showCamera}
              setShowCamera={setShowCamera}
              streamRef={streamRef}
            />
          )}

          {/* Photo Preview & Editing */}
          {capturedImage && (
            <div className="space-y-4">
              <PhotoPreview
                capturedImage={capturedImage}
                statusText={statusText}
                textColor={textColor}
                textPosition={textPosition}
                fontSize={fontSize}
                selectedFilter={selectedFilter}
                onReset={() => setCapturedImage(null)}
              />

              <PhotoFilters
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />

              <PhotoTextEditor
                statusText={statusText}
                setStatusText={setStatusText}
                textColor={textColor}
                setTextColor={setTextColor}
                fontSize={fontSize}
                setFontSize={setFontSize}
                textPosition={textPosition}
                setTextPosition={setTextPosition}
              />

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreatePhotoStatus}>
                  Share Photo Status
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
