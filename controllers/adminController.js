import Product from '../models/Product.js';
import User from '../models/User.js';
// Jokhon Order toiri hobe tokhon ekhane Order model import korbo

export const getDashboardStats = async (req, res) => {
  try {
    // Database theke ashol data count kora hocche
    const totalProducts = await Product.countDocuments();
    
    // Jader role 'admin' noy, tara shobai customer
    const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' } });

    // Vobisshote ekhane Order.countDocuments() hobe
    const totalOrders = 0; 
    const totalRevenue = 0; 
    const recentOrders = []; // Ekhon faka thakbe

    res.status(200).json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};