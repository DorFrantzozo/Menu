import Category from "../model/category.js";
import Dish from "../model/dish.js";
import {
  AssetFolder,
  destroyTenantAsset,
  uploadTenantAsset,
} from "../utils/cloudinary.js";
import { PUBLIC_MENU_PROJECTION } from "../utils/projections.js";

const createCategoryByUserId = async (req, res) => {
  try {
    const { userId, name, nameEn, locationNumber, hasTimeLimit, startTime, endTime, activeDays, parentCategory } = req.body;

    if (!userId || !name || !locationNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing category name
    const existingCategory = await Category.findOne({ userId, name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Check for existing location number
    const existCategoryLocationNumber = await Category.findOne({
      userId,
      locationNumber,
    });
    if (existCategoryLocationNumber) {
      return res
        .status(200)
        .json({ message: "Category Location is already used " });
    }

    // Build the document (unsaved) — its _id is the category's image path
    const newCategory = new Category({
      userId,
      name,
      nameEn: nameEn || "",
      img: "",
      locationNumber,
      hasTimeLimit: hasTimeLimit === "true" || hasTimeLimit === true || false,
      startTime: startTime || null,
      endTime: endTime || null,
      activeDays: activeDays ? (typeof activeDays === "string" ? JSON.parse(activeDays) : activeDays) : [],
      parentCategory: parentCategory || null,
    });

    // Ensure the file is uploaded properly
    if (req.file) {
      try {
        const uploadResult = await uploadTenantAsset({
          buffer: req.file.buffer,
          userId,
          folder: AssetFolder.CATEGORIES,
          publicId: newCategory._id,
          displayName: name,
        });

        newCategory.img = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: uploadError.message });
      }
    }

    await newCategory.save();

    res.status(201).json({ newCategory });
  } catch (error) {
    console.error("Error Creating Category:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getCategoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // STRICT FILTERING: Ensure userId is present
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const categories = await Category.find({ userId }).select(PUBLIC_MENU_PROJECTION);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//TODO: function needs category id!!!
const updateCategoryByUserId = async (req, res) => {
  const { userId, categoryId } = req.params;
  const { newName, nameEn, locationNumber, hide, hasTimeLimit, startTime, endTime, activeDays, parentCategory } = req.body;

  try {
    // Ensure categoryId is provided
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Find the category by userId and categoryId
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found for this user" });
    }

    // Handle image upload if a new file is provided
    if (req.file) {
      // Remove the previous image (best effort — never blocks the update)
      await destroyTenantAsset(category.img, userId);

      const uploadResult = await uploadTenantAsset({
        buffer: req.file.buffer,
        userId,
        folder: AssetFolder.CATEGORIES,
        publicId: category._id,
        displayName: newName || category.name, // category.name is still the pre-update value here
      });

      category.img = uploadResult.secure_url;
    }

    // Check if location number is already used (excluding the current category)
    const existingCategoryWithLocation = await Category.findOne({
      userId,
      locationNumber,
      _id: { $ne: categoryId }, // Exclude the current category
    });

    if (existingCategoryWithLocation) {
      return res
        .status(400)
        .json({ message: "Category location is already used" });
    }

    // Update category fields only if they have changed
    if (locationNumber && category.locationNumber !== locationNumber) {
      category.locationNumber = locationNumber;
    }

    if (newName && category.name !== newName) {
      category.name = newName;
    }

    if (nameEn !== undefined) {
      category.nameEn = nameEn;
    }

    if (hide !== undefined) {
      category.hide = hide === "true" || hide === true;
    }

    if (hasTimeLimit !== undefined) {
      category.hasTimeLimit = hasTimeLimit === "true" || hasTimeLimit === true;
    }

    if (startTime !== undefined) {
      category.startTime = startTime || null;
    }

    if (endTime !== undefined) {
      category.endTime = endTime || null;
    }

    if (activeDays !== undefined) {
      category.activeDays = typeof activeDays === "string" ? JSON.parse(activeDays) : activeDays;
    }

    if (parentCategory !== undefined) {
      category.parentCategory = parentCategory === "" ? null : parentCategory;
    }

    // Save updated category
    await category.save();
    res.status(200).json({ category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { userId, categoryId } = req.params;

  try {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found for this user" });
    }

    // Delete associated dishes
    const deleteResult = await Dish.deleteMany({ category: categoryId });

    await destroyTenantAsset(category.img, userId);

    await category.deleteOne();
    
    res.status(200).json({ 
      message: `Category and ${deleteResult.deletedCount} associated dishes deleted successfully`,
      deletedDishesCount: deleteResult.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const reorderCategories = async (req, res) => {
  const { userId } = req.params;
  const { categories } = req.body;
  // expected: [{ _id: "123", locationNumber: 1 }, { _id: "456", locationNumber: 2 }]

  if (!Array.isArray(categories)) {
    return res.status(400).json({ message: "Invalid categories data" });
  }

  try {
    const bulkOps = categories.map((cat) => ({
      updateOne: {
        filter: { _id: cat._id, userId },
        update: { $set: { locationNumber: cat.locationNumber } },
      },
    }));

    await Category.bulkWrite(bulkOps);

    const updatedCategories = await Category.find({ userId }).sort(
      "locationNumber"
    );

    res.status(200).json({ categories: updatedCategories });
  } catch (error) {
    console.error("Error reordering categories:", error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createCategoryByUserId,
  getCategoriesByUserId,
  updateCategoryByUserId,
  deleteCategory,
  reorderCategories,
};
