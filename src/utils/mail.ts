import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASS,
  },
});


export const sendVerificationToken = async (email: string, token: string) => {
  await transporter.sendMail({
    from: 'no-reply@example.com',
    to: email,
    subject: 'Verify your account',
    html: `Kindly use the otp to verify your account ${token}`,
  });
}

export const referCandidateMail = async (email: string, name: string, jobLink: string) => {
  await transporter.sendMail({
    from: 'no-reply@example.com',
    to: email,
    subject: 'Verify your account',
    html: `Hi ${name} you have just been refered to a job by a friend lindly apply for this role using the link <a href="${jobLink}">apply here</a>`,
  });
};
