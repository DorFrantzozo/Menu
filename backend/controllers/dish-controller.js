import Dish from "../model/dish.js"; // Ensure the correct path to your model

// Create a new dish
const createDish = async (req, res) => {
  const userId = req.params.id;
  const { name, img, description, price, category, pregnant, gluten, lactose } =
    req.body;
  const isexist = await Dish.findOne({ userId, name });
  if (isexist) {
    return res.status(400).json({ message: "Dish already exists" });
  }
  const newDish = new Dish({
    userId,
    name,
    img,
    description,
    price,
    category,
    pregnant,
    gluten,
    lactose,
  });

  try {
    await newDish.save();
    console.log("Dish created successfully");
    res.status(201).json(newDish);
  } catch (error) {
    console.error("Error creating dish:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get dishes by category and userId
const getDishesByCategory = async (req, res) => { 
  try {
    const { userId, category } = req.params;
    const dishes = await Dish.find({ userId, category });
    res.status(200).json(dishes);
    console.log("Dishes retrieved successfully:", dishes);
  } catch (error) {
    console.error("Error retrieving dishes:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update a dish by userId and dishId
const updateDish = async (req, res) => {
  const { userId, dishId } = req.params; // Changed from categoryId to dishId
  const { name, img, description, price, category, pregnant, gluten, lactose } =
    req.body;

  try {
    const dish = await Dish.findOne({ _id: dishId, userId }); // Find by dishId and userId
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    // Update fields
    dish.name = name;
    dish.img = img;
    dish.description = description;
    dish.price = price;
    dish.category = category;
    dish.pregnant = pregnant;
    dish.gluten = gluten;
    dish.lactose = lactose;

    await dish.save();
    res.status(200).json(dish);
  } catch (error) {
    console.error("Error updating dish:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete a dish by userId and dishId
const deleteDish = async (req, res) => {
  const { userId, dishId } = req.params; // Changed from categoryId to dishId

  try {
    const dish = await Dish.findOne({ _id: dishId, userId }); // Find by dishId and userId
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    await dish.deleteOne();
    res.status(200).json({ message: "Dish deleted successfully" });
  } catch (error) {
    console.error("Error deleting dish:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export { createDish, getDishesByCategory, updateDish, deleteDish };
