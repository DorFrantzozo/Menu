import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const extractMenuFromImage = async (buffer, mimeType) => {
  const base64Data = buffer.toString("base64");

  const contents = [
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    },
    {
      text: `Analyze this menu image and convert it to a structured JSON for the 'iMenu' digital platform.

             CORE LOGIC RULES:
             1. AUTOMATIC TRANSLATION: You MUST fill 'nameEn' and 'descriptionEn' for every item and category. If English is not on the image, translate the original text into high-quality, professional culinary English.
             2. DIETARY ICONS (CRITICAL): Any dietary icon present (Milk bottle, Wheat, Leaf/V, Pregnant lady) means the dish IS SUITABLE for that sensitivity.
                - Milk bottle icon -> lactose: true (Safe for lactose-sensitive)
                - Wheat/Grain icon -> gluten: true (Gluten-free)
                - Leaf/V symbol -> vegi: true (Vegetarian)
                - Pregnant lady icon -> pregnant: true (Safe for pregnancy)
                - If no icon is present, set the field to false.
             3. PRICE LOGIC: Extract numbers only. 
                - If there are multiple prices for one item (e.g., Small/Large), take the lowest/base price.
                - If a price is crossed out or marked as a discount, map the original to 'price' and the new one to 'salePrice'.
             4. CLEANUP: Remove marketing slogans or fluff (e.g., "Our best seller!", "Highly recommended") from names and descriptions.
             5. VISUAL GROUPING: If Hebrew and English text appear for the same item price, merge them into a single object (name/nameEn) rather than two separate items.

             Return ONLY a JSON object. Maintain Hebrew for 'name' and 'description'.`,
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash",
      contents: contents,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  nameEn: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        nameEn: { type: "string" },
                        description: { type: "string" },
                        descriptionEn: { type: "string" },
                        price: { type: "number" },
                        salePrice: { type: "number" },
                        pregnant: { type: "boolean" },
                        gluten: { type: "boolean" },
                        lactose: { type: "boolean" },
                        vegi: { type: "boolean" },
                      },
                      required: ["name", "price"],
                    },
                  },
                },
                required: ["name", "items"],
              },
            },
          },
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("נכשלה סריקת התפריט. וודא שהתמונה ברורה מספיק.");
  }
};
