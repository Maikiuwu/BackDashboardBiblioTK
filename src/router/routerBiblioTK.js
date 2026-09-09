import { Router } from 'express';
import { obtenerDashboard, listarLibros } from '../controllers/dashboardController.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ message: 'Servidor BiblioTK activo' });
});

router.get('/dashboard', obtenerDashboard);
router.get('/libros', listarLibros);

export default router;