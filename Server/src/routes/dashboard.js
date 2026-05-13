import express from 'express';
import { 
  getStatsSummary, 
  getModuleUsage, 
  getSubModuleUsage,
  getCategoryUsage,
  getLeaderboard, 
  getReportData,
  getCompaniesList,
  getServerHealth,
  getUsersList
} from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// router.use(verifyToken);

router.get('/stats', getStatsSummary);
router.get('/health', getServerHealth);
router.get('/module-usage', getModuleUsage);
router.get('/sub-module-usage', getSubModuleUsage);
router.get('/category-usage', getCategoryUsage);
router.get('/leaderboard', getLeaderboard);
router.get('/reports', getReportData);
router.get('/companies', getCompaniesList);
router.get('/users/external', getUsersList('external'));
router.get('/users/internal', getUsersList('internal'));

export default router;

export default router;
