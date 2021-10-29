import { IncomingMessage, ServerResponse } from 'http'
import {
  MicroController,
  handler_context,
  Catch,
  Send,
  DecodeAccessToken,
  Decoder,
  ParseBody,
  AcceptACL,
} from '../../../etc/http/micro_controller'

import { verifyToken } from '../../../handlers/jwt'

import { portal_version_settings_with_validation } from '../../../domains/portal/version'

class Controller implements MicroController {
  path = '/portal/version/:version'

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL(['root_admin', 'global_admin'])
  async GET(req: IncomingMessage, res: ServerResponse) {
    const query = req.query
    const includedResources = query.include ? query.include.split(',') : null

    return portal_version_settings_with_validation.get_version_by_id({
      url: `/PortalVersion/${req.params.version}`,
      query: query,
      includedResources,
    })
  }
}
export = new Controller()
