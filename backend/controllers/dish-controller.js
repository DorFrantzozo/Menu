import Dish from "../model/dish.js";
import cloudinary from "../utils/cloudinary.js";
import { PUBLIC_MENU_PROJECTION } from "../utils/projections.js";

const createDish = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, nameEn, description, descriptionEn, price, category, pregnant, gluten, lactose, vegi, hide } = req.body;

    // 0. וולידציה בסיסית
    if (!userId || !name || !price || !category) {
      return res.status(400).json({ message: "UserId, Name, Price, and Category are required" });
    }

    // 1. בדיקת כפילות
    const isexist = await Dish.findOne({ userId, name });
    if (isexist) {
      return res.status(400).json({ message: "Dish with this name already exists for this user" });
    }

    let imgUrl = null;

    // 2. העלאה ל-Cloudinary
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "dishes",
            transformation: {
              quality: "auto",
              fetch_format: "auto",
              width: 1000,
              crop: "limit",
            },
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imgUrl = uploadResult.secure_url;
    }

    // 3. יצירת המנה
    const newDish = new Dish({
      userId,
      name,
      nameEn: nameEn || "",
      description: description || "",
      descriptionEn: descriptionEn || "",
      price: Number(price),
      category,
      pregnant: pregnant === "true" || pregnant === true,
      gluten: gluten === "true" || gluten === true,
      lactose: lactose === "true" || lactose === true,
      vegi: vegi === "true" || vegi === true,
      hide: hide === "true" || hide === true,
      img: imgUrl,
    });

    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};




// Get dishes by category and userId
const getDishesByCategory = async (req, res) => {
  try {
    const { userId, category } = req.params;

    // 🔒 חסימת אבטחה קריטית: מונעת זליגת מידע אם חסר פרמטר
    if (!userId || !category) {
      return res.status(400).json({ message: "User ID and Category ID are strictly required" });
    }

    // עכשיו זה בטוח ב-100%
    const dishes = await Dish.find({ userId, category }).select(PUBLIC_MENU_PROJECTION);

    res.status(200).json(dishes);

  } catch (error) {
    console.error("Error retrieving dishes:", error.message);
    res.status(500).json({ message: error.message });
  }
};
const getAllDishesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 🔒 חסימת האבטחה הקריטית:
    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({ message: "Strict error: User ID is required" });
    }

    // שליפה מאובטחת
    const dishes = await Dish.find({ userId }).select(PUBLIC_MENU_PROJECTION);
    
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error retrieving all dishes:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update a dish by userId and dishId
const updateDish = async (req, res) => {
  const { userId, dishId } = req.params;
  const {
    name,
    nameEn,
    description,
    descriptionEn,
    price,
    category,
    pregnant,
    gluten,
    lactose,
    vegi,
    hide,
    salePrice,
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
                width: 1000,
                crop: "limit"
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
    if (hide !== undefined) {
      dish.hide = hide === "true" || hide === true;
    }
    // Update other fields
    dish.name = name;
    if (nameEn !== undefined) dish.nameEn = nameEn;
    dish.description = description;
    if (descriptionEn !== undefined) dish.descriptionEn = descriptionEn;
    dish.price = price;
    dish.category = category;
    dish.pregnant = pregnant;
    dish.gluten = gluten;
    dish.lactose = lactose;
    dish.vegi = vegi;
    dish.salePrice = salePrice;

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





export { createDish, getAllDishesByUserId,getDishesByCategory, updateDish, deleteDish };
