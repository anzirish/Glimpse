/**
 * Email Service for Glimpse E-commerce Application
 * Handles password reset email functionality
 */

import nodemailer from "nodemailer";
import { generateResetToken } from "../utils/jwt";

export const sendEmail = async (
  userMail: string,
  userId: string,
  userName: string
) => {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    await transporter.verify();

    // Generate reset token with userId
    const resetToken = generateResetToken(userId);

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `Glimpse <${user}>`,
      to: userMail,
      subject: "Reset Your Password - Glimpse",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>You requested to reset your password for your Glimpse account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Glimpse Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email");
  }
};
