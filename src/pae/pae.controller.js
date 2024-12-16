import * as paeService from './pae.service.js';
import mongoose from 'mongoose';
import Pae from './pae.model.js';
import User from '../users/users.model.js';
import Registro from '../registro/registro.model.js';


// Crear un nuevo PAE
export async function create(req, res) {
  try {
    const requiredFields = [
      'Lugar', 'Zona', 'Familia', 'Subfamilia', 'Tipo', 'Codigo', 'Color',
      'Dimensiones', 'Material', 'Capacidad', 'Funciones', 'Programas',
      'PanelDigital', 'LCD', 'Bluetooth', 'Potencia', 'Voltaje',
      'FechaFab', 'Proveedor', 'Localizacion'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Faltan campos necesarios: ${missingFields.join(', ')}` });
    }

    const newPae = await paeService.create(req.body);
    res.status(201).json(newPae);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener todos los PAE de un proveedor por proveedorId
export async function getByProveedorId(req, res) {
  try {
    const { proveedorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(proveedorId)) {
      return res.status(400).json({ error: "ID de proveedor no válido." });
    }

    const paes = await paeService.getByProveedorId(proveedorId);
    res.json(paes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Registrar un producto por ampliación de garantía
export const registerWarrantyExtension = async (req, res) => {
  try {
    const { numeroDeSerie, paisDeRegistro } = req.body;
    const usuarioId = req.user.id; // ID del usuario autenticado

    // Buscar el producto por número de serie
    const producto = await Pae.findOne({ numeroDeSerie });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Verificar si ya existe un registro para este producto
    const registroExistente = await Registro.findOne({ paeId: producto._id });
    if (registroExistente) {
      return res.status(400).json({ error: 'El producto ya está registrado.' });
    }

    // Asociar el producto con el usuario que lo está registrando
    producto.usuarioAsociado = usuarioId;
    await producto.save();

    // Crear el registro en la colección `registros`
    const nuevoRegistro = new Registro({
      paeId: producto._id,
      usuarioId,
      paisDeRegistro,
      fechaDeRegistro: new Date(),
    });

    await nuevoRegistro.save();
    res.status(201).json({ message: 'Producto registrado exitosamente.', registro: nuevoRegistro });
  } catch (error) {
    console.error('Error al registrar la garantía:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export async function getAll(req, res) {
  try {
    const paes = await paeService.getAll();
    res.json(paes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const updatedPae = await paeService.update(id, req.body);
    res.json(updatedPae);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function patch(req, res) {
  try {
    const { id } = req.params;
    const updatedPae = await paeService.patch(id, req.body);
    res.json(updatedPae);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID no válido." });
    }

    const pae = await paeService.getById(id);
    if (!pae) {
      return res.status(404).json({ error: "Documento no encontrado." });
    }
    res.json(pae);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controlador para actualizar el estado de un producto
export const actualizarEstadoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar si el estado es válido
    const estadosValidos = ['Sin Estado', 'En Proceso', 'Aprobado', 'Finalizado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado no válido.' });
    }

    // Actualizar el producto con el nuevo estado
    const producto = await Pae.findByIdAndUpdate(id, { estado }, { new: true, runValidators: true });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.status(200).json(producto);  // Asegúrate de devolver el producto actualizado
  } catch (error) {
    console.error('Error al actualizar el estado del producto:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del producto', error });
  }
};

// Obtener perfil del usuario autenticado
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Fetch user and exclude password field
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
};

// Obtener todos los productos asociados a un usuario por usuarioId
export async function getByUsuarioId(req, res) {
  try {
    const { usuarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ error: "ID de usuario no válido." });
    }

    // Buscar productos asociados al usuario
    const productos = await paeService.getByUsuarioId(usuarioId);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const obtenerProductosPorUsuario = async (req, res) => {
  try {
    console.log('Usuario autenticado recibido en el controlador:', req.user);

    const usuarioId = req.user.id;

    // Verificar y convertir el ID a ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      console.error('ID no válido:', usuarioId);
      return res.status(400).json({ error: 'ID no válido.' });
    }

    const objectId = new mongoose.Types.ObjectId(usuarioId);
    console.log('ID convertido a ObjectId:', objectId);

    // Buscar productos asociados al usuario
    const productos = await paeService.getByUsuarioId(objectId);

    if (!productos.length) {
      console.log('No se encontraron productos para el usuario:', objectId);
      return res.status(404).json({ message: 'No se encontraron productos asociados a este usuario.' });
    }

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const createPae = async (req, res) => {
  try {
    // Aquí asumimos que el proveedor ya está autenticado y se tiene acceso a req.user.id
    const proveedorId = req.user.id; // ID del proveedor autenticado

    // Crear un nuevo producto PAE asegurándose de incluir todos los campos, incluyendo `usuarioAsociado` como `null`
    const nuevoPae = new Pae({
      lugar: req.body.lugar,
      zona: req.body.zona,
      familia: req.body.familia,
      subfamilia: req.body.subfamilia,
      tipo: req.body.tipo,
      codigo: req.body.codigo,
      color: req.body.color,
      dimensiones: req.body.dimensiones,
      material: req.body.material,
      capacidad: req.body.capacidad,
      funciones: req.body.funciones,
      programas: req.body.programas,
      panelDigital: req.body.panelDigital,
      lcd: req.body.lcd,
      bluetooth: req.body.bluetooth,
      potencia: req.body.potencia,
      voltaje: req.body.voltaje,
      fechaFab: req.body.fechaFab,
      proveedor: req.body.proveedor,
      localizacion: req.body.localizacion,
      numeroDeSerie: req.body.numeroDeSerie,
      proveedorId: proveedorId,  // Asociar el producto al proveedor autenticado
      usuarioAsociado: null      // Usuario asociado inicialmente nulo
    });

    await nuevoPae.save();
    res.status(201).json(nuevoPae);
  } catch (error) {
    console.error('Error al crear un nuevo PAE:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


