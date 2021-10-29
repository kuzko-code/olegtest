import { db } from '../../../db'
import format from 'pg-format'
import { method_payload } from '../../base_api_image'
import { get_versions, create_version_payload } from './types'
import { apiServices } from '../../../helper/apiServices'
import { Messages } from '../../messages'
import { UpdatePortalServices } from '../../../helper/updatePortal'
class Api {
  public async get_list_version({
    options,
    client = db,
  }: method_payload<get_versions>) {
    let OGPMarketUrl = await UpdatePortalServices.getOGPMarketUrl()
    options.query.fields = 'version,created_date,description'

    let listOfVersions = await apiServices.getDataFromExternalResource(
      OGPMarketUrl,
      options.url,
      options.query,
      'GET',
      null,
    )
    let result: any[] = []

    if (listOfVersions && listOfVersions.length) {
      let versions = listOfVersions.map((f: any) => f.version)
      const getHistoryUpdate = format(
        `select * from portal_versions where version in (%L)`,
        versions,
      )
      let historyUpdateVersions = await client
        .query(getHistoryUpdate)
        .then((res) => res.rows)

      await listOfVersions.map((version: any) => {
        let temp = historyUpdateVersions.find(
          (historyUpdateVersion: any) =>
            historyUpdateVersion.version == version.version,
        )
        if (!temp) {
          temp = { status: 'notInstalled', update_date: '' }
        }
        result.push(Object.assign(version, temp))
      })
      return result
    }

    return listOfVersions
  }

  public async versionSynchronization(
    OGPMarketUrl: string,
    currentVersion: string,
    previewVersions: string,
    update_date: Date,
    client = db,
  ) {
    let options = {
      nextVersions: currentVersion,
      previewVersions: previewVersions,
    }

    let listOfVersions = await apiServices.getDataFromExternalResource(
      OGPMarketUrl,
      '/portalVersion',
      options,
      'GET',
      null,
    )

    if (listOfVersions.length > 0) {
      const portalUpdateHistory = format(
        `INSERT INTO public.portal_versions ("version", update_date, status) VALUES %s`,

        listOfVersions
          .map((i: any) =>
            format(`('%s', %L, 'updated')`, i.version, update_date),
          )
          .join(','),
      )

      await client.query(portalUpdateHistory)
    }
    return listOfVersions
  }

  public async get_version_by_id({
    options,
    client = db,
  }: method_payload<get_versions>) {
    let OGPMarketUrl = await UpdatePortalServices.getOGPMarketUrl()

    let listOfVersion = await apiServices.getDataFromExternalResource(
      OGPMarketUrl,
      options.url,
      options.query,
      'GET',
      null,
    )

    return listOfVersion
  }
}

export const Version = new Api()
