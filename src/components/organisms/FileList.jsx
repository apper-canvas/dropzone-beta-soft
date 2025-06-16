import { motion, AnimatePresence } from 'framer-motion';
import FileItem from '@/components/molecules/FileItem';

function FileList({ files, onRemove, onUpload, onPreview }) {
  const pendingFiles = files.filter(f => f.status === 'pending');
  const uploadingFiles = files.filter(f => f.status === 'uploading');
  const completedFiles = files.filter(f => f.status === 'success' || f.status === 'error');

  const renderSection = (title, fileList, showUploadAll = false) => {
    if (fileList.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showUploadAll && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileList.forEach(file => onUpload(file.id))}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              Upload All
            </motion.button>
          )}
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {fileList.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FileItem
                  file={file}
                  onRemove={onRemove}
                  onUpload={onUpload}
                  onPreview={onPreview}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {renderSection('Ready to Upload', pendingFiles, true)}
      {renderSection('Uploading', uploadingFiles)}
      {renderSection('Completed', completedFiles)}
    </div>
  );
}

export default FileList;