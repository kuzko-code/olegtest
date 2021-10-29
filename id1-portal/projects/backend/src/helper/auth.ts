import { db } from "../db";
import { emailServices } from "../helper/email";
class AuthServices {
  public generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  public createCodeForUser = async (
    email: string,
    full_name: string,
    language: string,
    client = db
  ) => {
    const code = this.generateCode();
    const createUser = `
					INSERT INTO public."plugins.appealOfCitizens.users"
					(email, confirmation_password, number_of_activation_requests)
					VALUES($1, $2, false, 0);`;
    const User = await client.query(createUser, [email, code]);

    return User;
  };

  public sendMessageWithCode = async (
    email: string,
    code: string,
    language: string
  ) => {
    const i18n = require("i18n");
    i18n.setLocale(language);
    let html = `<div style="color: #585F73; font-weight:600">
        </div>  <div style="color: #585F73">
          ${i18n.__("messageInEmailAboutNewCode", { code })}
        </div>`;

    return await emailServices.sendEmail(email, language, html);
  };

  // public sendMessageWithCode = async (
  //   email: string,
  //   code: string,
  //   language: string
  // ) => {
  //   const i18n = require("i18n");
  //   i18n.setLocale(language);
  //   let html = `<div style="color: #585F73; font-weight:600">
  //       </div>  <div style="color: #585F73">
  //         ${i18n.__("messageInEmailAboutNewCode", { code })}
  //       </div>`;

  //   return await emailServices.sendEmail(email, language, html);
  // };
}

export const Auth = new AuthServices();
