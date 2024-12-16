// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;


import cloudinary from 'cloudinary';

// Configuración de Cloudinary con las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función de prueba para verificar la conexión
cloudinary.v2.api.ping()
  .then(response => console.log('Cloudinary conectado:', response))
  .catch(error => console.error('Error al conectar con Cloudinary:', error));

export default cloudinary;
