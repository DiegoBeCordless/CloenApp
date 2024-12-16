// proveedor.router.js
import { Router } from 'express';
import * as proveedorController from './proveedor.controller.js';

const router = Router();

// Rutas para los proveedores

// Ruta para crear un proveedor
router.post('/', proveedorController.crearProveedor);

// Ruta para obtener todos los proveedores
router.get('/', proveedorController.obtenerProveedores);

// Ruta para obtener un proveedor por su ID
router.get('/:id', proveedorController.obtenerProveedorPorId);

// Ruta para actualizar un proveedor completamente
router.put('/:id', proveedorController.actualizarProveedor);

// Ruta para actualizar parcialmente un proveedor
router.patch('/:id', proveedorController.actualizarProveedorParcial);

// Ruta para eliminar un proveedor
router.delete('/:id', proveedorController.eliminarProveedor);

// Rutas para los productos de los proveedores

// Ruta para obtener todos los productos de un proveedor
router.get('/:proveedorId/productos', proveedorController.obtenerProductosPorProveedor);

// Ruta para crear un producto asociado a un proveedor
router.post('/:id/productos', proveedorController.crearProducto);

// Ruta para actualizar un producto asociado a un proveedor
router.put('/productos/:idProducto', proveedorController.actualizarProducto);

// Ruta para eliminar un producto asociado a un proveedor
router.delete('/productos/:idProducto', proveedorController.eliminarProducto);

export default router;
