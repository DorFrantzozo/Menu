import axios from "axios";

// 1. כתובת השרת להנפקת טוקן (Identity Provider)
const MORNING_AUTH_URL = "https://api.sandbox.morning.dev/idp/v1/oauth/token";

// 2. כתובת השרת לביצוע הפעולות (API v1 Sandbox)
const MORNING_API_BASE = "https://sandbox.d.greeninvoice.co.il/api/v1";

let cachedToken = null;

/**
 * פונקציה לקבלת Access Token (OAuth 2.0)
 * משתמשת ב-client_id ו-client_secret מה-.env
 */
export const loginToMorning = async () => {
  try {
    console.log("🔐 Attempting OAuth2 Login...");

    const response = await axios.post(MORNING_AUTH_URL, {
      grant_type: "client_credentials",
      client_id: process.env.MORNING_API_KEY,
      client_secret: process.env.MORNING_API_SECRET,
    });

    // בשרת ה-IDP השדה נקרא accessToken
    cachedToken = response.data.accessToken;
    console.log("✅ OAuth Login Success!");
    return cachedToken;
  } catch (error) {
    console.error(
      "❌ OAuth Login Failed:",
      error.response?.data || error.message,
    );
    throw new Error("Morning Authentication Failed");
  }
};

/**
 * פונקציה גנרית לביצוע בקשות API
 * מוודאת שיש טוקן ומטפלת ב-Retry במקרה של 401
 */
const morningRequest = async (method, endpoint, data = {}) => {
  if (!cachedToken) await loginToMorning();

  try {
    const response = await axios({
      method,
      url: `${MORNING_API_BASE}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`,
      data,
      headers: {
        Authorization: `Bearer ${cachedToken}`,
        "Content-Type": "application/json",
        "User-Agent": "iMenu-App/1.0.0",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    // אם הטוקן פג תוקף, ננסה לחדש אותו פעם אחת
    if (error.response?.status === 401) {
      console.log("🔄 Token expired, refreshing...");
      cachedToken = null;
      return morningRequest(method, endpoint, data);
    }

    console.error(
      `❌ API Error at ${endpoint}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * יצירת לקוח (או החזרת ה-ID אם כבר קיים)
 */
export const getOrCreateCustomer = async (user) => {
  // אם ליוזר כבר יש ID של מורנינג במסד הנתונים שלנו
  if (user.morningCustomerId) return user.morningCustomerId;

  try {
    console.log(`👤 Creating customer for: ${user.email}`);

    const response = await morningRequest("POST", "/clients", {
      name: user.restaurantName || user.name || "לקוח iMenu",
      emails: [user.email], // חייב להיות מערך לפי הבדיקה בפוסטמן
      active: true,
      country: "IL",
    });

    // שמירת ה-ID ביוזר (Mongoose)
    user.morningCustomerId = response.id;
    if (user.save) await user.save();

    console.log("✅ Client Created in Morning:", response.id);
    return response.id;
  } catch (error) {
    console.error("❌ Failed to get/create customer");
    throw error;
  }
};

/**
 * יצירת דף תשלום עבור המנוי
 */
// MorningService.js
export const createPaymentLink = async (user) => {
  const customerId = await getOrCreateCustomer(user);
  console.log(customerId);

  try {
    console.log(`💳 Sending CLEAN request to bypass 403 for: ${customerId}`);

    const response = await morningRequest("POST", "/payments/form", {
      // 1. אנגלית בלבד לבדיקה
      description: "iMenu Premium Subscription",
      type: 320,
      lang: "he",
      currency: "ILS",
      amount: 1,
      pluginId: "7944827a-c664-11e4-8231-080027271115",
      client: {id: customerId},
      income: [
        {
          description: "Premium Service",
          quantity: 1,
          price: 149,
          vatType: 1,
        },
      ],
      // 2. קריטי: אסור שיופיע 'localhost' בתוך ה-Body!
      // השתמש בכתובת ה-ngrok שלך גם לכאן, או בגוגל לבדיקה
      successUrl: "https://www.google.com",
      failureUrl: "https://www.google.com",
      notifyUrl:
        "https://reda-exothermic-nonissuably.ngrok-free.dev/api/user/morning-webhook",

      custom: user._id.toString(),
    });

    console.log("✅ SUCCESS! No more 403.");

    return response;
  } catch (error) {
    console.error("❌ Error Data:", error.response?.data || error.message);
    throw error;
  }
};
