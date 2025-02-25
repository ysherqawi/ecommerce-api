const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please add a name'],
      maxlength: [50, 'Name should be less than 50 characters'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password should be atleast 8 characters'],
      select: false,
    },
    about: {
      type: String,
      trim: true,
      maxlength: [350, 'About should be less than 350 characters'],
    },
    role: {
      type: String,
      default: 'user',
    },
    history: {
      type: Array,
      default: [],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (plainePassword) {
  return await bcrypt.compare(plainePassword, this.password);
};

// Sign JWT and return
userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  const user = this;
  // Generate
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set to resetPasswordToken
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = mongoose.model('User', userSchema);
