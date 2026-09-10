import { Router } from 'express';
import { obtenerDashboard, } from '../controllers/dashboardController.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ message: 'Servidor BiblioTK activo' });
});

router.get('/Udashboard', obtenerDashboard);

export default router;