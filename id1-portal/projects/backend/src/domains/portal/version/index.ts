import { Validate } from '../../../etc/helpers'
import { Version } from '../../../features/portal/version'
import { Validation } from '../../../helper/validationElements'
import { get_versions } from './types'

export class portal_version_settings_with_validation {
  @Validate((args) => args[0], {})
  static async get_list_version(data: get_versions) {
    return await Version.get_list_version({ options: data })
  }

  @Validate((args) => args[0], {
    url: {
      type: 'string',
      empty: false,
    },
    query: {
      type: 'object',
    },
    includedResources: Validation.includedResources,
  })
  static async get_version_by_id(data: get_versions) {
    return await Version.get_version_by_id({ options: data })
  }
}
