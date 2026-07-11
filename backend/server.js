import mongoose from 'mongoose';
import app from './app.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './models/User.js';
import bcrypt from 'bcrypt';

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4'])

const seedAdmin = async () => {
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({ email: 'admin@admin.com', password: hashedPassword, role: 'admin' });
    await admin.save();
    console.log('Seeded default admin user: admin@admin.com / admin123');
  }
};

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected to Atlas');
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(async (err) => {
    console.error('Atlas Connection Error:', err.message);
    console.log('Starting local in-memory database as fallback...');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const localUri = mongoServer.getUri();
      
      await mongoose.connect(localUri);
      console.log('MongoDB Connected to Local In-Memory DB');
      await seedAdmin(); 
      
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (localErr) {
      console.error('Failed to start local DB:', localErr);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (without DB)`);
      });
    }
  });
