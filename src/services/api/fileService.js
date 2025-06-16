import fileData from '../mockData/files.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FileService {
  constructor() {
    this.files = [...fileData];
  }

  async getAll() {
    await delay(300);
    return [...this.files];
  }

  async getById(id) {
    await delay(200);
    const file = this.files.find(f => f.id === id);
    if (!file) throw new Error('File not found');
    return { ...file };
  }

  async create(fileData) {
    await delay(400);
    const newFile = {
      ...fileData,
      id: Date.now().toString(),
      status: 'pending',
      progress: 0,
      uploadSpeed: 0,
      error: null
    };
    this.files.unshift(newFile);
    return { ...newFile };
  }

  async update(id, updates) {
    await delay(200);
    const index = this.files.findIndex(f => f.id === id);
    if (index === -1) throw new Error('File not found');
    
    this.files[index] = { ...this.files[index], ...updates };
    return { ...this.files[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.files.findIndex(f => f.id === id);
    if (index === -1) throw new Error('File not found');
    
    const deletedFile = this.files.splice(index, 1)[0];
    return { ...deletedFile };
  }

  async simulateUpload(id, onProgress) {
    const file = this.files.find(f => f.id === id);
    if (!file) throw new Error('File not found');

    // Start upload
    await this.update(id, { status: 'uploading', progress: 0 });

    return new Promise((resolve, reject) => {
      let progress = 0;
      const startTime = Date.now();
      
      const interval = setInterval(async () => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        const elapsed = (Date.now() - startTime) / 1000;
        const uploadSpeed = (file.size * (progress / 100)) / elapsed;

        try {
          await this.update(id, { 
            progress: Math.round(progress), 
            uploadSpeed: Math.round(uploadSpeed)
          });
          
          if (onProgress) {
            onProgress(Math.round(progress), Math.round(uploadSpeed));
          }

          if (progress >= 100) {
            clearInterval(interval);
            
            // Simulate occasional failures
            if (Math.random() < 0.1) {
              await this.update(id, { 
                status: 'error', 
                error: 'Upload failed. Please try again.' 
              });
              reject(new Error('Upload failed'));
            } else {
              await this.update(id, { status: 'success' });
              resolve();
            }
          }
        } catch (error) {
          clearInterval(interval);
          await this.update(id, { 
            status: 'error', 
            error: error.message 
          });
          reject(error);
        }
      }, 200 + Math.random() * 300);
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileTypeIcon(type) {
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Music';
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('document') || type.includes('word')) return 'FileText';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'FileSpreadsheet';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'FileSliders';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    return 'File';
  }

  validateFile(file) {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'video/mp4',
      'audio/mpeg'
    ];

    if (file.size > maxSize) {
      throw new Error(`File size exceeds 100MB limit`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type not supported: ${file.type}`);
    }

    return true;
  }
}

export default new FileService();