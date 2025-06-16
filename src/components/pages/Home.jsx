import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '@/components/organisms/DropZone';
import FileList from '@/components/organisms/FileList';
import UploadStats from '@/components/organisms/UploadStats';
import FilePreviewModal from '@/components/organisms/FilePreviewModal';
import { fileService, uploadSessionService } from '@/services';

function Home() {
  const [files, setFiles] = useState([]);
  const [uploadSession, setUploadSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [filesData, sessionData] = await Promise.all([
        fileService.getAll(),
        uploadSessionService.getCurrentSession()
      ]);
      setFiles(filesData);
      setUploadSession(sessionData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilesAdded = async (newFiles) => {
    try {
      const validatedFiles = [];
      
      for (const file of newFiles) {
        try {
          fileService.validateFile(file);
          
          const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
          };
          
          const createdFile = await fileService.create(fileData);
          validatedFiles.push(createdFile);
        } catch (validationError) {
          toast.error(`${file.name}: ${validationError.message}`);
        }
      }

      if (validatedFiles.length > 0) {
        setFiles(prev => [...validatedFiles, ...prev]);
        toast.success(`${validatedFiles.length} file(s) added successfully`);
        
        // Create or update upload session
        if (!uploadSession) {
          const newSession = await uploadSessionService.create({
            totalFiles: validatedFiles.length,
            completedFiles: 0,
            totalSize: validatedFiles.reduce((sum, f) => sum + f.size, 0),
            uploadedSize: 0
          });
          setUploadSession(newSession);
        } else {
          const updatedSession = await uploadSessionService.update(uploadSession.id, {
            totalFiles: uploadSession.totalFiles + validatedFiles.length,
            totalSize: uploadSession.totalSize + validatedFiles.reduce((sum, f) => sum + f.size, 0)
          });
          setUploadSession(updatedSession);
        }
      }
    } catch (err) {
      toast.error('Failed to add files');
    }
  };

  const handleFileRemove = async (fileId) => {
    try {
      await fileService.delete(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File removed successfully');
    } catch (err) {
      toast.error('Failed to remove file');
    }
  };

  const handleUploadStart = async (fileId) => {
    try {
      await fileService.simulateUpload(fileId, (progress, speed) => {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress, uploadSpeed: speed }
            : f
        ));
      });
      
      // Update files state after successful upload
      const updatedFile = await fileService.getById(fileId);
      setFiles(prev => prev.map(f => f.id === fileId ? updatedFile : f));
      
      toast.success('File uploaded successfully');
    } catch (err) {
      const updatedFile = await fileService.getById(fileId);
      setFiles(prev => prev.map(f => f.id === fileId ? updatedFile : f));
      toast.error('Upload failed');
    }
  };

  const handlePreviewFile = (file) => {
    setPreviewFile(file);
  };

  const pendingFiles = files.filter(f => f.status === 'pending');
  const activeUploads = files.filter(f => f.status === 'uploading');
  const completedFiles = files.filter(f => f.status === 'success');

  return (
    <div className="min-h-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DropZone onFilesAdded={handleFilesAdded} />
            </motion.div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FileList
                    files={files}
                    onRemove={handleFileRemove}
                    onUpload={handleUploadStart}
                    onPreview={handlePreviewFile}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <UploadStats
                totalFiles={files.length}
                pendingFiles={pendingFiles.length}
                activeUploads={activeUploads.length}
                completedFiles={completedFiles.length}
                uploadSession={uploadSession}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <FilePreviewModal
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;