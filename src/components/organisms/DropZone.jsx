import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

function DropZone({ onFilesAdded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  }, [dragCounter]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      onFilesAdded(files);
      e.dataTransfer.clearData();
    }
  }, [onFilesAdded]);

  const handleFileSelect = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesAdded(files);
      e.target.value = ''; // Reset input
    }
  }, [onFilesAdded]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer max-w-full overflow-hidden ${
        isDragging
          ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5 scale-[1.02]'
          : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.mp4,.mp3"
      />
      
      <motion.div
        animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-6"
      >
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          isDragging ? 'bg-gradient-primary' : 'bg-surface'
        } transition-all duration-200`}>
          <ApperIcon 
            name={isDragging ? "Download" : "Upload"} 
            className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-gray-400'} transition-colors duration-200`} 
          />
        </div>
      </motion.div>

      <div className="space-y-4 max-w-full">
        <motion.h3 
          animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
          className={`text-xl font-semibold ${isDragging ? 'text-primary' : 'text-gray-900'} transition-colors duration-200`}
        >
          {isDragging ? 'Drop your files here!' : 'Upload your files'}
        </motion.h3>
        
        <p className="text-gray-500 break-words">
          Drag and drop your files here, or click to browse
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
          <span className="px-2 py-1 bg-gray-100 rounded-md">Images</span>
          <span className="px-2 py-1 bg-gray-100 rounded-md">PDFs</span>
          <span className="px-2 py-1 bg-gray-100 rounded-md">Documents</span>
          <span className="px-2 py-1 bg-gray-100 rounded-md">Videos</span>
        </div>
        
        <p className="text-xs text-gray-400">
          Maximum file size: 100MB
        </p>
      </div>

      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl pointer-events-none"
        />
      )}
    </motion.div>
  );
}

export default DropZone;