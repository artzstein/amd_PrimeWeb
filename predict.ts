import express from 'express';
import {
  getForecast,
  getAnomalies,
  getInsights,
  getPredictions,
  getPredictionById,
} from '../controllers/predictController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.post('/forecast', getForecast);
router.post('/anomalies', getAnomalies);
router.post('/insights', getInsights);
router.get('/', getPredictions);
router.get('/:id', getPredictionById);

export default router;
