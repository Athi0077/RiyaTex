import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';



// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', bookingRoutes);
app.use('/api', adminRoutes);
app.use('/api', uploadRoutes);

export default app;
