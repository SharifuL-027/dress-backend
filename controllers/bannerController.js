// controllers/bannerController.js
import Banner from '../models/Banner.js';

// ১. নতুন ব্যানার তৈরি করা
export const createBanner = async (req, res) => {
  try {
    const { title, image, type, category, link } = req.body;

    const banner = new Banner({
      title,
      image,
      type,
      category: category ? category : null,
      link
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(500).json({ message: "Failed to create banner", error: error.message });
  }
};

// ২. সব ব্যানার একসাথে আনা (ফিল্টার সহ)
export const getBanners = async (req, res) => {
  try {
    const { type, category } = req.query;
    
    // ফিল্টার লজিক (ফ্রন্টএন্ড থেকে কোয়েরি পাঠালে সেই অনুযায়ী ব্যানার আসবে)
    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;

    // ক্যাটাগরির নামসহ পপুলেট করে ব্যানারগুলো আনবো
    const banners = await Banner.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
      
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners", error: error.message });
  }
};

// ৩. ব্যানার ডিলিট করা
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // নোট: Cloudinary থেকে ইমেজ ডিলিট করার লজিক চাইলে এখানে অ্যাড করতে পারেন (public_id ব্যবহার করে)
    
    await banner.deleteOne();
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete banner", error: error.message });
  }
};