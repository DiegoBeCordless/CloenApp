// import jwt from 'jsonwebtoken';

// export function authenticateToken(req, res, next) {
//   console.log('Iniciando autenticación de token...'); // Este `console.log` va al inicio de la función para confirmar que el middleware se llama correctamente

//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     console.error('Token no proporcionado'); // Este mensaje aparece si el token no está presente
//     return res.status(401).json({ error: 'Acceso denegado: No se proporcionó un token.' });
//   }

//   console.log('Token recibido:', token); // Verifica que el token se está recibiendo correctamente

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error('Error en la verificación del token:', err); // Verifica si hay un error en la verificación del token
//       return res.status(403).json({ error: 'Token no válido.' });
//     }

//     console.log('Datos decodificados del token JWT:', user); // Verifica los datos decodificados del token

//     req.user = {
//       id: user.id || user._id,
//     };
//     next();
//   });
// }


// export function authorize(roles = []) {
//   if (typeof roles === 'string') {
//     roles = [roles];
//   }

//   return (req, res, next) => {
//     if (!roles.includes(req.user.rol)) {
//       console.error('Acceso denegado debido a rol:', req.user.rol);
//       return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para realizar esta acción.' });
//     }
//     next();
//   };
// }

// export function adminMiddleware(req, res, next) {
//   authenticateToken(req, res, () => {
//     if (req.user.rol !== 'administrador') {
//       return res.status(403).json({ error: 'Acceso denegado: Solo los administradores pueden realizar esta acción.' });
//     }
//     next();
//   });
// }






import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  console.log('Iniciando autenticación de token...');

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('Token no proporcionado');
    return res.status(401).json({ error: 'Acceso denegado: No se proporcionó un token.' });
  }

  console.log('Token recibido:', token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error en la verificación del token:', err);
      return res.status(403).json({ error: 'Token no válido.' });
    }

    console.log('Datos decodificados del token JWT:', user);

    req.user = {
      id: user.id || user._id,
      rol: user.rol, // Asegurarnos de incluir el rol del usuario aquí
    };
    next();
  });
}


export function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      console.error('Acceso denegado debido a rol:', req.user.rol);
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para realizar esta acción.' });
    }
    next();
  };
}

export function adminMiddleware(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user.rol !== 'administrador') {
      return res.status(403).json({ error: 'Acceso denegado: Solo los administradores pueden realizar esta acción.' });
    }
    next();
  });
}

