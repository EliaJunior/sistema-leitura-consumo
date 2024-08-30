import { Router } from 'express';
import { uploadController } from '../controllers/uploadController';

const router = Router();

// Defina a rota POST /upload
router.post('/upload', uploadController);

export default router;
