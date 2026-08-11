import Dish from "../model/dish.js";
import {
  AssetFolder,
  destroyTenantAsset,
  uploadTenantAsset,
} from "../utils/cloudinary.js";
import { PUBLIC_MENU_PROJECTION } from "../utils/projections.js";

const createDish = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, nameEn, description, descriptionEn, price, category, pregnant, gluten, lactose, vegi, hide } = req.body;

    // 0. וולידציה בסיסית
    if (!userId || !name || !category) {
      return res.status(400).json({ message: "UserId, Name, and Category are required" });
    }

    // 1. בדיקת כפילות
    const isexist = await Dish.findOne({ userId, name });
    if (isexist) {
      return res.status(400).json({ message: "Dish with this name already exists for this user" });
    }

    // 2. יצירת המנה (ללא שמירה) — ה-_id נדרש כדי לבנות את נתיב התמונה
    const newDish = new Dish({
      userId,
      name,
      nameEn: nameEn || "",
      description: description || "",
      descriptionEn: descriptionEn || "",
      price: price ? Number(price) : undefined,
      category,
      pregnant: pregnant === "true" || pregnant === true,
      gluten: gluten === "true" || gluten === true,
      lactose: lactose === "true" || lactose === true,
      vegi: vegi === "true" || vegi === true,
      hide: hide === "true" || hide === true,
      img: null,
    });

    // 3. העלאה ל-Cloudinary לתיקייה של הלקוח
    if (req.file) {
      const uploadResult = await uploadTenantAsset({
        buffer: req.file.buffer,
        userId,
        folder: AssetFolder.DISHES,
        publicId: newDish._id,
        displayName: name,
      });
      newDish.img = uploadResult.secure_url;
    }

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

    // מיון בטיחותי (JavaScript Level) למניעת קפיצת מנות ישנות לראש התפריט
    dishes.sort((a, b) => {
      const locA = a.locationNumber != null ? a.locationNumber : Infinity;
      const locB = b.locationNumber != null ? b.locationNumber : Infinity;
      return locA - locB;
    });

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
    
    // מיון בטיחותי
    dishes.sort((a, b) => {
      const locA = a.locationNumber != null ? a.locationNumber : Infinity;
      const locB = b.locationNumber != null ? b.locationNumber : Infinity;
      return locA - locB;
    });

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
      // Remove the previous image (best effort — never blocks the update)
      await destroyTenantAsset(dish.img, userId);

      const uploadResult = await uploadTenantAsset({
        buffer: req.file.buffer,
        userId,
        folder: AssetFolder.DISHES,
        publicId: dish._id,
        displayName: name || dish.name, // dish.name is still the pre-update value here
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




const reorderDishes = async (req, res) => {
  const { userId } = req.params;
  const { dishes } = req.body;

  if (!Array.isArray(dishes)) {
    return res.status(400).json({ message: "Invalid dishes data" });
  }

  try {
    const bulkOps = dishes.map((dish) => ({
      updateOne: {
        filter: { _id: dish._id, userId }, // מחייב ש-userId יתאים (אבטחה)
        update: { $set: { locationNumber: dish.locationNumber } },
      },
    }));

    await Dish.bulkWrite(bulkOps);

    res.status(200).json({ message: "Dishes reordered successfully" });
  } catch (error) {
    console.error("Error reordering dishes:", error);
    res.status(500).json({ message: "Internal Server Error during reorder" });
  }
};

const migrateDishLocations = async (req, res) => {
  try {
    const allDishes = await Dish.find({}, '_id userId category locationNumber').lean();

    const groupedDishes = {};
    allDishes.forEach(dish => {
      const key = `${dish.userId}_${dish.category}`;
      if (!groupedDishes[key]) {
        groupedDishes[key] = [];
      }
      groupedDishes[key].push(dish);
    });

    const bulkOps = [];

    for (const key in groupedDishes) {
      const dishesInCategory = groupedDishes[key];
      
      dishesInCategory.sort((a, b) => {
        const locA = a.locationNumber != null ? a.locationNumber : Infinity;
        const locB = b.locationNumber != null ? b.locationNumber : Infinity;
        return locA - locB;
      });

      dishesInCategory.forEach((dish, index) => {
        const expectedLocation = index + 1;
        if (dish.locationNumber !== expectedLocation) {
          bulkOps.push({
            updateOne: {
              filter: { _id: dish._id },
              update: { $set: { locationNumber: expectedLocation } }
            }
          });
        }
      });
    }

    if (bulkOps.length > 0) {
      await Dish.bulkWrite(bulkOps);
      return res.status(200).json({ message: `Migration successful. Updated ${bulkOps.length} dishes.` });
    }

    return res.status(200).json({ message: "No dishes needed migration." });
  } catch (error) {
    console.error("Migration Error:", error);
    return res.status(500).json({ message: "Error during migration", error: error.message });
  }
};

export { createDish, getAllDishesByUserId,getDishesByCategory, updateDish, deleteDish, reorderDishes, migrateDishLocations };
