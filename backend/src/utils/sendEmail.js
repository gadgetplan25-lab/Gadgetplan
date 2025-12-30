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
      console.log(`✅ Gmail sent to ${to} (attempt ${i + 1})`);
      return true;
    } catch (error) {
      console.error(`❌ Gmail failed (attempt ${i + 1}):`, error.message);

      if (i === retries - 1) {
        // Last attempt failed
        console.error(`🚨 All Gmail attempts failed for ${to}`);
        throw error;
      }

      // Wait before retry (exponential backoff: 1s, 2s, 4s)
      const waitTime = 1000 * Math.pow(2, i);
      console.log(`⏳ Retrying Gmail in ${waitTime}ms...`);
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
    console.log(`📧 Email sent successfully via Gmail to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed for ${to}:`, error.message);
    throw error;
  }
}

/**
 * Test email configuration
 */
async function testEmailConfig() {
  console.log('\n🔧 Testing email configuration...');

  try {
    await gmailTransporter.verify();
    console.log('✅ Gmail connection successful');
    return true;
  } catch (error) {
    console.error('❌ Gmail connection failed:', error.message);
    return false;
  }
}

module.exports = {
  sendEmail,
  testEmailConfig
};