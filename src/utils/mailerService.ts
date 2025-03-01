import fs from "fs";
import { mailConfig } from "../config/mail";
import nodemailer, { SendMailOptions } from "nodemailer";
import { MAIL_FROM_NAME, MAIL_USERNAME } from "../constants/environment";

// GetFile Content
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(mailConfig);

// Converting Stream to Buffer
export const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    stream.on("data", (data: Buffer) => buffers.push(data));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

interface Attachment {
  filename: string;
  path: string;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  content: string;
  attachments?: Attachment[];
  next: (error: Error | null, info?: nodemailer.SentMessageInfo) => void;
}

// GetFile Content
export const getFileContent = async (filePath: string): Promise<string> => {
  const fileStream = fs.createReadStream(filePath);
  const buffer = await streamToBuffer(fileStream);
  return buffer.toString();
};

// send mail with defined transport object
export const sendEmails = ({ to, subject, content, attachments, next }: SendEmailOptions): void => {
  try {
    const message: SendMailOptions = {
      from: {
        name: MAIL_FROM_NAME || 'defaultName',
        address: MAIL_USERNAME || 'defaultName',
      },
      to: to,
      subject: subject,
      html: content,
      attachments,
    };
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return next(error); // Call next with the error for further handling
      }
      console.log("Email sent:", info);
      next(null, info); // Call next with success info
    });
  } catch (error) {
    console.error("Caught error:", error);
    next(error as Error); // Call next with caught error
  }
};
