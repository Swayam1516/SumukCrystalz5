const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'customer'], default: 'user' },
    phone: { type: String },
    addresses: [
      {
        label: String,
        fullName: String,
        phone: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'India' },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.setPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(plainPassword, salt);
};

UserSchema.methods.verifyPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
