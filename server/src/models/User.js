const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'A valid email is required'],
    },
    password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: 6,
  validate: {
    validator: (value) => Buffer.byteLength(value, 'utf8') <= 72,
    message: 'Password must be at most 72 bytes',
  },
  select: false, // never returned by default; opt in with .select('+password')
},
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Kept for readability at call sites (equivalent to user.toJSON()).
userSchema.methods.toSafeJSON = function toSafeJSON() {
  return this.toJSON();
};

module.exports = mongoose.model('User', userSchema);
