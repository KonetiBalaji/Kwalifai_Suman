/**
 * @file emailService.ts
 * @author Balaji Koneti
 * @linkedin https://www.linkedin.com/in/balaji-koneti/
 * @github https://github.com/KonetiBalaji/kwalifai
 * 
 * Copyright (C) 2026 Balaji Koneti
 * All Rights Reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use is prohibited.
 */

/**
 * Send email verification OTP
 */
export async function sendEmailOTP(email: string, otp: string, firstName?: string | null): Promise<void> {
  const subject = 'Verify your email - Kwalifai';
  const greeting = firstName ? `Hello ${firstName},` : 'Hello,';
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #86E0CB 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Kwalifai</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <h2 style="color: #1f2937; margin-top: 0;">${greeting}</h2>
        <p style="font-size: 16px;">Thank you for registering with Kwalifai. Please use the verification code below to verify your email address:</p>
        
        <div style="background: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; font-family: 'Courier New', monospace;">
            ${otp}
          </div>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">This code will expire in 15 minutes.</p>
        <p style="font-size: 14px; color: #6b7280;">If you didn't request this code, please ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} Kwalifai. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  const textBody = `
${greeting}

Thank you for registering with Kwalifai. Please use the verification code below to verify your email address:

${otp}

This code will expire in 15 minutes.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} Kwalifai. All rights reserved.
  `.trim();

  await sendEmail({
    to: email,
    subject,
    html: htmlBody,
    text: textBody,
  });
}

/**
 * Send phone verification OTP via SMS
 * Note: This is a placeholder. In production, integrate with SMS provider like Twilio, AWS SNS, etc.
 */
export async function sendPhoneOTP(phone: string, otp: string): Promise<void> {
  // For development: log to console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[SMS] Sending OTP to ${phone}: ${otp}`);
    return;
  }

  // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
  // Example with Twilio:
  // const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // await twilioClient.messages.create({
  //   body: `Your Kwalifai verification code is: ${otp}. This code expires in 15 minutes.`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phone,
  // });

  // Example with AWS SNS:
  // const sns = new AWS.SNS();
  // await sns.publish({
  //   PhoneNumber: phone,
  //   Message: `Your Kwalifai verification code is: ${otp}. This code expires in 15 minutes.`,
  // }).promise();

  console.log(`[SMS] OTP for ${phone}: ${otp} (SMS service not configured)`);
}

/**
 * Send email using configured provider
 */
async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const emailProvider = process.env.EMAIL_PROVIDER || 'console';
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'no-reply@kwalifai.com';

  switch (emailProvider) {
    case 'aws-ses':
      await sendEmailViaAWS(options, fromAddress);
      break;
    case 'sendgrid':
      await sendEmailViaSendGrid(options, fromAddress);
      break;
    case 'nodemailer':
      await sendEmailViaNodemailer(options, fromAddress);
      break;
    case 'console':
    default:
      // Development mode: log to console
      console.log('\n=== EMAIL (Console Mode) ===');
      console.log(`To: ${options.to}`);
      console.log(`From: ${fromAddress}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`\n${options.text}`);
      console.log('============================\n');
      break;
  }
}

/**
 * Send email via AWS SES
 */
async function sendEmailViaAWS(
  options: { to: string; subject: string; html: string; text: string },
  fromAddress: string
): Promise<void> {
  // TODO: Implement AWS SES integration
  // const AWS = require('aws-sdk');
  // const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' });
  // await ses.sendEmail({
  //   Source: fromAddress,
  //   Destination: { ToAddresses: [options.to] },
  //   Message: {
  //     Subject: { Data: options.subject },
  //     Body: {
  //       Html: { Data: options.html },
  //       Text: { Data: options.text },
  //     },
  //   },
  // }).promise();
  
  console.log(`[AWS SES] Would send email to ${options.to} (not implemented)`);
}

/**
 * Send email via SendGrid
 */
async function sendEmailViaSendGrid(
  options: { to: string; subject: string; html: string; text: string },
  fromAddress: string
): Promise<void> {
  // TODO: Implement SendGrid integration
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  // await sgMail.send({
  //   to: options.to,
  //   from: fromAddress,
  //   subject: options.subject,
  //   html: options.html,
  //   text: options.text,
  // });
  
  console.log(`[SendGrid] Would send email to ${options.to} (not implemented)`);
}

/**
 * Send email via Nodemailer
 */
async function sendEmailViaNodemailer(
  options: { to: string; subject: string; html: string; text: string },
  fromAddress: string
): Promise<void> {
  // TODO: Implement Nodemailer integration
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: parseInt(process.env.SMTP_PORT || '587'),
  //   secure: process.env.SMTP_SECURE === 'true',
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });
  // await transporter.sendMail({
  //   from: fromAddress,
  //   to: options.to,
  //   subject: options.subject,
  //   html: options.html,
  //   text: options.text,
  // });
  
  console.log(`[Nodemailer] Would send email to ${options.to} (not implemented)`);
}
