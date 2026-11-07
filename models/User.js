import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' 
  },
  addresses: [{
    street: String,
    city: String,
    phone: String
  }]
}, { timestamps: true });

// Password save করার আগে automatic encrypt (hash) করার সঠিক নিয়ম (async হুকে next লাগে না)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', userSchema);
export default User;