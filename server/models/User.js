const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 350,
    },
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (plainePassword) {
  return await bcrypt.compare(plainePassword, this.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = mongoose.model('User', userSchema);
