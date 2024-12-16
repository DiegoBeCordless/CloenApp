// import mongoose from 'mongoose';

// const PaeSchema = new mongoose.Schema({
//   Lugar: {
//     type: String,
//     required: true
//   },
//   Zona: {
//     type: String,
//     required: true
//   },
//   Familia: {
//     type: String,
//     required: true
//   },
//   Subfamilia: {
//     type: String,
//     required: true
//   },
//   Tipo: {
//     type: String,
//     required: true
//   },
//   Codigo: {
//     type: String,
//     required: true
//   },
//   Color: {
//     type: String,
//     required: true
//   },
//   Dimensiones: {
//     type: String,
//     required: true
//   },
//   Material: {
//     type: String,
//     required: true
//   },
//   Capacidad: {
//     type: String,
//     required: true
//   },
//   Funciones: {
//     type: String,
//     required: true
//   },
//   Programas: {
//     type: String,
//     required: true
//   },
//   PanelDigital: {
//     type: String,
//     required: true
//   },
//   LCD: {
//     type: String,
//     required: true
//   },
//   Bluetooth: {
//     type: String,
//     required: true
//   },
//   Potencia: {
//     type: String,
//     required: true
//   },
//   Voltaje: {
//     type: String,
//     required: true
//   },
//   FechaFab: {
//     type: String,
//     required: true
//   },
//   Proveedor: {
//     type: String,
//     required: true
//   },
//   Localizacion: {
//     type: String,
//     required: true
//   },
//   numeroDeSerie: {
//     type: String,
//     default: null
//   },
//   proveedorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Proveedor',
//     required: true
//   },
//   paisDeRegistro: {
//     type: String,
//     required: false
//   },
//    usuarioAsociado: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: false
// },
//   fechaDeRegistro: {
//     type: Date,
//     required: false
//   },
//   estado: {
//     type: String,
//     default: 'Sin Estado'
//   }
// }, { collection: 'PAE' });

// // Middleware para generar numeroDeSerie si no está presente
// PaeSchema.pre('save', async function (next) {
//   if (!this.numeroDeSerie) {
//     let unique = false;
//     let generatedNumeroDeSerie;

//     while (!unique) {
//       generatedNumeroDeSerie = `SN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
//       const existingPae = await mongoose.models.Pae.findOne({ numeroDeSerie: generatedNumeroDeSerie });
//       if (!existingPae) {
//         unique = true;
//       }
//     }

//     this.numeroDeSerie = generatedNumeroDeSerie;
//   }
//   next();
// });

// const Pae = mongoose.models.Pae || mongoose.model('Pae', PaeSchema);
// export default Pae;


import mongoose from 'mongoose';

const PaeSchema = new mongoose.Schema({
  Lugar: {
    type: String,
    required: true
  },
  Zona: {
    type: String,
    required: true
  },
  Familia: {
    type: String,
    required: true
  },
  Subfamilia: {
    type: String,
    required: true
  },
  Tipo: {
    type: String,
    required: true
  },
  Codigo: {
    type: String,
    required: true
  },
  Color: {
    type: String,
    required: true
  },
  Dimensiones: {
    type: String,
    required: true
  },
  Material: {
    type: String,
    required: true
  },
  Capacidad: {
    type: String,
    required: true
  },
  Funciones: {
    type: String,
    required: true
  },
  Programas: {
    type: String,
    required: true
  },
  PanelDigital: {
    type: String,
    required: true
  },
  LCD: {
    type: String,
    required: true
  },
  Bluetooth: {
    type: String,
    required: true
  },
  Potencia: {
    type: String,
    required: true
  },
  Voltaje: {
    type: String,
    required: true
  },
  FechaFab: {
    type: String,
    required: true
  },
  Proveedor: {
    type: String,
    required: true
  },
  Localizacion: {
    type: String,
    required: true
  },
  numeroDeSerie: {
    type: String,
    default: null
  },
  proveedorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: true
  },
  paisDeRegistro: {
    type: String,
    required: false
  },
  usuarioAsociado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  fechaDeRegistro: {
    type: Date,
    required: false
  },
  estado: {
    type: String,
    default: 'Sin Estado'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'PAE' });

// Middleware para generar numeroDeSerie si no está presente
PaeSchema.pre('save', async function (next) {
  if (!this.numeroDeSerie) {
    let unique = false;
    let generatedNumeroDeSerie;

    while (!unique) {
      generatedNumeroDeSerie = `SN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      const existingPae = await mongoose.models.Pae.findOne({ numeroDeSerie: generatedNumeroDeSerie });
      if (!existingPae) {
        unique = true;
      }
    }

    this.numeroDeSerie = generatedNumeroDeSerie;
  }
  next();
});

const Pae = mongoose.models.Pae || mongoose.model('Pae', PaeSchema);
export default Pae;
