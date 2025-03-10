import Dish from "../model/dish.js";
import cloudinary from "../utils/cloudinary.js";

const createDish = async (req, res) => {
  const { userId } = req.body;
  const {
    name,
    description,
    price,
    category,
    pregnant,
    gluten,
    lactose,
    vegi,
  } = req.body;

  const isexist = await Dish.findOne({ userId, name });

  if (isexist) {
    return res.status(400).json({ message: "Dish already exists" });
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
          .end(req.file.buffer);
      });
      imgUrl = uploadResult.secure_url;
      const newDish = new Dish({
        userId,
        name,
        img: imgUrl,
        description,
        price,
        category,
        pregnant,
        gluten,
        lactose,
        vegi,
      });

      await newDish.save();
      console.log("Dish created successfully");
      res.status(201).json(newDish);
    }
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
  const { userId, dishId } = req.params;
  const {
    name,
    description,
    price,
    category,
    pregnant,
    gluten,
    lactose,
    vegi,
  } = req.body;

  try {
    const dish = await Dish.findOne({ _id: dishId, userId });
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Check if a new image is being uploaded
    if (req.file) {
      if (dish.img) {
        // If the dish already has an image, delete it from Cloudinary
        const publicId = dish.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`dishes/${publicId}`);
      }

      // Upload new image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `dishes/${dish.name.replace(/\s+/g, "_")}`, // Use dish name or a unique identifier
              folder: "dishes",
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

      dish.img = uploadResult.secure_url; // Update dish image URL with the new one
    }

    // Update other fields
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.category = category;
    dish.pregnant = pregnant;
    dish.gluten = gluten;
    dish.lactose = lactose;
    dish.vegi = vegi;

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
