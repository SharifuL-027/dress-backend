import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '', // ফোন নম্বর পাঠানো হলো
        role: user.role, 
        addresses: user.addresses || []
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (Name & Phone)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Profile Update Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // বর্তমান পাসওয়ার্ড সঠিক কি না তা চেক করা
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password!' });
    }

    // নতুন পাসওয়ার্ড সেট করা (User মডেলে pre-save হুক থাকায় এটি অটোমেটিক হ্যাশ হয়ে যাবে)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error("Password Change Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete an admin user' });
      }
      
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};