import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Ruta para obtener datos del dashboard administrativo
router.get('/dashboard', dashboardController.obtenerDashboard);

// Nueva ruta para obtener los productos del usuario autenticado en el Dashboard
router.get('/dashboard/usuario', authenticateToken, dashboardController.obtenerDashboardUsuario);

export default router;
