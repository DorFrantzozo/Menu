import Category from "../model/category.js";
import cloudinary from "../utils/cloudinary.js";

const createCategoryByUserId = async (req, res) => {
  try {
    const { userId, name, locationNumber } = req.body;

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
        .status(400)
        .json({ message: "Category Location is already used " });
    }

    let imgUrl = null;

    // Ensure the file is uploaded properly
    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "categories",
              public_id: `categories/${name}`,
              transformation: { quality: "auto", fetch_format: "auto" },
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer); // Ensure buffer is correctly passed
        });

        imgUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: uploadError });
      }
    }

    const newCategory = new Category({
      userId,
      name,
      img: imgUrl || "", // Default to empty string if no image is uploaded
      locationNumber,
    });

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
    const { userId } = req.body;
    const categories = await Category.find({ userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//TODO: function needs category id!!!
const updateCategoryByUserId = async (req, res) => {
  const { userId, categoryId } = req.params;
  const { newName, locationNumber } = req.body;

  console.log("User ID:", userId);
  console.log("Category ID:", categoryId);
  console.log("New Name:", newName);
  console.log("Location Number:", locationNumber);
  console.log("Request Params:", req.params);

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
      if (category.img) {
        // Extract publicId from existing Cloudinary URL and delete old image
        const publicId = category.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`categories/${publicId}`);
      }

      // Upload new image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `categories/${category.name.replace(/\s+/g, "_")}`,
              folder: "categories",
              transformation: {
                quality: "auto",
                fetch_format: "auto",
              },
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(req.file.buffer);
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

    // Save updated category
    await category.save();
    res.status(200).json({ category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: error.message });
  }
};

//TODO: function needs category id!!!
const deleteCategory = async (req, res) => {
  const { userId, categoryId } = req.params;

  try {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found for this user" });
    }

    if (category.img) {
      const publicId = category.img.split("/").pop().split(".")[0]; 
      await cloudinary.uploader.destroy(`categories/${publicId}`);
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default deleteCategory;

export {
  createCategoryByUserId,
  getCategoriesByUserId,
  updateCategoryByUserId,
  deleteCategory,
};
