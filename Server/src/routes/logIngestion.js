import express from 'express';
import { ingestLogs } from '../controllers/logController.js';

const router = express.Router();

// No auth required for Fluent Bit ingestion (should be restricted by IP at Nginx level)
router.post('/ingest', ingestLogs);

export default router;
