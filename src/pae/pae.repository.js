import Pae from './pae.model.js';

export const getAll = async () => {
  return await Pae.find();
};

export const create = async (data) => {
  return await Pae.create(data);
};

export const update = async (id, data) => {
  return await Pae.findByIdAndUpdate(id, data, { new: true });
};

export const patch = async (id, updatedFields) => {
  return await Pae.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
};

export const getById = async (id) => {
  return await Pae.findById(id).populate('usuarioAsociado');
};

// Obtener todos los PAE de un proveedor por proveedorId
export const getByProveedorId = async (proveedorId) => {
  return await Pae.find({ proveedorId });
};

// Obtener todos los productos asociados a un usuario por usuarioId
export const getByUsuarioId = async (usuarioId) => {
  // Filtrar los productos donde `usuarioAsociado` coincide con el `usuarioId`
  return await Pae.find({ usuarioAsociado: usuarioId });
};

