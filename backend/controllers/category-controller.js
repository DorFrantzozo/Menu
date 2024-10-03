import Category from "../model/category.js";
import cloudinary from "../utils/cloudinary.js";

const createCategoryByUserId = async (req, res) => {
  const { userId, name } = req.body;

  const existingCategory = await Category.findOne({ userId, name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
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
    });

    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default createCategoryByUserId;
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
  const { userId, categoryId, newName, newImg } = req.body;

  try {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found for this user" });
    }

    category.name = newName || category.name;
    category.img = newImg || category.img;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
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
