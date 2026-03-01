import express from 'express';
import {
  createDashboard,
  getDashboards,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
  addWidget,
  removeWidget,
} from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createDashboard);
router.get('/', getDashboards);
router.get('/:id', getDashboardById);
router.put('/:id', updateDashboard);
router.delete('/:id', deleteDashboard);
router.post('/:id/widgets', addWidget);
router.delete('/:id/widgets/:widgetId', removeWidget);

export default router;
