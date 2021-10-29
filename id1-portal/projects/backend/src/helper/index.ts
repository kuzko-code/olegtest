import format from "pg-format";
class Services {
  public roundTime = (time: Date) => {
    if (time.getMinutes() != 0) time.setHours(time.getHours() + 1);
    time.setSeconds(0);
    time.setMinutes(0);
    return time;
  };

  public getPublishDate = (
    published_date: Date,
    nowDate: Date,
    is_published: boolean
  ) => {
    const temp = published_date && new Date(published_date) >= nowDate;
    const isPublished = is_published == true && temp ? false : is_published;

    const publishedDate = isPublished
      ? published_date || new Date(nowDate)
      : temp
      ? this.roundTime(new Date(published_date))
      : published_date;

    return {
      published_date: publishedDate,
      is_published: isPublished,
    };
  };

  public selectedFields(selectedFields: string[], table: string) {
    return selectedFields
      ? selectedFields.map((f: string) => format(`${table}.%I`, f)).join()
      : `${table}.*`;
  }

  public add_status_to_sql_query = (alias: string) => {
    return `CASE WHEN ${alias}.is_published=true THEN 'published'
        WHEN ${alias}.published_date > (select current_date)::date + (current_time)::time THEN 'planned'
        ELSE 'draft' 
        end as status`;
  };

  public add_search_to_sql_query = (
    search: string,
    searchKeys: string[],
    table: string
  ) => {
    let res = search.split(" ").filter((item) => item != "");

    let sqlForTitle: string[] = [];
    let i = 0;
    for (i = 0; i < res.length; i++) {
      searchKeys.forEach((key) => {
        sqlForTitle.push(
          format(`(${table}."%I"::TEXT ILIKE %L)`, key, "%%%" + res[i] + "%%") +
            "\n"
        );
      });
    }
    return sqlForTitle.length > 0
      ? "AND(" + sqlForTitle.join("OR") + ")" + "\n"
      : "";
  };

  public get_attachment_id_by_url(files: string[]) {
    const regexGetAttachmentIDByUrl = /attachments\/(.*?)\_/;
    const uuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let attachmentIds: string[] = [];
    files = files.filter((file) => file);
    files.map((file: string) => {
      let tempId = file.match(regexGetAttachmentIDByUrl);
      if (tempId && tempId[1] && uuid.test(tempId[1])) {
        attachmentIds.push(tempId[1]);
      }
    });
    return attachmentIds;
  }

  public parseBoolean(str: string): boolean | number {
    str = str.toLowerCase();
    if (str === "true") return true;
    else if (str === "false") return false;
    else return NaN;
  }

  public async recaptchaSiteVerify(token: string) {
    const fetch = require("node-fetch");
    try {
      let result = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY_RECAPTCHA}&response=${token}`
      ).then(function (response: any) {
        return response.json();
      });

      if (result.success == true) return true;
    } catch (error) {}
    throw new Error("Recaptcha validation failed");
  }

  public selectedFieldsForPublishedContent(
    selectedFields: string[],
    ifUserHavePermission: boolean,
    allowedFields: string[]
  ) {
    if (!ifUserHavePermission)
      selectedFields = this.getCommonFields(selectedFields, allowedFields);
    return selectedFields;
  }

  public getCommonFields(selectedFields: string[], allowedFields: string[]) {
    return selectedFields && selectedFields.length > 0
      ? this.getCommonItems(selectedFields, allowedFields)
      : allowedFields;
  }

  private getCommonItems(selectedFields: string[], allowedFields: string[]) {
    let common = [];
    for (let i = 0; i < selectedFields.length; ++i) {
      for (let j = 0; j < allowedFields.length; ++j) {
        if (selectedFields[i] == allowedFields[j]) {
          common.push(selectedFields[i]);
        }
      }
    }
    return common;
  }
}

export const Helper = new Services();
