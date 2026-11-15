import Order from "../models/Order.js";
import Product from "../models/Product.js"; // Product মডেল ইমপোর্ট করা হলো

// @desc    Create new order & reduce product stock
// @route   POST /api/orders
// @access  Public (Optional Auth)
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // ১. অর্ডার তৈরি ও সেভ করা
    const order = new Order({
      orderItems,
      user: req.user ? req.user._id : null,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // ২. অর্ডারকৃত প্রতিটি প্রোডাক্টের ভ্যারিয়েন্ট স্টক এবং টোটাল স্টক কমানো
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        // যদি ভ্যারিয়েন্ট থাকে তবে কালার ও সাইজ মিলিয়ে স্টক কমানো
        if (product.variants && product.variants.length > 0) {
          const variantIndex = product.variants.findIndex(
            (v) =>
              v.color.trim().toLowerCase() === String(item.color).trim().toLowerCase() &&
              v.size.trim().toLowerCase() === String(item.size).trim().toLowerCase()
          );

          if (variantIndex !== -1) {
            product.variants[variantIndex].stock = Math.max(
              0,
              product.variants[variantIndex].stock - Number(item.qty)
            );
          }

          // সব ভ্যারিয়েন্টের স্টক যোগ করে নতুন totalStock আপডেট করা
          product.totalStock = product.variants.reduce(
            (acc, curr) => acc + Number(curr.stock || 0),
            0
          );
        } else if (typeof product.totalStock === "number") {
          // যদি ভ্যারিয়েন্ট ছাড়া প্রোডাক্ট হয় তবে সরাসরি totalStock কমানো
          product.totalStock = Math.max(0, product.totalStock - Number(item.qty));
        }

        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin er jonno)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const previousStatus = order.status;
      const newStatus = req.body.status || order.status;
      order.status = newStatus;

      // অগ্রিম টাকা (Advance Paid) আপডেট করার লজিক
      if (req.body.advancePaid !== undefined) {
        order.advancePaid = Math.max(0, Number(req.body.advancePaid));
        // যদি পুরো টাকাই পরিশোধ হয়ে যায় তবে অটোমেটিক Paid মার্ক হবে
        if (order.advancePaid >= order.totalPrice) {
          order.isPaid = true;
          order.paidAt = order.paidAt || Date.now();
        }
      }

      if (newStatus === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      // যদি অ্যাডমিন অর্ডারটি Cancelled করে, তবে স্টক আবার ফেরত যোগ হবে
      if (newStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (product && product.variants && product.variants.length > 0) {
            const variantIndex = product.variants.findIndex(
              (v) =>
                v.color.trim().toLowerCase() === String(item.color).trim().toLowerCase() &&
                v.size.trim().toLowerCase() === String(item.size).trim().toLowerCase()
            );

            if (variantIndex !== -1) {
              product.variants[variantIndex].stock += Number(item.qty);
            }

            product.totalStock = product.variants.reduce(
              (acc, curr) => acc + Number(curr.stock || 0),
              0
            );
            await product.save();
          }
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order by ID (Guest & Logged-in user)
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};