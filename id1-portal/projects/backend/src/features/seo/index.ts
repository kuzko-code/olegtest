import { db } from "../../db";
import format, { string } from "pg-format";
import { PluginsInfo } from "../pluginsInfo";

class Api {
  public async get_sitemap({ client = db }) {
    let sql = format(
      "SELECT settings_object FROM public.site_settings where public.site_settings.title='languagesOnThePublicSite'"
    );

    let sqlForNews: any = [];

    let projectsMainXML = "";
    let projectsURL: string[] = [];
    let languages = await client.query(sql);

    languages.rows[0].settings_object.map(async (lng: string) => {
      sqlForNews.push(
        format(
          `SELECT id, language, published_date FROM news where news.is_published = true AND news.language = %L`,
          lng
        )
      );

      let mainUrl = `${process.env.PUBLIC_HOST}/${lng}/`;
      let newsListUrl = `${process.env.PUBLIC_HOST}/${lng}/newslist/`;
      if (projectsURL.indexOf(mainUrl) === -1) {
        projectsURL.push(mainUrl);
      }
      if (projectsURL.indexOf(newsListUrl) === -1) {
        projectsURL.push(newsListUrl);
      }
    });

    let getMainNavisql = format(
      "SELECT settings_object, language FROM public.site_settings where public.site_settings.title='mainNavigation' and public.site_settings.language IN (%L)",
      languages.rows[0].settings_object
    );
    let mainNavigations = await client.query(getMainNavisql);

    mainNavigations.rows.map(async (mainNavigation: any) => {
      mainNavigation.settings_object.map(async (temp: any) => {
        let tempUrl = temp.url;
        let n = tempUrl.indexOf(process.env.PUBLIC_HOST);

        if (n === 0 || tempUrl.startsWith("/")) {
          if (tempUrl.startsWith("/")) {
            tempUrl = process.env.PUBLIC_HOST + tempUrl;
          }

          if (!tempUrl.endsWith("/")) {
            tempUrl = tempUrl + "/";
          }

          if (projectsURL.indexOf(tempUrl) === -1) {
            projectsURL.push(tempUrl);
          }
        }
      });
    });

    let news = await client.query(
      `${sqlForNews.join(
        "\n union \n"
      )} \n ORDER by published_date desc limit 10000`
    );

    news.rows.map(async (newsItem: any) => {
      let tempUrl = `${process.env.PUBLIC_HOST}/${newsItem.language}/news/${newsItem.id}/`;
      if (projectsURL.indexOf(tempUrl) === -1) {
        projectsURL.push(tempUrl);
      }
    });

    let pluginsInfo = await PluginsInfo.get_plugins({ options: {} });

    pluginsInfo.map(async (plugin: any) => {
      if (plugin.publicPages && plugin.publicPages.length > 0) {
        plugin.publicPages.map(async (publicPages: any) => {
          let tempUrl = publicPages.url;
          if (!tempUrl.endsWith("/")) {
            tempUrl = tempUrl + "/";
          }

          if (tempUrl.startsWith("/")) {
            tempUrl = tempUrl.substr(1);
          }

          languages.rows[0].settings_object.map((lng: string) => {
            let url = `${process.env.PUBLIC_HOST}/${lng}/plugins/${plugin.name}/${tempUrl}`;
            if (projectsURL.indexOf(url) === -1) {
              projectsURL.push(url);
            }
          });
        });
      }
    });

    projectsURL.map(async (url: any) => {
      projectsMainXML += `
                <url>
                    <loc>${url}</loc>
                    <priority>1</priority>
                </url>                
            `;
    });

    projectsMainXML += `
            <url>
                <loc>${process.env.PUBLIC_HOST}/NotFound</loc>
                <priority>1</priority>
            </url>                
        `;

    return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              ${projectsMainXML}
            </urlset>`;
  }

  public async get_robotstxt({ client = db }) {
    return `
        User-agent: *
        Allow: /
         
        Host: ${process.env.PUBLIC_HOST}
        Sitemap: ${process.env.PUBLIC_HOST}/sitemap.xml`;
  }
}

export const Seo = new Api();
