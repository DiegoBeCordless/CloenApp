// import mongoose from 'mongoose';

// const ProveedorSchema = new mongoose.Schema({
//   nombre: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   rol: {
//     type: String,
//     default: 'proveedor'
//   },
//   pais: {
//     type: String,
//     required: false
//   },
//   personaContacto: {
//     type: String,
//     required: false
//   },
//   telefono: {
//     type: String,
//     required: false
//   },
//   direccion: {
//     type: String,
//     required: false
//   },
//   registroComercial: {
//     type: String,
//     required: false
//   },
//   totalProductosSuministrados: {
//     type: Number,
//     default: 0
//   }
// }, { collection: 'proveedores' });

// const Proveedor = mongoose.models.Proveedor || mongoose.model('Proveedor', ProveedorSchema);
// export default Proveedor;


import mongoose from 'mongoose'; 

const ProveedorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    default: 'proveedor'
  },
  pais: {
    type: String,
    required: false
  },
  personaContacto: {
    type: String,
    required: false
  },
  telefono: {
    type: String,
    required: false
  },
  direccion: {
    type: String,
    required: false
  },
  registroComercial: {
    type: String,
    required: false
  },
  totalProductosSuministrados: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'proveedores' });

const Proveedor = mongoose.models.Proveedor || mongoose.model('Proveedor', ProveedorSchema);
export default Proveedor;
