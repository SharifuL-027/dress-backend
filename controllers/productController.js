import Product from '../models/Product.js';


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    // ফ্রন্টএন্ড থেকে পাঠানো সব ডেটা রিসিভ করা (এখানে ছবি ও ভিডিওর URL সহ আসবে)
    const { sizes, colors, ...restData } = req.body;

    // কমা (,) দিয়ে পাঠানো string-কে Array তে কনভার্ট করা
    const sizesArray = sizes ? sizes.split(',').map(s => s.trim()) : [];
    const colorsArray = colors ? colors.split(',').map(c => c.trim()) : [];

    // সরাসরি ডাটাবেসে সেভ করা
    const product = new Product({
      ...restData,
      sizes: sizesArray,
      colors: colorsArray,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    console.error("Product Creation Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product slug already exists." });
    }
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get all products (with category filter & lightning fast speed)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const query = {};
    
    // Jodi URL e category filter thake (e.g., ?category=6ab0d9ba...)
    if (req.query.category) {
      query.category = req.query.category;
    }

    // .lean() bebohar kora hoyeche jate MongoDB theke plain JSON ashe (khub fast hobe)
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 }) // <-- Ei line-ti ekhane add kora hoyeche
      .lean();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get data for sidebar filters (Category counts, Min/Max Price)
// @route   GET /api/products/filters
// @access  Public
export const getSidebarFilters = async (req, res) => {
  try {
    // 1. Category onujayi koyta product ache tar count ber kora
    const categoryCounts = await Product.aggregate([
      { $match: { isActive: true } }, // Shudhu active product gulo nibo
      {
        $group: {
          _id: '$category', // Category ID diye group korbo
          count: { $sum: 1 } // Koyta product ache ta count korbo
        }
      },
      {
        $lookup: {
          from: 'categories', // Category collection er sathe join korchi
          localField: '_id',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      { $unwind: '$categoryData' },
      {
        $project: {
          _id: 1,
          name: '$categoryData.name',
          slug: '$categoryData.slug',
          count: 1
        }
      },
      { $sort: { count: -1 } } // Beshi product thaka category upore thakbe
    ]);

    // 2. Minimum ebong Maximum price ber kora (Price range slider er jonno)
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      categories: categoryCounts,
      priceRange: priceRange.length > 0 ? priceRange[0] : { minPrice: 0, maxPrice: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID (এডিট পেজে ডেটা দেখানোর জন্য)
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subCategory', 'name slug'); // <-- এই লাইনটি যুক্ত করা হলো
      
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid product ID or server error" });
  }
};

// @desc    Update a product (এডিট পেজ থেকে সেভ করার জন্য)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { sizes, colors, ...restData } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // কমা দেওয়া স্ট্রিংগুলোকে আবার অ্যারে বানিয়ে নেওয়া
      const sizesArray = sizes ? (typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : sizes) : product.sizes;
      const colorsArray = colors ? (typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors) : product.colors;

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { ...restData, sizes: sizesArray, colors: colorsArray },
        { new: true } // নতুন আপডেট হওয়া ডেটা রিটার্ন করবে
      );
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (লিস্ট থেকে ডিলিট করার জন্য)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne(); // ডাটাবেস থেকে রিমুভ করা
      res.json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};