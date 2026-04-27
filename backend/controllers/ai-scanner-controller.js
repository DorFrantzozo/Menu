import {GoogleGenAI} from "@google/genai";
import Category from "../model/category.js";
import Dish from "../model/dish.js";

export const scanMenu = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message: "No menu image uploaded"});
    }

    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    // We explicitly tell Gemini to return JSON
    const prompt = `
      You are an expert at reading restaurant menus.
      Extract all the dishes from the attached menu image.
      Return the output as a valid JSON array of objects, where each object has the following keys:
      - "category": The name of the category the dish belongs to (e.g. "Starters", "Main Courses", "Drinks"). If unclear, use "כללי".
      - "name": The name of the dish.
      - "description": The description of the dish if present.
      - "price": The price of the dish as a number (without currency symbols, just the digit). Make sure it's a number.
      
      Do not include any prefix or suffix, just the raw JSON array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {text: prompt},
            {
              inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype,
              },
            },
          ],
        },
      ],
    });

    let text = response.text;

    // Improved cleaning: Find the first '[' and last ']' to extract just the JSON array.
    // This allows the AI to occasionally include conversational text before or after the JSON.
    const startIdx = text.indexOf("[");
    const endIdx = text.lastIndexOf("]");

    let parsed = [];
    if (startIdx !== -1 && endIdx !== -1) {
      const jsonString = text.substring(startIdx, endIdx + 1);
      try {
        parsed = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse extracted JSON:", parseError);
        console.log("Raw text for debugging:", text);
        // Fallback or retry logic could be added here
      }
    } else {
      console.warn("No JSON array found in AI response:", text);
    }

    // Ensure we always return an array (empty if failed)
    const scannedItems = Array.isArray(parsed) ? parsed : [];

    return res.status(200).json({scannedItems});
  } catch (error) {
    if (
      error.status === 503 ||
      error.message.includes("503") ||
      error.message.toLowerCase().includes("overloaded")
    ) {
      console.warn("AI Service 503 overloaded:", error.message);
      return res
        .status(503)
        .json({error: "AI_BUSY", message: "Gemini is overloaded"});
    }
    console.error("Error scanning menu via AI:", error);
    return res
      .status(500)
      .json({message: "Failed to scan menu", error: error.message});
  }
};

export const saveScannedMenu = async (req, res) => {
  try {
    const {categories, userId} = req.body;

    if (!userId || !categories || !Array.isArray(categories)) {
      return res
        .status(400)
        .json({message: "userId and categories array are required"});
    }

    // 1. Fetch all existing categories for this user to get max locationNumber
    let maxLocation = 0;
    const existingCats = await Category.find({userId});
    for (const ec of existingCats) {
      if (ec.locationNumber > maxLocation) {
        maxLocation = ec.locationNumber;
      }
    }

    // 2. Keep a map of lowercase category names to their database IDs
    const catNameToId = {};
    existingCats.forEach((ec) => {
      catNameToId[ec.name.trim().toLowerCase()] = ec._id;
    });

    let newDishesCount = 0;

    for (const category of categories) {
      const catName = category.name || "כללי";
      const searchName = catName.trim().toLowerCase();
      let categoryId = catNameToId[searchName];

      // Create category if it doesn't exist
      if (!categoryId) {
        maxLocation += 1;
        const newCat = new Category({
          userId,
          name: catName.trim(),
          nameEn: "",
          locationNumber: maxLocation,
          img: "",
          hasTimeLimit: false,
        });
        await newCat.save();
        categoryId = newCat._id;
        catNameToId[searchName] = categoryId; // cache it
      }

      // Now insert all dishes for this category
      if (Array.isArray(category.items)) {
        for (const item of category.items) {
          const newDish = new Dish({
            userId,
            name: item.name || "ללא שם",
            nameEn: "",
            description: item.description || "",
            descriptionEn: "",
            price: Number(item.price) || 0,
            category: categoryId,
            pregnant: item.pregnant || false,
            gluten: item.gluten || false,
            lactose: item.lactose || false,
            vegi: item.vegi || false,
            hide: false,
            img: item.imageUrl || null,
          });
          await newDish.save();
          newDishesCount++;
        }
      }
    }

    return res
      .status(201)
      .json({message: "Saved successfully", insertedDishes: newDishesCount});
  } catch (error) {
    console.error("Error saving scanned menu:", error);
    return res
      .status(500)
      .json({message: "Failed to save scanned menu", error: error.message});
  }
};
