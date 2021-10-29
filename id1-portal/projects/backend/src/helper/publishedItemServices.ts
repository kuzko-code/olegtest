import format from "pg-format";
class Services {
  public async checkIfPublishedFirstTime(
    id: number,
    table: string,
    client: any
  ) {
    const sql = `
			SELECT is_published
			FROM ${table}
			WHERE id = ${id};`;
    let result = (await client.query(sql)).rows[0];

    return result ? result.is_published : false;
  }
}

export const PublishedItemServices = new Services();
