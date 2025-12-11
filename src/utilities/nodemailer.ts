import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { getCachedGlobal } from "./getGlobals";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

type EmailResponse = {
  success: boolean;
  messageId: string;
};

const createEmailTransporter = async () => {
  const { smtp } = await getCachedGlobal("emailMessages", "en", 1)();

  const { host, fromEmail, password, port, secure, user } = smtp ?? {};


  // Trim whitespace from all string values to prevent DNS errors
  const finalHost = (host ?? process.env.SMTP_HOST)?.trim();
  const finalUser = (user ?? process.env.SMTP_USER)?.trim();
  const finalPassword = (password ?? process.env.SMTP_PASS)?.trim();
  const finalFromEmail = (fromEmail ?? process.env.SMTP_USER)?.trim();

  const finalPort = Number(port ?? 587);
  const finalSecure = secure ?? false;

  console.log(`[SMTP] Configuring email transporter with host: ${finalHost}, user: ${finalUser}, port: ${finalPort}, secure: ${finalSecure}`);
  console.log(`[SMTP] Password length: ${finalPassword?.length || 0} characters`);
  console.log(`[SMTP] Username format check: ${finalUser?.includes('@') ? '✅ Contains @' : '⚠️ Missing @ (should be full email)'}`);

  if (!finalHost || !finalUser || !finalPassword) {
    console.error('[SMTP] ❌ Missing SMTP configuration. Please configure in Admin Panel or environment variables.');
    throw new Error('SMTP configuration is incomplete. Please set up email settings in the Admin Panel.');
  }

  // For Hostinger and most SMTP providers:
  // Port 465: use secure: true
  // Port 587: use secure: false with requireTLS: true
  const transportConfig: SMTPTransport.Options = {
    host: finalHost,
    port: finalPort,
    secure: finalSecure,
    auth: { 
      user: finalUser, 
      pass: finalPassword 
    },
    // Add TLS configuration for both ports (Hostinger requirement)
    tls: {
      rejectUnauthorized: false, // For development - set to true in production
      minVersion: 'TLSv1.2',
    },
    requireTLS: finalPort === 465 && !finalSecure ? true : undefined,
  };

  console.log(`[SMTP] Transport config:`, { 
    host: finalHost, 
    port: finalPort, 
    secure: finalSecure,
    requireTLS: transportConfig.requireTLS,
    user: finalUser 
  });

  const transporter = nodemailer.createTransport(transportConfig);

  // Verify connection
  try {
    await transporter.verify();
    console.log(`[SMTP] ✅ Connection verified successfully`);
  } catch (verifyError) {
    console.error(`[SMTP] ❌ Connection verification failed:`, verifyError);
    throw new Error(`SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`);
  }

  return {
    transporter,
    fromEmail: finalFromEmail
  };
};

export const sendEmail = async ({ to, subject, html }: EmailPayload): Promise<EmailResponse> => {
  const { transporter, fromEmail } = await createEmailTransporter();

  console.log(`[Email] Sending email to: ${to}, subject: ${subject}, from: ${fromEmail}`);

  try {
    const { messageId } = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html
    });

    console.log(`[Email] ✅ Email sent successfully. MessageId: ${messageId}`);
    return { success: true, messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown email error";
    console.error(`[Email] ❌ Failed to send email:`, error);
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};
