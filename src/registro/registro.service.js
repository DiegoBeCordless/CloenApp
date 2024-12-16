// registro.service.js
import Registro from './registro.model.js';
import Pae from '../pae/pae.model.js';
import User from '../users/users.model.js';

export async function obtenerRegistros() {
  try {
    const registros = await Registro.find()
      .populate({
        path: 'paeId',
        model: 'Pae'
      })
      .populate({
        path: 'usuarioId',
        model: 'User'
      })
      .lean();
    return registros;
  } catch (error) {
    console.error('Error al obtener registros:', error);
    throw new Error('Error al obtener los registros');
  }
}

export async function registrarProducto({ productoId, paisRegistro, usuarioId }) {
  console.log('Intentando registrar el producto con ID:', productoId, 'y usuario:', usuarioId);

  try {
    const producto = await Pae.findById(productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar información del producto
    producto.usuarioAsociado = usuarioId;
    producto.paisDeRegistro = paisRegistro;
    producto.fechaDeRegistro = new Date();

    await producto.save();
    console.log('Producto guardado correctamente:', producto);

    // Crear el registro
    const nuevoRegistro = new Registro({
      paeId: producto._id,
      usuarioId,
      paisDeRegistro,
      fechaDeRegistro: new Date()
    });

    await nuevoRegistro.save();
    console.log('Registro guardado correctamente:', nuevoRegistro);

    return nuevoRegistro;
  } catch (error) {
    console.error('Error al registrar el producto:', error.message, error.stack);
    throw error;
  }
}


