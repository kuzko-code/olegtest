import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { db } from "../../db";
import { CONFIGURATIONS } from "../../config";

export async function sendMail(mailOptions: Mail.Options) {
  const settings = await getSMTPServerSettings();

  let mailer = {
    host: CONFIGURATIONS.EMAIL.host,
    port: CONFIGURATIONS.EMAIL.port,
    auth: {
      user: CONFIGURATIONS.EMAIL.user,
      pass: CONFIGURATIONS.EMAIL.password,
    },
  };

  if (settings.host && settings.port) {
    mailer = {
      host: settings.host,
      port: settings.port,
      auth: {
        user: settings.user,
        pass: settings.password,
      },
    };
  }

  if (!(mailer.host && mailer.port)) return "Smtp server is not configured";

  const transporter = nodemailer.createTransport(mailer);
  let info = await transporter.sendMail(mailOptions);
  return info;
}

async function getSMTPServerSettings(client = db) {
  const getJSONSchema = `SELECT settings_object FROM site_settings WHERE title = 'smtp'`;

  return (await client.query(getJSONSchema)).rows[0].settings_object;
}
