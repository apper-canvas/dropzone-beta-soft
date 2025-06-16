import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { fileService } from '@/services';

function FilePreviewModal({ file, onClose }) {
  const [zoom, setZoom] = useState(1);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const isImage = file.type.startsWith('image/');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
              <ApperIcon
                name={fileService.getFileTypeIcon(file.type)}
                className="w-5 h-5 text-gray-600"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {fileService.formatFileSize(file.size)} • {file.type}
              </p>
            </div>
          </div>
          
          {isImage && (
            <div className="flex items-center space-x-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomOut}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                title="Zoom out"
              >
                <ApperIcon name="ZoomOut" className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetZoom}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {Math.round(zoom * 100)}%
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomIn}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                title="Zoom in"
              >
                <ApperIcon name="ZoomIn" className="w-4 h-4" />
              </motion.button>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg ml-2"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto max-h-[calc(90vh-120px)]">
          {isImage && file.preview ? (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <motion.img
                src={file.preview}
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                style={{ transform: `scale(${zoom})` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon
                  name={fileService.getFileTypeIcon(file.type)}
                  className="w-12 h-12 text-gray-400"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview not available</h3>
              <p className="text-gray-500 mb-6 break-words">
                This file type cannot be previewed in the browser.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Download File
              </motion.button>
            </div>
          )}
        </div>

        {/* Footer */}
        {file.status === 'success' && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2 text-sm text-success">
              <ApperIcon name="CheckCircle" className="w-4 h-4" />
              <span>Upload completed successfully</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              Download
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default FilePreviewModal;