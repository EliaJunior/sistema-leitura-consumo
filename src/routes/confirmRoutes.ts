import { Router } from 'express';
import { confirmController } from '../controllers/confirmController';

const router = Router();

// Rota patch/confirm
router.patch('/confirm', confirmController);

export default router;
