import express from 'express';
import { 
  getStatsSummary, 
  getModuleUsage, 
  getLeaderboard, 
  getReportData 
} from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// router.use(verifyToken);

router.get('/stats', getStatsSummary);
router.get('/module-usage', getModuleUsage);
router.get('/leaderboard', getLeaderboard);
router.get('/reports', getReportData);

export default router;
