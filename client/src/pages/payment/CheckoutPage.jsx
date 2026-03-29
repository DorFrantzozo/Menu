import React, {useState} from "react";
import axiosInstance from "../../utils/baseUrl"; // וודא שהנתיב נכון
import loading from "../../components/Spinner"; // וודא שהנתיב נכון
const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!agreed) return alert("חובה לאשר את התקנון ומדיניות הביטולים");

    try {
      setLoading(true);
      // שליחת הבקשה ל-Backend שיצרנו (startCheckout)
      const res = await axiosInstance.post("/user/checkout", {
        ...formData,
        amount: 149,
      });

      if (res.data && res.data.url) {
        window.location.href = res.data.url; // מעבר למורנינג
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "חלה שגיאה בחיבור לסליקה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.checkoutCard}>
        <h2 style={styles.title}>פרטי הזמנה ושדרוג ל-Premium</h2>

        <div style={styles.summaryBox}>
          <span>מנוי חודשי iMenu</span>
          <strong>149 ₪</strong>
        </div>

        <form onSubmit={handlePayment} style={styles.form}>
          <input
            type="text"
            name="fullName"
            placeholder="שם מלא (כפי שמופיע על הכרטיס)"
            required
            style={styles.input}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="אימייל לקבלת חשבונית"
            required
            style={styles.input}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="טלפון ליצירת קשר"
            required
            style={styles.input}
            onChange={handleChange}
          />
          <div style={styles.row}>
            <input
              type="text"
              name="city"
              placeholder="עיר"
              style={styles.inputHalf}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="כתובת"
              style={styles.inputHalf}
              onChange={handleChange}
            />
          </div>

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <label htmlFor="terms" style={styles.label}>
              קראתי ואני מאשר את{" "}
              <span
                onClick={() => window.open("/termofservice", "_blank")}
                style={styles.link}
              >
                תקנון האתר
              </span>
              , מדיניות הפרטיות והגבלת גיל (18+)
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreed || loading}
            style={agreed ? styles.payButton : styles.disabledButton}
          >
            {loading ? "מתחבר לסליקה..." : "המשך לתשלום מאובטח"}
          </button>
        </form>

        <div style={styles.footerInfo}>
          <p>iMenu רחוב הקוקיה , ראשון לציון | טלפון: 053-4314774</p>
          <p style={styles.secureText}>🔒 סליקה מאובטחת בתקן PCI-DSS</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    direction: "rtl",
  },
  checkoutCard: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#1a1a1a",
    textAlign: "center",
  },
  summaryBox: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    marginBottom: "25px",
  },
  form: {display: "flex", flexDirection: "column", gap: "15px"},
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  row: {display: "flex", gap: "10px"},
  inputHalf: {
    flex: 1,
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
  label: {fontSize: "14px", color: "#4b5563"},
  link: {color: "#2563eb", textDecoration: "underline"},
  payButton: {
    padding: "15px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  disabledButton: {
    padding: "15px",
    backgroundColor: "#9ca3af",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "not-allowed",
    fontSize: "18px",
    marginTop: "10px",
  },
  footerInfo: {
    marginTop: "30px",
    borderTop: "1px solid #eee",
    paddingTop: "15px",
    textAlign: "center",
    fontSize: "12px",
    color: "#9ca3af",
  },
  secureText: {marginTop: "5px", color: "#10b981", fontWeight: "bold"},
};

export default CheckoutPage;
