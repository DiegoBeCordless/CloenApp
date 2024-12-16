import * as userService from './users.service.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from './users.model.js'; // Importar el modelo de usuario
import Pae from '../pae/pae.model.js';

dotenv.config();

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$')).required().messages({
    'string.pattern.base': 'La contraseña debe tener al menos una letra minúscula, una letra mayúscula y un número, y debe tener al menos 6 caracteres.'
  }),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  rol: Joi.string().optional(),
  birthDate: Joi.date().optional()
});

export async function createUser(req, res) {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password, birthDate } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await userService.getByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con rol "usuario"
    const newUser = await userService.create({
      username,
      email,
      password: hashedPassword,
      birthDate, // Guardar la fecha de nacimiento
      rol: 'usuario',
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' });
  }
}


export async function createProvider(req, res) {
  try {
    const { username, email, password, pais, personaContacto, telefono, direccion, registroComercial } = req.body;

    // Verificar si el proveedor ya existe
    const existingProvider = await User.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ error: 'El proveedor ya está registrado.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el proveedor con los datos ingresados
    const newProvider = new User({
      username,
      email,
      password: hashedPassword,
      pais,
      personaContacto,
      telefono,
      direccion,
      registroComercial,
      rol: 'proveedor'
    });

    await newProvider.save();

    res.status(201).json({ message: 'Proveedor registrado con éxito.' });
  } catch (error) {
    console.error('Error al registrar proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por su email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      {
        id: user._id, // Aquí nos aseguramos de incluir el ID del usuario
        email: user.email,
        rol: user.rol,
        nombre: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respuesta con el token y los detalles del usuario
    res.json({
      message: "Login exitoso",
      userId: user._id,
      token,
      nombre: user.username,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: "Error interno del servidor. Intenta de nuevo más tarde." });
  }
}



export async function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: "Token de refresco requerido." });
  }
  try {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Token de refresco no válido." });
  }
}

export async function getAll(req, res) {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

export async function getByEmail(req, res) {
  try {
    const user = await userService.getByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getByUsername(req, res) {
  try {
    const user = await userService.getByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getById(req, res) {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export const getUserProfile = async (req, res) => {
  try {
    // Buscamos al usuario por su ID
    const user = await User.findById(req.user.id).select('-password').lean();

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Buscamos los productos asociados al usuario autenticado
    const productos = await Pae.find({ usuarioAsociado: req.user.id }).lean();

    // Respondemos con los datos del usuario y sus productos
    res.set('Cache-Control', 'no-store');
    res.json({
      userId: user._id,
      nombre: user.username,
      email: user.email,
      rol: user.rol,
      productos,
    });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
};




export async function update(req, res) {
  const { id } = req.params;
  const updateFields = req.body;

  // Si la contraseña está presente, necesitamos hacer hashing antes de guardarla
  if (updateFields.password) {
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(updateFields.password, salt);
  }

  try {
    // Actualizar el usuario utilizando el servicio
    const updatedUser = await userService.update(id, updateFields);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json({
      message: "Usuario actualizado con éxito.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario. Por favor intenta de nuevo más tarde." });
  }
}

export async function patch(req, res) {
  const { id } = req.params;
  const updatedFields = req.body;
  try {
    if (updatedFields.password) {
      const { error } = Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$')).validate(updatedFields.password);
      if (error) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos una letra minúscula, una letra mayúscula y un número, y debe tener al menos 6 caracteres.' });
      }
      updatedFields.password = await bcrypt.hash(updatedFields.password, 10);
    }
    const updatedUser = await userService.patch(id, updatedFields);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function remove(req, res) {
  try {
    const user = await userService.remove(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json({ message: "Usuario eliminado." });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    console.log(`Recibida solicitud de restablecimiento para el email: ${email}`);
    
    const user = await userService.getByEmail(email);
    if (!user) {
      console.log('Usuario no encontrado.');
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const token = crypto.randomBytes(32).toString('hex');
    console.log(`Token generado: ${token}`);
    await userService.savePasswordResetToken(user._id, token);

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Restablecimiento de Contraseña',
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo de recuperación enviado.');
    res.json({ message: 'Correo de recuperación enviado.' });
  } catch (error) {
    console.error('Error en la solicitud de restablecimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    const userId = await userService.getUserIdByPasswordResetToken(token);
    if (!userId) {
      return res.status(400).json({ error: "Token inválido o expirado." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword(userId, hashedPassword);
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Buscar al usuario por ID
    const user = await userService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    // Actualizar la contraseña con hashing
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.update(userId, { password: hashedPassword });

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateEmail(req, res) {
  const { newEmail } = req.body;
  const userId = req.user.id;

  try {
    // Verificar si el nuevo correo ya está en uso
    const existingEmail = await userService.getByEmail(newEmail);
    if (existingEmail) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Actualizar el correo electrónico
    const updatedUser = await userService.update(userId, { email: newEmail });

    res.json({
      message: 'Correo electrónico actualizado con éxito',
      email: updatedUser.email,
    });
  } catch (error) {
    console.error('Error al actualizar correo electrónico:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


export const uploadAvatar = async (req, res) => {
  try {
    console.log('Contenido de req.file:', req.file); // Verificar contenido del archivo simulado
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen.' });
    }

    const { path } = req.file; // Ruta simulada de la imagen
    const { userId } = req.body;
    console.log('userId recibido:', userId);

    // Verifica si el usuario existe y actualiza el avatar
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: path }, // Actualiza la URL del avatar
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    console.log('Usuario actualizado:', user);
    res.status(200).json({ message: 'Avatar actualizado con éxito.', user });
  } catch (error) {
    console.error('Error al subir el avatar:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};











