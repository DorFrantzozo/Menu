// Seeds a demo menu (categories, sub-categories and dishes) for a single user
// so the six designs can be exercised against realistic data.
//
// Safe to re-run: it removes only the target user's own categories and dishes
// before inserting, scoped by userId, and never touches another account.
//
//   node scripts/manual/seed-demo-menu.js
//   node scripts/manual/seed-demo-menu.js someone@example.com
import mongoose from "mongoose";
import dotenv from "dotenv";
import {fileURLToPath} from "url";
import path from "path";
import User from "../../model/user.js";
import Category from "../../model/category.js";
import Dish from "../../model/dish.js";
import {assertDevDatabase} from "../../utils/assertDevDatabase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, "..", "..", ".env")});

assertDevDatabase("seed-demo-menu.js");

const TARGET_EMAIL = process.argv[2] || "frshops20@gmail.com";

// Placeholder photography. Deterministic per seed so the menu looks the same on
// every run; swap for real dish photos through the admin UI when needed.
const photo = (seed) => `https://picsum.photos/seed/${seed}/800/600`;

const CATEGORIES = [
  {key: "starters", name: "ראשונות", nameEn: "Starters", locationNumber: 1},
  {key: "mains", name: "עיקריות", nameEn: "Main Courses", locationNumber: 2},
  {key: "grill", name: "מהגריל", nameEn: "From the Grill", locationNumber: 1, parent: "mains"},
  {key: "sea", name: "מהים", nameEn: "From the Sea", locationNumber: 2, parent: "mains"},
  {key: "desserts", name: "קינוחים", nameEn: "Desserts", locationNumber: 3},
  {
    key: "drinks",
    name: "שתייה",
    nameEn: "Drinks",
    locationNumber: 4,
    // Exercises the scheduling fields without ever hiding the category.
    hasTimeLimit: true,
    startTime: "00:00",
    endTime: "23:59",
    activeDays: [0, 1, 2, 3, 4, 5, 6],
  },
];

const DISHES = [
  // ── ראשונות ────────────────────────────────────────────────────────────
  {
    category: "starters",
    name: "פוקאצ'ה של הבית",
    nameEn: "House Focaccia",
    description: "בצק מחמצת בהתפחה ארוכה, אפוי בטאבון על אבן, מוברש בשמן זית כתית ורוזמרין טרי. מוגש עם חמאת עשבים.",
    descriptionEn: "Long-fermented sourdough baked on stone, brushed with olive oil and fresh rosemary. Served with herb butter.",
    price: 38,
    vegi: true,
    img: photo("focaccia"),
    locationNumber: 1,
  },
  {
    category: "starters",
    name: "קרפצ'ו סלק וגבינת עיזים",
    nameEn: "Beetroot & Goat Cheese Carpaccio",
    description: "פרוסות סלק צלוי דקיקות, גבינת עיזים רכה, אגוזי מלך קלויים וויניגרט הדרים.",
    descriptionEn: "Thin roasted beetroot slices, soft goat cheese, toasted walnuts and citrus vinaigrette.",
    price: 46,
    vegi: true,
    gluten: true,
    img: photo("beetroot"),
    locationNumber: 2,
  },
  {
    category: "starters",
    name: "קלמארי פריך",
    nameEn: "Crispy Calamari",
    description: "טבעות קלמארי בציפוי סמולינה קלילה, מטוגנות עד להזהבה, עם איולי שום ולימון כבוש.",
    descriptionEn: "Semolina-crusted calamari rings fried golden, with garlic aioli and preserved lemon.",
    price: 62,
    salePrice: 52,
    lactose: true,
    img: photo("calamari"),
    locationNumber: 3,
  },
  {
    category: "starters",
    name: "מרק היום",
    nameEn: "Soup of the Day",
    description: "משתנה מדי יום לפי השוק. שאלו את הצוות מה מתבשל היום.",
    descriptionEn: "Changes daily according to the market. Ask our team what is cooking today.",
    price: 34,
    vegi: true,
    gluten: true,
    lactose: true,
    locationNumber: 4,
  },

  // ── מהגריל ─────────────────────────────────────────────────────────────
  {
    category: "grill",
    name: "אנטריקוט 300 גרם",
    nameEn: "Entrecôte 300g",
    description: "נתח אנטריקוט מיושן 21 יום, צרוב על גריל פחמים, מוגש עם ירקות שורש צלויים ורוטב יין אדום.",
    descriptionEn: "21-day aged entrecôte seared over charcoal, with roasted root vegetables and red wine jus.",
    price: 168,
    gluten: true,
    img: photo("entrecote"),
    locationNumber: 1,
  },
  {
    category: "grill",
    name: "פילה עוף בלימון ותימין",
    nameEn: "Lemon Thyme Chicken Fillet",
    description: "חזה עוף במרינדת לימון, שום ותימין, על מצע פירה כרובית ושמן זית לימוני.",
    descriptionEn: "Chicken breast marinated in lemon, garlic and thyme, over cauliflower purée.",
    price: 98,
    gluten: true,
    img: photo("chicken"),
    locationNumber: 2,
  },
  {
    category: "grill",
    name: "קבב טלה על האש",
    nameEn: "Grilled Lamb Kebab",
    description: "טלה טחון גס עם פטרוזיליה ובצל, נצלה על שיפוד, מוגש בלאפה ביתית עם טחינה גולמית.",
    descriptionEn: "Coarsely ground lamb with parsley and onion, skewered and grilled, with raw tahini.",
    price: 112,
    lactose: true,
    img: photo("kebab"),
    locationNumber: 3,
  },

  // ── מהים ───────────────────────────────────────────────────────────────
  {
    category: "sea",
    name: "פילה דניס בתנור",
    nameEn: "Oven-Baked Sea Bream",
    description: "פילה דניס טרי אפוי עם עגבניות שרי, זיתי קלמטה ושמן זית, לצד תפוחי אדמה בייבי.",
    descriptionEn: "Fresh sea bream fillet baked with cherry tomatoes, Kalamata olives and baby potatoes.",
    price: 134,
    gluten: true,
    lactose: true,
    img: photo("seabream"),
    locationNumber: 1,
  },
  {
    category: "sea",
    name: "טאטאקי טונה אדומה",
    nameEn: "Red Tuna Tataki",
    description: "נתח טונה אדומה צרוב מבחוץ ונא בפנים, בציפוי שומשום, עם רוטב פונזו וצנוניות חמוצות.",
    descriptionEn: "Sesame-crusted red tuna, seared outside and rare inside, with ponzu and pickled radish.",
    price: 128,
    lactose: true,
    pregnant: true,
    img: photo("tuna"),
    locationNumber: 2,
  },
  {
    category: "sea",
    name: "לינגוויני פירות ים",
    nameEn: "Seafood Linguine",
    description: "פסטה טרייה עם שרימפס, קלמארי ומולים ברוטב עגבניות שרי, שום, צ'ילי ויין לבן.",
    descriptionEn: "Fresh pasta with shrimp, calamari and mussels in cherry tomato, garlic and white wine.",
    price: 142,
    lactose: true,
    img: photo("linguine"),
    locationNumber: 3,
  },

  // ── קינוחים ────────────────────────────────────────────────────────────
  {
    category: "desserts",
    name: "מלבי הדרים",
    nameEn: "Citrus Malabi",
    description: "מלבי קטיפתי בטעם מי ורדים, סירופ הדרים, פיסטוק קצוץ וקוקוס.",
    descriptionEn: "Velvety rose-water malabi with citrus syrup, crushed pistachio and coconut.",
    price: 42,
    vegi: true,
    gluten: true,
    img: photo("malabi"),
    locationNumber: 1,
  },
  {
    category: "desserts",
    name: "סופלה שוקולד חם",
    nameEn: "Warm Chocolate Soufflé",
    description: "עוגת שוקולד בלגי עם לב נוזלי, מוגשת חמה עם גלידת וניל בורבון. זמן הכנה 15 דקות.",
    descriptionEn: "Belgian chocolate cake with a molten centre, served warm with bourbon vanilla ice cream.",
    price: 52,
    vegi: true,
    img: photo("souffle"),
    locationNumber: 2,
  },
  {
    category: "desserts",
    name: "קרם ברולה וניל",
    nameEn: "Vanilla Crème Brûlée",
    description: "קרם וניל עשיר עם קרמל קריספי, מוגש בקוקוט קלאסי.",
    descriptionEn: "Rich vanilla custard with a crisp caramel top, served in a classic cocotte.",
    price: 46,
    vegi: true,
    gluten: true,
    // Hidden on purpose — verifies that hidden dishes never reach the menu.
    hide: true,
    locationNumber: 3,
  },

  // ── שתייה ──────────────────────────────────────────────────────────────
  {
    category: "drinks",
    name: "לימונענע קפוא",
    nameEn: "Frozen Lemonade & Mint",
    description: "לימון סחוט טרי, נענע קטופה וקרח כתוש. מרענן במיוחד.",
    descriptionEn: "Freshly squeezed lemon, picked mint and crushed ice.",
    price: 24,
    vegi: true,
    gluten: true,
    lactose: true,
    locationNumber: 1,
  },
  {
    category: "drinks",
    name: "אספרסו כפול",
    nameEn: "Double Espresso",
    description: "תערובת בית קלויה בקלייה בינונית, גוף מלא עם סיומת שוקולדית.",
    descriptionEn: "Medium-roast house blend, full bodied with a chocolate finish.",
    price: 14,
    vegi: true,
    gluten: true,
    lactose: true,
    locationNumber: 2,
  },
  {
    category: "drinks",
    name: "יין הבית - כוס",
    nameEn: "House Wine - Glass",
    description: "אדום או לבן, לפי בחירת השף. שאלו את הצוות על היין הפתוח היום.",
    descriptionEn: "Red or white, chef's selection. Ask our team about today's open bottle.",
    price: 36,
    salePrice: 29,
    vegi: true,
    gluten: true,
    lactose: true,
    pregnant: true,
    locationNumber: 3,
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log(`Connected to "${mongoose.connection.name}".`);

  const user = await User.findOne({email: TARGET_EMAIL});
  if (!user) {
    console.error(`No user found for ${TARGET_EMAIL}. Nothing was written.`);
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`Target: ${user.restaurantName} <${TARGET_EMAIL}> (${user._id})`);

  const removedDishes = await Dish.deleteMany({userId: user._id});
  const removedCategories = await Category.deleteMany({userId: user._id});
  console.log(
    `Cleared ${removedCategories.deletedCount} categories and ${removedDishes.deletedCount} dishes for this user.`,
  );

  // Parents first, so children can resolve parentCategory to a real id.
  const idByKey = {};
  for (const c of CATEGORIES.filter((c) => !c.parent)) {
    const doc = await Category.create({
      userId: user._id,
      name: c.name,
      nameEn: c.nameEn,
      locationNumber: c.locationNumber,
      hasTimeLimit: c.hasTimeLimit ?? false,
      startTime: c.startTime,
      endTime: c.endTime,
      activeDays: c.activeDays,
    });
    idByKey[c.key] = doc._id;
  }
  for (const c of CATEGORIES.filter((c) => c.parent)) {
    const doc = await Category.create({
      userId: user._id,
      name: c.name,
      nameEn: c.nameEn,
      locationNumber: c.locationNumber,
      parentCategory: idByKey[c.parent],
    });
    idByKey[c.key] = doc._id;
  }

  await Dish.insertMany(
    DISHES.map((d) => ({
      userId: user._id,
      category: idByKey[d.category],
      name: d.name,
      nameEn: d.nameEn,
      description: d.description,
      descriptionEn: d.descriptionEn,
      price: d.price,
      salePrice: d.salePrice,
      img: d.img,
      vegi: d.vegi ?? false,
      gluten: d.gluten ?? false,
      lactose: d.lactose ?? false,
      pregnant: d.pregnant ?? false,
      hide: d.hide ?? false,
      locationNumber: d.locationNumber,
    })),
  );

  const visible = DISHES.filter((d) => !d.hide).length;
  console.log(
    `Seeded ${CATEGORIES.length} categories (${CATEGORIES.filter((c) => c.parent).length} nested) ` +
      `and ${DISHES.length} dishes (${visible} visible, ${DISHES.length - visible} hidden).`,
  );
  console.log(`Menu slug: ${user.qrSlug}  ·  design ${user.designNumber}`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
