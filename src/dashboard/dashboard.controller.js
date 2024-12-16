import Pae from '../pae/pae.model.js';

export async function obtenerDashboard(req, res) {
  try {
    // Contar productos por usuario asociado
    const productosPorUsuario = await Pae.aggregate([
      {
        $group: {
          _id: "$usuarioAsociado",
          totalProductos: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "usuarioInfo",
        },
      },
      {
        $unwind: "$usuarioInfo",
      },
      {
        $project: {
          usuarioNombre: "$usuarioInfo.username",
          email: "$usuarioInfo.email",
          totalProductos: 1,
        },
      },
    ]);

    // Contar registros por país
    const registrosPorPais = await Pae.aggregate([
      {
        $group: {
          _id: "$paisDeRegistro",
          totalRegistros: { $sum: 1 },
        },
      },
      {
        $project: {
          pais: "$_id",
          totalRegistros: 1,
        },
      },
    ]);

    // Asegurarse de que los resultados sean arrays vacíos si no se encuentran registros
    const productosPorUsuarioFinal = productosPorUsuario.length ? productosPorUsuario : [];
    const registrosPorPaisFinal = registrosPorPais.length ? registrosPorPais : [];

    // Responder con los datos del dashboard
    res.json({
      productosPorUsuario: productosPorUsuarioFinal,
      registrosPorPais: registrosPorPaisFinal,
    });
  } catch (error) {
    console.error("Error al obtener el dashboard:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}

// Nueva función para obtener el Dashboard del usuario autenticado
export async function obtenerDashboardUsuario(req, res) {
  try {
    const usuarioId = req.user.id;

    // Obtener todos los productos asociados al usuario autenticado
    const productos = await Pae.find({ usuarioAsociado: usuarioId }).lean();

    // Asegurarse de que haya productos o devolver un mensaje adecuado
    if (!productos.length) {
      return res.status(404).json({ message: 'No tienes productos registrados.' });
    }

    // Responder con los productos del usuario
    res.json({
      productos,
    });
  } catch (error) {
    console.error('Error al obtener el dashboard del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
