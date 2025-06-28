import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Upload, Image, File, Video, X, Check } from 'lucide-react';

export default function FileUpload({ isOpen, onClose, onFileSelect }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    
    switch (type) {
      case 'image':
        input.accept = 'image/*';
        break;
      case 'video':
        input.accept = 'video/*';
        break;
      case 'document':
        input.accept = '.pdf,.doc,.docx,.txt,.xlsx,.pptx';
        break;
      default:
        input.accept = '*/*';
    }

    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      handleFiles(files);
    };

    input.click();
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    const processedFiles = validFiles.map(file => {
      let previewUrl = null;
      let fileType = 'document';

      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
        fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        previewUrl = URL.createObjectURL(file);
        fileType = 'video';
      }

      return {
        file,
        name: file.name,
        size: file.size,
        type: fileType,
        mimeType: file.type,
        previewUrl,
        id: Math.random().toString(36).substr(2, 9)
      };
    });

    setSelectedFiles(prev => [...prev, ...processedFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up preview URLs
      const removed = prev.find(f => f.id === fileId);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return updated;
    });
  };

  const sendFiles = () => {
    selectedFiles.forEach(fileData => {
      onFileSelect(fileData);
    });
    
    // Clean up preview URLs
    selectedFiles.forEach(fileData => {
      if (fileData.previewUrl) {
        URL.revokeObjectURL(fileData.previewUrl);
      }
    });
    
    setSelectedFiles([]);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Share Files</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* File Type Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => handleFileSelect('image')}
            >
              <Image className="w-8 h-8" />
              <span className="text-sm">Photos</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => handleFileSelect('video')}
            >
              <Video className="w-8 h-8" />
              <span className="text-sm">Videos</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => handleFileSelect('document')}
            >
              <File className="w-8 h-8" />
              <span className="text-sm">Documents</span>
            </Button>
          </div>

          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click the buttons above to browse
            </p>
            <Button
              variant="outline"
              onClick={() => handleFileSelect('all')}
            >
              Browse Files
            </Button>
          </div>

          {/* Selected Files */}
          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 max-h-60 overflow-y-auto"
              >
                <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                {selectedFiles.map((fileData) => (
                  <motion.div
                    key={fileData.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border"
                  >
                    {fileData.type === 'image' && fileData.previewUrl ? (
                      <img 
                        src={fileData.previewUrl} 
                        alt={fileData.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : fileData.type === 'video' && fileData.previewUrl ? (
                      <video 
                        src={fileData.previewUrl}
                        className="w-12 h-12 object-cover rounded"
                        muted
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/20 rounded flex items-center justify-center">
                        <File className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{fileData.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(fileData.size)} • {fileData.type}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => removeFile(fileData.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={sendFiles}
              disabled={selectedFiles.length === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              Send {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </Button>
          </div>

          {/* File Limits Notice */}
          <div className="text-xs text-muted-foreground text-center">
            Maximum file size: 10MB per file
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}