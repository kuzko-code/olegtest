import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { CONFIGURATIONS } from '../../config';

export async function sendMail(mailOptions: Mail.Options) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: CONFIGURATIONS.EMAIL.user,
          pass: CONFIGURATIONS.EMAIL.password 
        }
      });

    let info = await transporter.sendMail(mailOptions);
    return info;
}
