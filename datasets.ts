import express from 'express';
import multer from 'multer';
import {
  uploadDataset,
  getDatasets,
  getDatasetById,
  getDatasetData,
  updateDataset,
  deleteDataset,
} from '../controllers/datasetController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadDataset);
router.get('/', getDatasets);
router.get('/:id', getDatasetById);
router.get('/:id/data', getDatasetData);
router.put('/:id', updateDataset);
router.delete('/:id', deleteDataset);

export default router;
