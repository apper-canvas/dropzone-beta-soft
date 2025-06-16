import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

function UploadStats({ totalFiles, pendingFiles, activeUploads, completedFiles, uploadSession }) {
  const stats = [
    {
      label: 'Total Files',
      value: totalFiles,
      icon: 'Files',
      color: 'text-gray-600',
      bg: 'bg-gray-100'
    },
    {
      label: 'Ready to Upload',
      value: pendingFiles,
      icon: 'Clock',
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    {
      label: 'Uploading',
      value: activeUploads,
      icon: 'Upload',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      label: 'Completed',
      value: completedFiles,
      icon: 'CheckCircle',
      color: 'text-success',
      bg: 'bg-success/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Statistics</h3>
        
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <ApperIcon name={stat.icon} className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
              </div>
              <motion.span
                key={stat.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={`text-lg font-bold ${stat.color}`}
              >
                {stat.value}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload Progress Summary */}
      {totalFiles > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <h4 className="text-md font-semibold text-gray-900 mb-4">Session Progress</h4>
          
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-primary rounded-full"
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>{completedFiles} of {totalFiles} files</span>
              <span>{totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0}%</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
      >
        <h4 className="text-md font-semibold text-gray-900 mb-4">Quick Actions</h4>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={pendingFiles === 0}
            className="w-full py-2 px-4 bg-gradient-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
          >
            Upload All ({pendingFiles})
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={totalFiles === 0}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
          >
            Clear All
          </motion.button>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Pro Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Drag multiple files at once</li>
              <li>• Maximum file size: 100MB</li>
              <li>• Supported: Images, PDFs, Documents</li>
              <li>• Files upload automatically</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UploadStats;