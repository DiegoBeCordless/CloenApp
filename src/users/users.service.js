import User from './users.model.js';
import PasswordResetToken from './passwordResetToken.model.js';

export const create = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('El correo electrónico o el nombre de usuario ya está en uso.');
    }
    throw new Error(`Error al crear el usuario: ${error.message}`);
  }
};

export async function getAll() {
  try {
    const users = await User.find().lean(); // Utiliza `.lean()` para mejorar el rendimiento
    return users;
  } catch (error) {
    throw new Error('Error al obtener los usuarios: ' + error.message);
  }
}

export const getById = async (id) => {
  return await User.findById(id);
};

export const getByEmail = async (email) => {
  return await User.findOne({ email });
};

export const getByUsername = async (username) => {
  return await User.findOne({ username });
};

export const savePasswordResetToken = async (userId, token) => {
  const user = await User.findById(userId);
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();
};


export const getUserIdByPasswordResetToken = async (token) => {
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  return user ? user._id : null;
};

export const updatePassword = async (userId, newPassword) => {
  const user = await User.findById(userId);
  user.password = newPassword;
  await user.save();
};

export async function update(id, updateFields) {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    return updatedUser;
  } catch (error) {
    throw new Error(`Error al actualizar el usuario: ${error.message}`);
  }
}

export const patch = async (id, updatedFields) => {
  return await User.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
};

export const remove = async (id) => {
  return await User.findByIdAndDelete(id);
};
