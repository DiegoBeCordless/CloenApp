import { Router } from 'express';
import * as usersController from '../users/users.controller.js';

const router = Router();

router.post('/request-password-reset', usersController.requestPasswordReset); // Ruta para solicitar restablecimiento de contraseña
router.post('/reset-password', usersController.resetPassword); // Ruta para restablecer la contraseña

export default router;
