import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ['administrador', 'usuario', 'proveedor'],
    default: 'usuario',
  },
  phone: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  pais: {
    type: String, // Añade esta línea para el campo país
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: '', // Campo para almacenar la URL del avatar
  }, 
}, { collection: 'users' });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
