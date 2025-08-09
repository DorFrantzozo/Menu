// sendgrid.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * שולח מייל עם טמפלט דינמי של SendGrid
 * @param {Object} options
 * @param {string} options.to - כתובת אימייל של הנמען
 * @param {string} options.templateId - מזהה טמפלט של SendGrid
 * @param {Object} options.dynamicData - הנתונים הדינמיים להזרקה לטמפלט
 */
const sendEmail = async ({ to, templateId, dynamicData,subject  }) => {
 
  const msg = {
    to,
    from:  process.env.SENDGRID_FROM_EMAIL,
    subject:subject,
    templateId,
    dynamic_template_data: dynamicData,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent to", to);
    return { success: true };
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error);
    return { success: false, error };
  }
};

export { sendEmail };
