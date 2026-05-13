import LogEntry from '../models/LogEntry.js';

const LOG_BUFFER = [];
const BUFFER_FLUSH_INTERVAL = 3000; // 3 seconds
const MAX_BUFFER_SIZE = 1000;

/**
 * Flush Buffer to MongoDB
 */
const flushLogBuffer = async () => {
  if (LOG_BUFFER.length === 0) return;

  const logsToInsert = [...LOG_BUFFER];
  LOG_BUFFER.length = 0;

  try {
    const startTime = Date.now();
    await LogEntry.insertMany(logsToInsert, { ordered: false });
    console.log(`[INGEST] Flushed ${logsToInsert.length} logs in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error('[INGEST] Error flushing logs:', error.message);
  }
};

let flushInterval;

const startFlushInterval = () => {
  if (flushInterval) return;
  flushInterval = setInterval(flushLogBuffer, BUFFER_FLUSH_INTERVAL);
};

const stopFlushInterval = () => {
  if (flushInterval) {
    clearInterval(flushInterval);
    flushInterval = null;
  }
};

if (process.env.NODE_ENV !== 'test') {
  startFlushInterval();
}

export { startFlushInterval, stopFlushInterval };

/**
 * Ingest Logs from Fluent Bit
 */
export const ingestLogs = async (req, res) => {
  try {
    const logs = Array.isArray(req.body) ? req.body : [req.body];
    
    // Add to buffer
    LOG_BUFFER.push(...logs);

    // Forces flush if buffer is too big
    if (LOG_BUFFER.length >= MAX_BUFFER_SIZE) {
      flushLogBuffer();
    }

    res.status(202).json({ success: true, message: 'Logs accepted for processing' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
