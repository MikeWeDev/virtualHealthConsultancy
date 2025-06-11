import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['doctor', 'patient'],
    required: true,
    default: 'patient',
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
