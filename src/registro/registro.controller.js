import * as registroService from './registro.service.js';
import Pae from '../pae/pae.model.js';
import Registro from '../registro/registro.model.js';
import Proveedor from '../proveedores/proveedor.model.js';

// Nueva función para obtener el detalle de un producto específico
export async function obtenerDetalleProducto(req, res) {
  try {
    const { id } = req.params;

    // Buscar el PAE por ID
    const producto = await Pae.findById(id).lean();
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Buscar el proveedor asociado
    const proveedor = await Proveedor.findById(producto.proveedorId).lean();
    producto.proveedor = proveedor;

    // Buscar el registro del producto, si existe
    const registro = await Registro.findOne({ paeId: id }).lean();
    if (registro) {
      producto.registro = registro;
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener detalle del producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}


export async function listarProductos(req, res) {
  try {
    const { usuarioId } = req.query;

    // Agregar el filtro de usuario
    const query = usuarioId ? { usuarioAsociado: usuarioId } : {};

    const productos = await Pae.find(query).lean();
    res.json(productos);
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export async function listarRegistros(req, res) {
  try {
    console.log('Intentando listar registros');
    const registros = await registroService.obtenerRegistros(); // Llamar al servicio para obtener los registros
    if (!registros) {
      return res.status(404).json({ error: 'No se encontraron registros.' });
    }
    console.log('Registros obtenidos:', registros);
    res.json(registros);
  } catch (error) {
    console.error('Error al listar registros:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export async function obtenerTrazabilidad(req, res) {
  try {
    const { id } = req.params;

    // Obtener información del PAE
    const producto = await Pae.findById(id).lean();
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Obtener información del Proveedor
    const proveedor = await Proveedor.findById(producto.proveedorId).lean();
    if (proveedor) {
      producto.proveedor = proveedor;
    }

    // Obtener información de registro del producto
    const registro = await Registro.findOne({ paeId: id }).lean();
    if (registro) {
      producto.registro = registro;
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener la trazabilidad del producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}


export async function registrarProducto(req, res) {
  try {
    const { productoId, paisRegistro } = req.body;
    const usuarioId = req.user._id;

    // Verificar si el producto existe
    const producto = await Pae.findById(productoId);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Verificar si el producto ya ha sido registrado
    const registroExistente = await Registro.findOne({ paeId: producto._id });
    if (registroExistente) {
      return res.status(400).json({ error: 'El producto ya está registrado.' });
    }

    // Crear un nuevo registro para el producto
    const nuevoRegistro = new Registro({
      paeId: producto._id,
      usuarioId,
      paisDeRegistro,
      fechaDeRegistro: new Date(),
    });

    await nuevoRegistro.save();

    res.status(201).json({ message: 'Producto registrado exitosamente.', registro: nuevoRegistro });
  } catch (error) {
    console.error('Error al registrar el producto:', error.message);
    res.status(500).json({ error: 'Error al registrar el producto. Intenta de nuevo más tarde.' });
  }
}

// Ejemplo de una función para obtener registros
export async function obtenerRegistros(req, res) {
  try {
    const registros = await Registro.find().populate('paeId').populate('usuarioId');
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al obtener los registros:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

