import { db } from "../../db";
import format from "pg-format";
import { method_payload } from "../base_api_image";
import { Version } from "../portal/version";
import {
  registration_payload,
  get_or_delete_portal_update_setting_payload,
  update_schedule_updated_payload,
  get_portal_update_settings_payload,
} from "./types";
import { UpdatePortal } from "../portal/update";
import { CONFIGURATIONS } from "../../config/index";
import { UpdatePortalServices } from "../../helper/updatePortal";
import randomize from "randomatic";
import { Messages } from "../messages";
import { apiServices } from "../../helper/apiServices";
const schedule = require("node-schedule-tz");
const updatePortalUpdateSettings = `UPDATE portal_update_settings
SET settings_object = $1
WHERE title = $2
RETURNING title`;
let titleForUpdateSettings = "portalUpdateSchedule";

class Api {
  public async Initialize() {
    try {
      await this.checkIfTheUserRegistration();
    } catch (err) {
      if (
        err.message == "User does not exist" ||
        err.message == "Authentication on OGP market failed"
      )
        await this.automaticRegistration();
    }
    this.runTheUpdateSchedule();
  }

  public async automaticRegistration() {
    try {
      await this.user_registration({
        options: <any>{
          email: CONFIGURATIONS.ADMIN.USER_EMAIL,
          password: CONFIGURATIONS.ADMIN.USER_PASSWORD,
          name: CONFIGURATIONS.SERVER.PORTAL_ID,
        },
      });
    } catch (err) {
      // Messages.create_message({
      // 	options: { title: `Не вдалося зареєстувати портал на маркеті`, link: '' }
      // });
    }
  }

  public async checkIfTheUserRegistration() {
    let OGPMarketUrl = await UpdatePortalServices.getOGPMarketUrl();
    let authenticationInOGPMarket =
      await UpdatePortalServices.getOGPMarketCredentials();

    return await apiServices.getDataFromExternalResource(
      OGPMarketUrl,
      "/auth/portal",
      {},
      "GET",
      null,
      {
        accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${authenticationInOGPMarket.email}:${authenticationInOGPMarket.hash}`
        ).toString("base64")}}`,
      }
    );
  }

  public async user_registration({
    options,
    client = db,
  }: method_payload<registration_payload>) {
    let OGPMarketUrl = await UpdatePortalServices.getOGPMarketUrl();
    let password = randomize("Aa0!", 10);
    await apiServices.getDataFromExternalResource(
      OGPMarketUrl,
      "/OGPPortals/registration",
      {},
      "POST",
      JSON.stringify({
        ...options,
        portal_url: CONFIGURATIONS.SERVER.API_HOST,
        password: password,
      })
    );

    const passwordHash = password;
    const authenticationInOGPMarket = JSON.stringify({
      email: options.email,
      hash: passwordHash,
    });

    let res = await client
      .query(updatePortalUpdateSettings, [
        authenticationInOGPMarket,
        "authenticationInOGPMarket",
      ])
      .then((e) => e.rows[0]);

    return {};
  }

  public async get_portal_update_settings({
    options: { titles },
    client = db,
  }: method_payload<get_portal_update_settings_payload>) {
    let sql = format(
      "SELECT settings_object FROM portal_update_settings WHERE true \n"
    );

    if (titles && titles.length !== 0) {
      sql += format("AND title IN (");
      sql += titles.map((t) => format("%L", t)).join(",");
      sql += format(")");
    }

    return client.query(sql).then(({ rows }) => {
      const result = {};
      rows.map((i) => Object.assign(result, i.settings_object));
      return result;
    });
  }

  public async get_portal_update_setting({
    options: { title },
    client = db,
  }: method_payload<get_or_delete_portal_update_setting_payload>) {
    return await UpdatePortalServices.getPortalUpdateSetting(title);
  }

  public async runTheUpdateSchedule() {
    let updateSettings = await UpdatePortalServices.getPortalUpdateSetting(
      titleForUpdateSettings
    );
    await this.run_the_update_schedule_from_update_settings(
      updateSettings ? updateSettings.settings_object : null
    );
  }

  private async run_the_update_schedule_from_update_settings(
    updateSchedule: any
  ) {
    let jobUpdateSettings = schedule.scheduledJobs[titleForUpdateSettings];
    if (jobUpdateSettings) jobUpdateSettings.cancel();

    let _schedule = this.getScheduleFromUpdateSettings(updateSchedule);

    if (_schedule) {
      // console.log('Update is scheduled' + JSON.stringify(_schedule));
      schedule.scheduleJob(
        titleForUpdateSettings,
        _schedule,
        async function (fireDate: any) {
          UpdatePortal.update_portal({ options: { version: "last" } });
        }
      );
    }
  }

  private getScheduleFromUpdateSettings(updateSchedule: any) {
    let rule = new schedule.RecurrenceRule();
    rule.tz = CONFIGURATIONS.SERVER.TZ;

    if (!updateSchedule || !("updatedFrequency" in updateSchedule)) return null;

    switch (updateSchedule.updatedFrequency) {
      case "never":
        return null;
      case "every_week":
        rule.dayOfWeek = updateSchedule.updatedDay;
        rule.hour = updateSchedule.updatedTime;
        rule.minute = 0;
        break;
      case "every_month":
        rule.date = 1;
        rule.hour = updateSchedule.updatedTime;
        rule.minute = 0;
        break;
      case "every_year":
        rule.month = 1;
        rule.date = 1;
        rule.hour = updateSchedule.updatedTime;
        rule.minute = 0;
        break;
      default:
        rule.dayOfWeek = 6;
        rule.hour = 0;
        rule.minute = 0;
    }

    return rule;
  }

  public async update_portal_update_schedule({
    options: { updatedFrequency, updatedTime, updatedDay },
    client = db,
  }: method_payload<update_schedule_updated_payload>) {
    const updateUpdateSettings = `UPDATE portal_update_settings
			SET settings_object = $1
			WHERE title = $2
			RETURNING title`;

    let result = await client
      .query(updateUpdateSettings, [
        JSON.stringify({ updatedFrequency, updatedTime, updatedDay }),
        titleForUpdateSettings,
      ])
      .then(({ rows }) => rows[0]);
    // await this.runTheUpdateSchedule();

    this.run_the_update_schedule_from_update_settings({
      updatedFrequency,
      updatedTime,
      updatedDay,
    });

    return result;
  }
}
export const Portal = new Api();
