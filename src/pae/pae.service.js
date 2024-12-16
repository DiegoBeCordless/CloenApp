import * as paeRepo from './pae.repository.js';

export async function getAll() {
  return await paeRepo.getAll();
}

export async function create(data) {
  return await paeRepo.create(data);
}

export async function update(id, data) {
  return await paeRepo.update(id, data);
}

export async function patch(id, updatedFields) {
  return await paeRepo.patch(id, updatedFields);
}

export async function getById(id) {
  return await paeRepo.getById(id);
}

// Obtener todos los PAE de un proveedor por proveedorId
export async function getByProveedorId(proveedorId) {
  return await paeRepo.getByProveedorId(proveedorId);
}


// Obtener todos los productos asociados a un usuario por usuarioId
export async function getByUsuarioId(usuarioId) {
  return await paeRepo.getByUsuarioId(usuarioId);
}

