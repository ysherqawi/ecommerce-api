const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    about: {
      type: String,
      trim: true,
      maxlength: [350, 'About should be less than 350 characters'],
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

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

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
