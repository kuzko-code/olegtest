import { db } from "../../db";
import { method_payload } from "../base_api_image";
import {
  login_payload,
  reset_password_payload,
  change_password_payload,
  confirmation_password,
  update_user_code_password,
} from "./types";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { EXCEPTION_MESSAGES, AUTH } from "../../constants";
import { private_key } from "../../config";
import { DEFAULT_LANGUAGE } from "../../constants";
import { id_payload } from "../common/types";
import { Auth } from "../../helper/auth";

class Api {
  private generateJWT(
    id: number,
    email: string,
    role: string,
    is_active: boolean,
    keepSignedIn: boolean
  ) {
    const today = new Date();
    const expirationDate = new Date(today);

    let expiration = 1;
    if (keepSignedIn == true) expiration = 30;
    expirationDate.setDate(today.getDate() + expiration); //add days

    return jwt.sign(
      {
        userId: id,
        email: email,
        role: role,
        is_active: is_active,
        exp: Math.round(expirationDate.getTime() / 1000),
      },
      private_key
    );
  }

  public async confirmation_password({
    options: { email, code, typeOfUser = "users", language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<confirmation_password>) {
    const nowDate = new Date(Date.now());
    nowDate.setHours(nowDate.getHours() - 1);

    const activateUser = `
          UPDATE authorization_data
          SET is_active=true, number_of_activation_requests = 0, confirmation_password=null, code_updated=null
          from pg_class p
          WHERE authorization_data.tableoid = p.oid AND authorization_data.confirmation_password=$1 AND authorization_data.email=$2 
          AND authorization_data.number_of_activation_requests<$3 AND p.relname=$4 AND code_updated > $5
          RETURNING id, email, role, is_active`;
    const result = await client.query(activateUser, [
      code,
      email,
      AUTH.NUMBER_OF_ACTIVATION_REQUESTS,
      typeOfUser,
      nowDate,
    ]);

    await this.checkIfAuthorizationDataWasUpdate(
      result.rowCount != 0,
      email,
      typeOfUser,
      nowDate
    );

    if (result.rowCount != 0) {
      const token = this.generateJWT(
        result.rows[0].id,
        result.rows[0].email,
        result.rows[0].role,
        result.rows[0].is_active,
        false
      );
      return { token: token };
    }
  }

  private async getNumberOfActivationRequests(
    email: string,
    typeOfUser: string,
    client = db
  ) {
    const getNumberOfActivationRequests = `
    SELECT number_of_activation_requests 
    FROM authorization_data, pg_class p               
    WHERE email=$1 AND authorization_data.tableoid = p.oid AND relname=$2;`;

    let numberOfRequests = -1;
    try {
      numberOfRequests = (
        await client.query(getNumberOfActivationRequests, [email, typeOfUser])
      ).rows[0].number_of_activation_requests;
    } catch {}

    return numberOfRequests;
  }

  private async checkTheExpirationDateOfTheCode(
    email: string,
    typeOfUser: string,
    date: Date,
    client = db
  ) {
    const getNumberOfActivationRequests = `
    SELECT 1
    FROM authorization_data, pg_class p               
    WHERE email=$1 AND authorization_data.tableoid = p.oid AND relname=$2 AND code_updated > $3;`;

    let result = await client.query(getNumberOfActivationRequests, [
      email,
      typeOfUser,
      date,
    ]);
    if (result.rowCount == 0) {
      let err = new Error(EXCEPTION_MESSAGES.ON_EXPIRED_CODE);
      err.statusCode = 401;
      throw err;
    }
  }

  private async checkForUserEmail(
    email: string,
    typeOfUser: string,
    client = db
  ) {
    const getNumberOfActivationRequests = `
    SELECT 1
    FROM authorization_data, pg_class p               
    WHERE email=$1 AND authorization_data.tableoid = p.oid AND relname=$2;`;

    let result = await client.query(getNumberOfActivationRequests, [
      email,
      typeOfUser,
    ]);
    if (result.rowCount == 0) {
      let err = new Error(EXCEPTION_MESSAGES.ON_USER_IS_NOT_DEFINED);
      err.statusCode = 401;
      throw err;
    }
  }

  private async incrementNumberOfActivationRequests(
    email: string,
    typeOfUser: string,
    client = db
  ) {
    const numberOfActivationRequests = `
    UPDATE authorization_data  
    SET number_of_activation_requests = authorization_data.number_of_activation_requests + 1
    from pg_class p
    WHERE authorization_data.tableoid = p.oid AND authorization_data.email=$1 AND p.relname=$2 RETURNING authorization_data.number_of_activation_requests`;
    return await client
      .query(numberOfActivationRequests, [email, typeOfUser])
      .then((e) => e.rows[0].number_of_activation_requests);
  }

  private async checkIfAuthorizationDataWasUpdate(
    updated: boolean,
    email: string,
    typeOfUser: string,
    nowDate: Date
  ) {
    if (!updated) {
      await this.checkForUserEmail(email, typeOfUser);
      await this.checkTheExpirationDateOfTheCode(email, typeOfUser, nowDate);

      let numberOfRequests = await this.getNumberOfActivationRequests(
        email,
        typeOfUser
      );

      if (numberOfRequests === -1) {
        let err = new Error(EXCEPTION_MESSAGES.ON_USER_IS_NOT_DEFINED);
        err.statusCode = 403;
        throw err;
      }

      if (numberOfRequests >= AUTH.NUMBER_OF_ACTIVATION_REQUESTS) {
        let err = new Error(EXCEPTION_MESSAGES.ON_USER_ACTIVATION_EXCEEDED);
        err.statusCode = 403;
        throw err;
      }

      await this.incrementNumberOfActivationRequests(email, typeOfUser);

      let err = new Error(EXCEPTION_MESSAGES.ON_INVALID_CODE);
      err.statusCode = 403;
      throw err;
    }
  }

  public async update_user_code({
    options: { email, typeOfUser = "users", language },
    client = db,
  }: method_payload<update_user_code_password>) {
    const nowDate = new Date(Date.now());

    const code = Auth.generateCode();
    const updateUserCode = `
        UPDATE authorization_data
        SET confirmation_password=$1, number_of_activation_requests=0, code_updated=$2
        from pg_class p
        WHERE authorization_data.tableoid = p.oid AND authorization_data.email=$3 AND p.relname=$4`;

    let result = await client.query(updateUserCode, [
      code,
      nowDate,
      email,
      typeOfUser,
    ]);

    if (result.rowCount == 0) {
      let err = new Error(EXCEPTION_MESSAGES.ON_USER_IS_NOT_DEFINED);
      err.statusCode = 401;
      throw err;
    }
    await Auth.sendMessageWithCode(email, code.toString(), language);

    return {};
  }

  public user_login({
    options: { email, password, keepSignedIn = false, typeOfUser = "users" },
    client = db,
  }: method_payload<login_payload>) {
    const sql = `
            select authorization_data.* from authorization_data, pg_class p where is_active = true AND email = $1 AND authorization_data.tableoid = p.oid AND relname=$2;
        `;

    return client
      .query(sql, [email, typeOfUser])
      .then(({ rows }) => rows[0])
      .then((res) => {
        if (!res) {
          let err = new Error(EXCEPTION_MESSAGES.ON_AUTH_FAILED_EXCEPTION);
          err.statusCode = 403;
          throw err;
        }

        const hash = crypto
          .createHmac("sha256", private_key)
          .update(password)
          .digest("hex");
        if (hash === res.password) {
          const token = this.generateJWT(
            res.id,
            res.email,
            res.role,
            res.is_active,
            keepSignedIn
          );
          return { token: token };
        }

        let err = new Error(EXCEPTION_MESSAGES.ON_AUTH_FAILED_EXCEPTION);
        err.statusCode = 403;
        throw err;
      });
  }

  public async reset_password({
    options: { email, typeOfUser = "users", code, password, language },
    client = db,
  }: method_payload<reset_password_payload>) {
    const passwordHash = crypto
      .createHmac("sha256", private_key)
      .update(password)
      .digest("hex");

    const nowDate = new Date(Date.now());
    nowDate.setHours(nowDate.getHours() - 1);

    const resetGeneralUsersPassword = `
          UPDATE authorization_data
          SET number_of_activation_requests = 0, confirmation_password=null, password = $1, code_updated = null
          from pg_class p
          WHERE authorization_data.tableoid = p.oid
          AND authorization_data.confirmation_password=$2
          AND authorization_data.email=$3
          AND code_updated > $4
          AND p.relname=$5
          RETURNING id, email, role, is_active`;

    const result = await client.query(resetGeneralUsersPassword, [
      passwordHash,
      code,
      email,
      nowDate,
      typeOfUser,
    ]);

    await this.checkIfAuthorizationDataWasUpdate(
      result.rowCount != 0,
      email,
      typeOfUser,
      nowDate
    );

    if (result.rowCount != 0) {
      const token = this.generateJWT(
        result.rows[0].id,
        result.rows[0].email,
        result.rows[0].role,
        result.rows[0].is_active,
        false
      );
      return { token: token };
    }
  }

  public async change_password({
    options: { userId, oldPassword, newPassword },
    client = db,
  }: method_payload<change_password_payload>) {
    const getActualPassword = `
        SELECT password
        FROM authorization_data
        WHERE id = $1
        `;

    const oldPasswordHash = crypto
      .createHmac("sha256", private_key)
      .update(oldPassword)
      .digest("hex");
    const actualPasswordHash = (await client.query(getActualPassword, [userId]))
      .rows[0].password;

    if (oldPasswordHash !== actualPasswordHash) {
      throw new Error("Invalid old password.");
    }

    const updatePassword = `
        UPDATE authorization_data
        SET password = $1
        WHERE id = $2
        `;

    const newPasswordHash = crypto
      .createHmac("sha256", private_key)
      .update(newPassword)
      .digest("hex");

    const res = await client.query(updatePassword, [newPasswordHash, userId]);
    return {};
  }

  public async get_authorization_data_by_general_users_id({
    options: { id },
    client = db,
  }: method_payload<id_payload>) {
    const getUser = `
            SELECT * FROM authorization_data
            WHERE id = $1
        `;

    const res = await client.query(getUser, [id]);
    if (!res.rows[0])
      throw new Error(EXCEPTION_MESSAGES.ON_USER_IS_NOT_DEFINED);
    return res.rows[0];
  }
}

export const user_auth = new Api();
