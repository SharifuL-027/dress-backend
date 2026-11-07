import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'; // Eta notun add korun
import productRoutes from './routes/productRoutes.js'; // Eta notun add korun
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import promoRoutes from './routes/promoRoutes.js';


// .env file load kora
dotenv.config();

const app = express();

// Modern Middleware Setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: 'http://localhost:5173', // Apnar React/Vite app er exact port
  credentials: true // HTTP-Only Cookie er jonno eta mandatory
}));

// Modern Database Connection (Mongoose 8+ Standard)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Failed: ${error.message}`);
    process.exit(1); // Error hole server stop kore dibe
  }
};

// DB function call
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.send('DressTown API is running on latest standards...');
});
// Test Route (app.get('/')) er thik niche eta boshiye din
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/promo', promoRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});