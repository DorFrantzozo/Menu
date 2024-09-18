import Category from "../model/category.js";

const createCategoryByUserId = async (req, res) => {
  const { userId, name, img } = req.body;
  const newCategory = new Category({
    userId,
    name,
    img,
  });
  const existingCategory = await Category.findOne({ userId, name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }
  try {
    await newCategory.save();
    console.log("Category created successfully");
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
