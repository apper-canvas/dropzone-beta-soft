import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Upload" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DropZone Pro</h1>
              <p className="text-sm text-gray-500">Upload and manage files efficiently</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Ready to Upload</p>
              <p className="text-xs text-gray-500">Drag files or click to browse</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;