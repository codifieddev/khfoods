import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { getEmailMessagesData } from "@/data/storefront/globals";

type EmailData = {
  to: string;
  subject: string;
  html: string;
};

type EmailResponse = {
  success: boolean;
  messageId: string;
};

const createEmailTransporter = async () => {
  const { smtp } = await getEmailMessagesData("en");

  const { host, fromEmail, password, port, secure, user } = smtp ?? {};

  // Trim whitespace from all string values to prevent DNS errors
  const finalHost = (host ?? process.env.SMTP_HOST)?.trim();
  const finalUser = (user ?? process.env.SMTP_USER)?.trim();
  const finalPassword = (password ?? process.env.SMTP_PASS)?.trim();
  const finalFromEmail = (fromEmail ?? process.env.SMTP_USER)?.trim();

  const finalPort = Number(port ?? 587);
  const finalSecure = secure ?? false;

  if (!finalHost || !finalUser || !finalPassword) {
    throw new Error('SMTP configuration is incomplete. Please set up email settings in the Admin Panel.');
  }

  const transportConfig: SMTPTransport.Options = {
    host: finalHost,
    port: finalPort,
    secure: finalSecure,
    auth: { 
      user: finalUser, 
      pass: finalPassword 
    },
    tls: {
      rejectUnauthorized: false, 
      minVersion: 'TLSv1.2',
    },
    requireTLS: finalPort === 465 && !finalSecure ? true : undefined,
  };

  const transporter = nodemailer.createTransport(transportConfig);

  try {
    await transporter.verify();
  } catch (verifyError) {
    throw new Error(`SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`);
  }

  return {
    transporter,
    fromEmail: finalFromEmail
  };
};

export const sendEmail = async ({ to, subject, html }: EmailData): Promise<EmailResponse> => {
  const { transporter, fromEmail } = await createEmailTransporter();

  try {
    const { messageId } = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html
    });

    return { success: true, messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown email error";
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};
