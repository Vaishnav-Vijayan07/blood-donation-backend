const nodemailer = require("nodemailer");
// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

// Function to send password reset email with the new password
const sendPasswordEmail = async (toEmail, newPassword) => {
  try {
    const mailOptions = {
      from: `"KSESA Thrissur" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your New Password",
      html: `
        <h2>Password Reset</h2>
        <p>An admin has reset your account password.</p>
        <p><strong>New Password:</strong> ${newPassword}</p>
        <p>Please log in with this password and change it in your account settings for security.</p>
        <p>If you did not expect this change, please contact support immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email");
  }
};

module.exports = { sendPasswordEmail };
