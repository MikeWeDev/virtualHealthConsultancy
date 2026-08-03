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
  // store a single refresh token per user (simple revocation/rotation). For multi-device, use array.
  refreshToken: { type: String },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
