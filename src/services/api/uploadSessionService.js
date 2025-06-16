import sessionData from '../mockData/uploadSessions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UploadSessionService {
  constructor() {
    this.sessions = [...sessionData];
  }

  async create(sessionData) {
    await delay(200);
    const newSession = {
      ...sessionData,
      id: Date.now().toString(),
      startTime: new Date().toISOString()
    };
    this.sessions.unshift(newSession);
    return { ...newSession };
  }

  async update(id, updates) {
    await delay(100);
    const index = this.sessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Session not found');
    
    this.sessions[index] = { ...this.sessions[index], ...updates };
    return { ...this.sessions[index] };
  }

  async getCurrentSession() {
    await delay(100);
    const current = this.sessions[0];
    return current ? { ...current } : null;
  }
}

export default new UploadSessionService();