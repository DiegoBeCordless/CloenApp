// import express from 'express';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import { connectDB } from './routes/db.js';
// import indexRoutes from './routes/index.js';
// import paeRoutes from './pae/pae.router.js';
// import usersRoutes from './users/users.router.js';
// import proveedoresRoutes from './proveedores/proveedor.router.js';
// import registroRoutes from './registro/registro.router.js';
// import passwordresettokensRoutes from './routes/passwordresettokensRoutes.js';
// import dashboardRoutes from './dashboard/dashboard.router.js';
// import multer from 'multer';

// dotenv.config();

// const app = express();
// app.set('port', process.env.PORT || 4000);

// const upload = multer();
// app.use(upload.any()); // Middleware para manejar datos form-data

// app.use(morgan('dev'));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.use(cors({ origin: 'http://localhost:3000' }));

// connectDB().then(() => {
//   app.use('/', indexRoutes);
//   app.use('/api/pae', paeRoutes);
//   app.use('/api/users', usersRoutes);
//   app.use('/api/proveedores', proveedoresRoutes);
//   app.use('/api/productos', registroRoutes);
//   app.use('/api/admin', dashboardRoutes);  // El dashboard está montado en "/api/admin"
//   app.use('/api/passwordresettokens', passwordresettokensRoutes);

//   app.listen(app.get('port'), () => {
//     console.log(`Server on port ${app.get('port')}`);
//   });
// });


import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './routes/db.js';
import indexRoutes from './routes/index.js';
import paeRoutes from './pae/pae.router.js';
import usersRoutes from './users/users.router.js';
import proveedoresRoutes from './proveedores/proveedor.router.js';
import registroRoutes from './registro/registro.router.js';
import passwordresettokensRoutes from './routes/passwordresettokensRoutes.js';
import dashboardRoutes from './dashboard/dashboard.router.js';
import multer from 'multer';

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 4000);

const upload = multer();
app.use(upload.any()); // Middleware para manejar datos form-data

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de CORS para permitir solicitudes desde desarrollo y producción
app.use(cors({
  origin: [
    'http://localhost:3000', // Para desarrollo local
    'https://cloen-2025-front-002.vercel.app' // URL del front-end en producción
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Si usas cookies o encabezados de autenticación
}));

connectDB().then(() => {
  app.use('/', indexRoutes);
  app.use('/api/pae', paeRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/proveedores', proveedoresRoutes);
  app.use('/api/productos', registroRoutes);
  app.use('/api/admin', dashboardRoutes); // El dashboard está montado en "/api/admin"
  app.use('/api/passwordresettokens', passwordresettokensRoutes);

  app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
  });
});

