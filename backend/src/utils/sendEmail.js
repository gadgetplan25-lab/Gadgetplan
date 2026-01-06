const nodemailer = require("nodemailer");

// Gmail transporter
const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Kirim email via Gmail dengan retry mechanism
 * @param {string} to - Email penerima
 * @param {string} subject - Subject email
 * @param {string} html - HTML content email (opsional)
 * @param {string} text - Text content email (opsional)
 * @param {number} retries - Jumlah maksimal retry (default: 3)
 */
async function sendEmailViaGmail(to, subject, html = null, text = null, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const mailOptions = {
        from: `"Gadget Plan" <${process.env.EMAIL}>`,
        to,
        subject,
      };

      // Gunakan html jika ada, fallback ke text
      if (html) {
        mailOptions.html = html;
      } else if (text) {
        mailOptions.text = text;
      } else {
        throw new Error('Email content (html atau text) harus disediakan');
      }

      await gmailTransporter.sendMail(mailOptions);

      return true;
    } catch (error) {


      if (i === retries - 1) {
        // Last attempt failed

        throw error;
      }

      // Wait before retry (exponential backoff: 1s, 2s, 4s)
      const waitTime = 1000 * Math.pow(2, i);

      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * Kirim email dengan retry mechanism
 * @param {string} to - Email penerima
 * @param {string} subject - Subject email
 * @param {string} html - HTML content email (opsional)
 * @param {string} text - Text content email (opsional)
 * @param {number} retries - Jumlah maksimal retry untuk Gmail (default: 3)
 */
async function sendEmail(to, subject, html = null, text = null, retries = 3) {
  try {
    await sendEmailViaGmail(to, subject, html, text, retries);

    return true;
  } catch (error) {

    throw error;
  }
}

/**
 * Test email configuration
 */
async function testEmailConfig() {


  try {
    await gmailTransporter.verify();

    return true;
  } catch (error) {

    return false;
  }
}

module.exports = {
  sendEmail,
  testEmailConfig
};