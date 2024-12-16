// import { Router } from 'express';
// import * as usersController from './users.controller.js';
// import { authenticateToken, authorize } from '../middleware/auth.middleware.js';
// import uploadMiddleware from '../middleware/uploadMiddleware.js'; // Middleware para manejar la subida de imágenes

// const router = Router();

// // Rutas específicas para registro de usuarios y proveedores
// router.post('/register-user', usersController.createUser); // Registro de usuario
// router.post('/register-provider', usersController.createProvider); // Registro de proveedor

// // Rutas para login y otros procesos relacionados
// router.post('/login', usersController.login);
// router.post('/refresh-token', usersController.refreshAccessToken);
// router.post('/request-password-reset', usersController.requestPasswordReset);
// router.post('/reset-password', usersController.resetPassword);

// // Rutas para obtener los datos del usuario autenticado
// router.get('/me', authenticateToken, usersController.getUserProfile); // Ruta para obtener datos del usuario autenticado
// router.get('/profile', authenticateToken, usersController.getUserProfile); // Otra ruta para obtener perfil del usuario autenticado y sus productos

// // Ruta para subir avatar de usuario
// router.post(
//   '/upload-avatar',
//   authenticateToken, // Verifica que el usuario esté autenticado
//   uploadMiddleware, // Middleware simulado para manejar la imagen
//   usersController.uploadAvatar // Controlador que maneja la lógica de actualización
// );

// // Rutas para actualizar datos del usuario autenticado
// router.post('/update-password', authenticateToken, usersController.updatePassword); // Cambiar contraseña
// router.post('/update-email', authenticateToken, usersController.updateEmail); // Cambiar correo electrónico

// // Proteger las rutas que requieren autenticación y autorización
// router.get('/', authenticateToken, authorize('administrador'), usersController.getAll); // Solo administradores
// router.get('/:id', authenticateToken, authorize(['administrador', 'usuario', 'proveedor']), usersController.getById); // Administradores, usuarios y proveedores
// router.put('/:id', authenticateToken, authorize(['administrador', 'usuario', 'proveedor']), usersController.update); // Actualizar usuario
// router.patch('/:id', authenticateToken, authorize(['administrador', 'usuario', 'proveedor']), usersController.patch); // Parchear usuario
// router.delete('/:id', authenticateToken, authorize('administrador'), usersController.remove); // Eliminar usuario (solo admin)
// router.get('/email/:email', authenticateToken, authorize(['administrador']), usersController.getByEmail); // Obtener usuario por email
// router.get('/username/:username', authenticateToken, authorize(['administrador']), usersController.getByUsername); // Obtener usuario por username

// export default router;

import { Router } from 'express';
import * as usersController from './users.controller.js';
import { authenticateToken, authorize } from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js'; // Middleware para manejar la subida de imágenes

const router = Router();

// Rutas específicas para registro de usuarios y proveedores
router.post('/register-user', usersController.createUser); // Registro de usuario
router.post('/register-provider', usersController.createProvider); // Registro de proveedor

// Rutas para login y otros procesos relacionados
router.post('/login', usersController.login);
router.post('/refresh-token', usersController.refreshAccessToken);
router.post('/request-password-reset', usersController.requestPasswordReset);
router.post('/reset-password', usersController.resetPassword);

// Rutas para obtener los datos del usuario autenticado
router.get('/me', authenticateToken, usersController.getUserProfile); // Ruta para obtener datos del usuario autenticado
router.get('/profile', authenticateToken, usersController.getUserProfile); // Otra ruta para obtener perfil del usuario autenticado y sus productos

// Ruta para subir avatar de usuario
router.post(
  '/upload-avatar',
  authenticateToken, // Verifica que el usuario esté autenticado
  uploadMiddleware, // Middleware simulado para manejar la imagen
  usersController.uploadAvatar // Controlador que maneja la lógica de actualización
);

// Rutas para actualizar datos del usuario autenticado
router.post('/update-password', authenticateToken, usersController.updatePassword); // Cambiar contraseña
router.post('/update-email', authenticateToken, usersController.updateEmail); // Cambiar correo electrónico

// Proteger las rutas que requieren autenticación y autorización
router.get('/', authenticateToken, authorize('administrador'), usersController.getAll); // Solo administradores
router.get('/:id', authenticateToken, authorize(['administrador', 'usuario', 'proveedor']), usersController.getById); // Administradores, usuarios y proveedores
router.put('/:id', authenticateToken, authorize(['administrador', 'usuario', 'proveedor']), usersController.update); // Actualizar usuario
router.patch('/:id', authenticateToken, authorize(['administrador', 'usuario', 'proveedor']), usersController.patch); // Parchear usuario
router.delete('/:id', authenticateToken, authorize('administrador'), usersController.remove); // Eliminar usuario (solo admin)
router.get('/email/:email', authenticateToken, authorize(['administrador']), usersController.getByEmail); // Obtener usuario por email
router.get('/username/:username', authenticateToken, authorize(['administrador']), usersController.getByUsername); // Obtener usuario por username

export default router;

