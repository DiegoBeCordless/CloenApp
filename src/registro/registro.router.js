import { Router } from 'express';
import * as registroController from './registro.controller.js';

const router = Router();

// Ruta para registrar un producto mediante extensión de garantía
router.post('/registro', registroController.registrarProducto);

// Nueva ruta para obtener el detalle de un producto específico
router.get('/:id', registroController.obtenerDetalleProducto);

// Nueva ruta para Listar Productos con Filtros
router.get('/', registroController.listarProductos);

// Nueva ruta para obtener la trazabilidad de un producto por ID
router.get('/trazabilidad/:id', registroController.obtenerTrazabilidad);

router.get('/registros', registroController.listarRegistros);


export default router;



