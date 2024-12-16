import Router from 'express'; 
import * as paeController from './pae.controller.js';
import { adminMiddleware } from '../middleware/auth.middleware.js'; // Importamos el middleware de admin
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, paeController.getAll);          // Obtener todos los productos (PAE)
router.post('/', authenticateToken, paeController.create);         // Crear un nuevo PAE
router.put('/:id', authenticateToken, paeController.update);       // Actualizar un PAE existente
router.patch('/:id', authenticateToken, paeController.patch);      // Parchear información de un PAE
router.get('/:id', authenticateToken, paeController.getById);      // Obtener un PAE por ID

router.post('/', authenticateToken, paeController.createPae); // Asegúrate de proteger la creación con authenticateToken


router.get('/proveedor/:proveedorId', authenticateToken, paeController.getByProveedorId); // Nueva ruta para obtener PAE por proveedor
router.post('/register-warranty-extension', authenticateToken, paeController.registerWarrantyExtension); // Crear registro garantia
router.get('/usuario/:usuarioId', authenticateToken, paeController.getByUsuarioId); // Obtener un usuario por ID
router.get('/usuario', authenticateToken, paeController.obtenerProductosPorUsuario);

// Nueva ruta para que un administrador actualice el estado de un producto
router.put('/:id/estado', adminMiddleware, paeController.actualizarEstadoProducto);

export default router;
