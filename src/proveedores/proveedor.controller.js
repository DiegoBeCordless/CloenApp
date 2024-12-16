// proveedor.controller.js
import User from '../users/users.model.js'; // Asegúrate de que la ruta sea correcta
import Pae from '../pae/pae.model.js'; // Modelo de productos asociados al proveedor
import Proveedor from '../proveedores/proveedor.model.js';

// Obtener todos los proveedores
export const obtenerProveedores = async (req, res) => {
  try {
    // Buscar todos los usuarios con el rol de 'proveedor'
    const proveedores = await User.find({ rol: 'proveedor' });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los proveedores', details: error.message });
  }
};

// Obtener un proveedor por su ID y los productos asociados
export const obtenerProveedorPorId = async (req, res) => {
  try {
    const proveedor = await User.findById(req.params.id).where({ rol: 'proveedor' });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Obtener los productos asociados al proveedor
    const productos = await Pae.find({ proveedor: req.params.id });

    res.json({ proveedor, productos });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
};

// // Crear un proveedor
// export const crearProveedor = async (req, res) => {
//   try {
//     const { nombre, email, pais, telefono, direccion, registroComercial } = req.body;

//     // Crear un nuevo proveedor (User con rol proveedor)
//     const nuevoProveedor = new User({
//       nombre,
//       email,
//       pais,
//       telefono,
//       direccion,
//       registroComercial,
//       rol: 'proveedor',
//     });

//     await nuevoProveedor.save();
//     res.status(201).json({ message: 'Proveedor creado exitosamente', proveedor: nuevoProveedor });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al crear el proveedor', details: error.message });
//   }
// };

// Crear un proveedor
export const crearProveedor = async (req, res) => {
  try {
    const { nombre, email, password, pais, telefono, direccion, registroComercial } = req.body;

    // Crear un nuevo proveedor con el modelo correcto
    const nuevoProveedor = new Proveedor({
      nombre,
      email,
      password,
      pais, // Incluye el campo pais
      telefono,
      direccion,
      registroComercial,
      rol: 'proveedor',
    });

    // Guardar el proveedor en la base de datos
    await nuevoProveedor.save();

    res.status(201).json({ message: 'Proveedor creado exitosamente', proveedor: nuevoProveedor });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proveedor', details: error.message });
  }
};


// Actualizar un proveedor
export const actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, pais, telefono, direccion, registroComercial } = req.body;

    const proveedorActualizado = await User.findByIdAndUpdate(
      id,
      { nombre, email, pais, telefono, direccion, registroComercial },
      { new: true }
    );

    if (!proveedorActualizado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor actualizado exitosamente', proveedor: proveedorActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proveedor', details: error.message });
  }
};

// Actualizar parcialmente un proveedor
export const actualizarProveedorParcial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const proveedorActualizado = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!proveedorActualizado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor actualizado parcialmente exitosamente', proveedor: proveedorActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proveedor', details: error.message });
  }
};

// Eliminar un proveedor
export const eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;

    const proveedorEliminado = await User.findByIdAndDelete(id);

    if (!proveedorEliminado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proveedor', details: error.message });
  }
};

// Crear un producto asociado al proveedor autenticado
export const crearProducto = async (req, res) => {
  try {
    const { nombre, tipo, numeroSerie } = req.body;
    const proveedorId = req.params.id;

    const proveedor = await User.findById(proveedorId).where({ rol: 'proveedor' });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    const nuevoProducto = new Pae({
      nombre,
      tipo,
      numeroSerie,
      proveedor: proveedorId,
    });

    await nuevoProducto.save();
    res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto', details: error.message });
  }
};

// Obtener productos por proveedor
export const obtenerProductosPorProveedor = async (req, res) => {
  try {
    const { proveedorId } = req.params;

    const proveedor = await User.findById(proveedorId).where({ rol: 'proveedor' });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    const productos = await Pae.find({ proveedor: proveedorId });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos del proveedor', details: error.message });
  }
};

// Actualizar un producto asociado a un proveedor
export const actualizarProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const { nombre, tipo, numeroSerie } = req.body;

    const productoActualizado = await Pae.findByIdAndUpdate(
      idProducto,
      { nombre, tipo, numeroSerie },
      { new: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado exitosamente', producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
  }
};

// Eliminar un producto asociado a un proveedor
export const eliminarProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;

    const productoEliminado = await Pae.findByIdAndDelete(idProducto);

    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
};
