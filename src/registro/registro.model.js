import mongoose from 'mongoose';

const RegistroSchema = new mongoose.Schema({
  paeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pae',
    required: true,
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paisDeRegistro: {
    type: String,
    required: true,
  },
  fechaDeRegistro: {
    type: Date,
    required: true,
  },
});

// Exportación del modelo con nombre 'Registro'
const Registro = mongoose.models.Registro || mongoose.model('Registro', RegistroSchema);
export default Registro;
