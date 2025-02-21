import Category from "../model/category.js";
import cloudinary from "../utils/cloudinary.js";

const createCategoryByUserId = async (req, res) => {
  const { userId, name, locationNumber } = req.body;

  const existingCategory = await Category.findOne({ userId, name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const existCateforyLocationNumber = await Category.findOne({
    userId,
    locationNumber,
  });
  if (existCateforyLocationNumber) {
    return res
      .status(400)
      .json({ message: "Category Location is already used " });
  }

  try {
    let imgUrl = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `categories/${name}`,
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
          .end(req.file.buffer); // Ensure req.file.buffer is used
      });

      imgUrl = uploadResult.secure_url;
    }

    const newCategory = new Category({
      userId,
      name,
      img: imgUrl,
      locationNumber: locationNumber,
    });

    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
        await cloudinary.uploader.destroy(`categorys/${publicId}`);
      }

      // Upload new image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `categorys/${category.name.replace(/\s+/g, "_")}`,
              folder: "categorys",
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
    res.status(200).json(category);
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

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createCategoryByUserId,
  getCategoriesByUserId,
  updateCategoryByUserId,
  deleteCategory,
};
