import Category from '../models/Category.js';

// ================= CREATE CATEGORY =================
export const createCategory = async (req, res) => {
  try {
    const { name, slug, parent, image, sortOrder } = req.body;

    // Check korbo same slug diye already category ache kina
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists with this slug.' });
    }

    // Check korbo position/sortOrder already taken kina (0 chara)
    if (sortOrder && sortOrder > 0) {
      const positionExists = await Category.findOne({ sortOrder });
      if (positionExists) {
        return res.status(400).json({ message: `Position ${sortOrder} is already taken by '${positionExists.name}'. Please choose another position.` });
      }
    }

    const category = await Category.create({
      name,
      slug,
      parent: parent || null,
      image,
      sortOrder: sortOrder || 0,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET CATEGORIES =================
// @desc    Get all categories (Mega Menu er jonno Nested format e)
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    // 1. ডেটাবেস থেকে সব ক্যাটাগরি ফেচ করা হলো
    const categories = await Category.find({}).populate('parent', 'name slug');

    // 2. স্মার্ট সর্টিং লজিক (যাতে 1, 2, 3 আগে আসে এবং 0 পরে বা শেষে যায়)
    const sortedCategories = categories.sort((a, b) => {
      const orderA = a.sortOrder || 0;
      const orderB = b.sortOrder || 0;

      if (orderA > 0 && orderB > 0) return orderA - orderB;
      if (orderA > 0 && orderB === 0) return -1;
      if (orderB > 0 && orderA === 0) return 1;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 3. সর্ট করা ডেটা ফন্টএন্ডে পাঠানো হলো
    res.json(sortedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE CATEGORY =================
export const updateCategory = async (req, res) => {
  try {
    const { name, slug, parent, image, sortOrder } = req.body;
    
    // Check korbo position/sortOrder already taken kina (nijer ID baad diye)
    if (sortOrder && sortOrder > 0) {
      const positionExists = await Category.findOne({ sortOrder, _id: { $ne: req.params.id } });
      if (positionExists) {
        return res.status(400).json({ message: `Position ${sortOrder} is already taken by '${positionExists.name}'. Please choose another position.` });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, parent: parent || null, image, sortOrder: sortOrder || 0 },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE CATEGORY =================
// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.deleteMany({ parent: category._id }); 
    
    // মেইন ক্যাটাগরিটি ডিলিট করা
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};