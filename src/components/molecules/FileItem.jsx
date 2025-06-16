import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { fileService } from '@/services';

function FileItem({ file, onRemove, onUpload, onPreview }) {
  const getStatusColor = () => {
    switch (file.status) {
      case 'pending': return 'text-gray-500';
      case 'uploading': return 'text-primary';
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = () => {
    switch (file.status) {
      case 'pending': return 'bg-gray-100';
      case 'uploading': return 'bg-primary/10';
      case 'success': return 'bg-success/10';
      case 'error': return 'bg-error/10';
      default: return 'bg-gray-100';
    }
  };

  const formatSpeed = (bytesPerSecond) => {
    if (!bytesPerSecond) return '';
    const mbps = bytesPerSecond / (1024 * 1024);
    return `${mbps.toFixed(1)} MB/s`;
  };

  const estimateTimeRemaining = () => {
    if (file.status !== 'uploading' || !file.uploadSpeed || file.progress >= 100) return '';
    const remainingBytes = file.size * ((100 - file.progress) / 100);
    const seconds = remainingBytes / file.uploadSpeed;
    return `${Math.ceil(seconds)}s remaining`;
  };

  return (
    <motion.div
      whileHover={{ y: -2, shadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 max-w-full overflow-hidden"
    >
      <div className="flex items-center space-x-4 min-w-0">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => onPreview(file)}
            >
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusBg()}`}>
              <ApperIcon
                name={fileService.getFileTypeIcon(file.type)}
                className={`w-6 h-6 ${getStatusColor()}`}
              />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
              <p className="text-xs text-gray-500">
                {fileService.formatFileSize(file.size)}
                {file.uploadSpeed > 0 && (
                  <span className="ml-2">{formatSpeed(file.uploadSpeed)}</span>
                )}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg()} ${getStatusColor()}`}>
              {file.status === 'pending' && 'Ready'}
              {file.status === 'uploading' && `${file.progress}%`}
              {file.status === 'success' && 'Complete'}
              {file.status === 'error' && 'Failed'}
            </div>
          </div>

          {/* Progress Bar */}
          {(file.status === 'uploading' || file.status === 'success') && (
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full rounded-full ${
                    file.status === 'success' ? 'bg-gradient-success' : 'bg-gradient-primary'
                  }`}
                />
              </div>
              {file.status === 'uploading' && (
                <p className="text-xs text-gray-500 mt-1">{estimateTimeRemaining()}</p>
              )}
            </div>
          )}

          {/* Error Message */}
          {file.error && (
            <p className="text-xs text-error bg-error/10 px-2 py-1 rounded mt-2 break-words">
              {file.error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          {file.status === 'pending' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpload(file.id)}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
              title="Upload file"
            >
              <ApperIcon name="Upload" className="w-4 h-4" />
            </motion.button>
          )}
          
          {file.status === 'success' && file.preview && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPreview(file)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Preview file"
            >
              <ApperIcon name="Eye" className="w-4 h-4" />
            </motion.button>
          )}

          {file.status !== 'uploading' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(file.id)}
              className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors duration-200"
              title="Remove file"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default FileItem;