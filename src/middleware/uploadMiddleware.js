// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../config/cloudinary.js';

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'avatars', // Carpeta en Cloudinary donde se guardarán las imágenes
//     allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos permitidos
//   },
// });

// const upload = multer({ storage });

// export default upload;


const uploadMiddleware = (req, res, next) => {
  req.file = {
    path: 'mock/path/to/avatar.jpg', // Simula una ruta para la imagen
    originalname: 'avatar.jpg',      // Simula un nombre de archivo
  };
  console.log('Middleware de subida simulado:', req.file);
  next();
};

export default uploadMiddleware;
