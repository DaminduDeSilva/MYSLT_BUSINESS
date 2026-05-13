import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';

// Route Imports
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import logRoutes from './routes/logIngestion.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

// Rate Limiting (Skip for internal log ingestion)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  skip: (req) => req.path.startsWith('/api/logs')
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/logs', logRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'up', timestamp: new Date() }));

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 MySLT Business Monitoring Server running on port ${PORT}`);
  });
}

export default app;
