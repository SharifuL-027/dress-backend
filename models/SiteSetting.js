import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    // ১. Navbar Settings
    topBarText: {
      type: String,
      default: "Welcome to DressTown",
    },
    logoUrl: {
      type: String,
      default: "https://res.cloudinary.com/dsrs8hryx/image/upload/v1789818500/DressTown_Logo_Png_oilfhm.png",
    },

    // ২. Contact & Footer Common Information
    phone: {
      type: String,
      default: "+880 1700-000000",
    },
    whatsapp: {
      type: String,
      default: "+880 1700-000000",
    },
    email: {
      type: String,
      default: "support@dresstown.com",
    },
    address: {
      type: String,
      default: "Uttara, Dhaka, Bangladesh",
    },
    workingHours: {
      type: String,
      default: "Saturday - Thursday: 10:00 AM - 10:00 PM",
    },
    googleMapEmbedUrl: {
      type: String,
      default: "",
    },

    // ৩. Footer & Social Links
    footerAbout: {
      type: String,
      default: "DressTown — Your trusted destination for premium fashion and lifestyle apparel in Bangladesh.",
    },
    copyrightText: {
      type: String,
      default: "© 2026 DressTown. All Rights Reserved.",
    },
    facebookUrl: {
      type: String,
      default: "https://facebook.com",
    },
    instagramUrl: {
      type: String,
      default: "https://instagram.com",
    },
    tiktokUrl: {
      type: String,
      default: "",
    },
    youtubeUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const SiteSetting = mongoose.model("SiteSetting", siteSettingSchema);
export default SiteSetting;