import axios from "axios";

const MORNING_AUTH_URL = "https://api.sandbox.morning.dev/idp/v1/oauth/token";
const MORNING_API_BASE = "https://sandbox.d.greeninvoice.co.il/api/v1";

let cachedToken = null;

/**
 * התחברות למורנינג וקבלת טוקן
 */
export const loginToMorning = async () => {
  try {
    console.log("🔐 Attempting OAuth2 Login...");
    const response = await axios.post(MORNING_AUTH_URL, {
      grant_type: "client_credentials",
      client_id: process.env.MORNING_API_KEY,
      client_secret: process.env.MORNING_API_SECRET,
    });

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
 */
export const morningRequest = async (method, endpoint, data = {}) => {
  if (!cachedToken) await loginToMorning();

  try {
    const response = await axios({
      method,
      url: `${MORNING_API_BASE}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`,
      data,
      headers: {
        Authorization: `Bearer ${cachedToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      cachedToken = null;
      return morningRequest(method, endpoint, data);
    }
    throw error;
  }
};

/**
 * יצירת דף תשלום מאובטח
 * מאחד את יצירת הלקוח והתשלום לפעולה אחת למניעת שגיאות ולידציה
 */
export const createPaymentLink = async (
  user,
  planName = "Essential",
  checkoutData,
) => {
  // 1. קביעת מחיר בשרת בלבד
  let finalAmount;
  const PRICE_ESSENTIAL = Number(process.env.PRICE_ESSENTIAL) || 29;
  const PRICE_ADVANCE = Number(process.env.PRICE_ADVANCE) || 45;
  const PRICE_PRO = Number(process.env.PRICE_PRO) || 85;

  switch (planName) {
    case "iMenu PRO":
      finalAmount = PRICE_PRO;
      break;
    case "Advance":
      finalAmount = PRICE_ADVANCE;
      break;
    default:
      finalAmount = PRICE_ESSENTIAL;
      planName = "Essential";
  }

  try {
    console.log(
      `📡 Creating Morning payment for: ${checkoutData.email} | Plan: ${planName}`,
    );

    // 2. שליחת הבקשה לפי הסכמה של מורנינג
    const response = await morningRequest("POST", "/payments/form", {
      description: `iMenu ${planName} מנוי חודשי `,
      type: 400, // קבלה
      lang: "he",
      currency: "ILS",
      vatType: 0,
      amount: finalAmount,
      maxPayments: 1,
      pluginId: "1365af74-0ac5-4935-8bdd-7a57c75d6a36",
      options: {
        cardStorage: true,
      },
      client: {
        // אם כבר יש לו ID נשלח אותו, אם לא - מורנינג ייצור חדש לפי המייל
        id: user.morningCustomerId || undefined,
        name: checkoutData.fullName.trim(),
        emails: [checkoutData.email.trim().toLowerCase()],
        taxId: checkoutData.businessId || "",
        address: checkoutData.address || "",
        city: checkoutData.city || "",
        country: "IL",
        phone: checkoutData.phone || "",
        add: true, // יוצר/מעדכן לקוח אוטומטית
      },
      income: [
        {
          description: `מנוי חודשי iMenu - מסלול ${planName}`,
          quantity: 1,
          price: finalAmount,
          currency: "ILS",
          vatType: 0,
        },
      ],
      successUrl: "https://imenu-il.online/payment-success",
      failureUrl: "https://imenu-il.online/payment-failed",
      notifyUrl: process.env.MORNING_WEBHOOK_URL,
      custom: user._id.toString(), // ה-ID של המשתמש ב-DB שלנו
    });

    return response;
  } catch (error) {
    console.error(
      "❌ Morning API Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const chargeToken = async (user, amount, planName) => {
  if (!user.morningPaymentToken) {
    throw new Error(
      `Charge failed: Missing payment token for user ${user.email}`,
    );
  }
  if (!user.morningCustomerId) {
    throw new Error(
      `Charge failed: Missing morning customer ID for user ${user.email}`,
    );
  }
  try {
    console.log(
      `💸 Attempting to charge token for: ${user.email} | Amount: ₪${amount}`,
    );

    const payload = {
      description: `מנוי חודשי iMenu - מסלול ${planName}`,
      type: 400,
      lang: "he",
      currency: "ILS",
      vatType: 0,
      amount: amount,
      maxPayments: 1,
      income: [
        {
          catalogNum: "1",
          description: `מנוי חודשי iMenu - מסלול ${planName}`,
          quantity: 1,
          price: amount,
          currency: "ILS",
          vatType: 0,
        },
      ],

      notifyUrl: process.env.MORNING_WEBHOOK_URL,
    };
    const response = await morningRequest(
      "POST",
      `/payments/tokens/${user.morningPaymentToken}/charge`,
      payload,
    );
    return response;
  } catch (error) {
    console.error(
      "❌ Morning API Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const testSerchUserPayToken = async (
  paymentNumber,
  cardHolder,
  externalKey,
) => {
  try {
    const response = await morningRequest("POST", `payments/tokens/search`, {
      paymentNumber: paymentNumber,
      cardHolder: cardHolder,
      externalKey: externalKey,
    });

    console.log(
      `🔍  TOKENS IN SYSTEM: ${paymentNumber}, ${cardHolder}, ${externalKey}`,
      JSON.stringify(response, null, 2),
    );

    return response;
  } catch (error) {
    console.error(
      "❌ Morning API Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
