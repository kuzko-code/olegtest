import { PluginsInfo } from '../../features/pluginsInfo';
import { Validate } from '../../etc/helpers';
import {
    get_plugins_payload,
    get_plugin_by_name_payload,
    delete_plugin_by_name_payload,
    install_plugins_payload,
    activate_plugin_payload
} from './types';

export class plugins_info_with_validation {

    static async get_plugins(data: get_plugins_payload) {
        return await PluginsInfo.get_plugins({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            name: {
                type: "string",
                empty: false
            }
        }
    )
    static async get_plugin_by_name(data: get_plugin_by_name_payload) {
        return await PluginsInfo.get_plugin_by_name({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            name: {
                type: "string",
                empty: false
            }
        }
    )
    static async delete_plugin_by_name(data: delete_plugin_by_name_payload) {
        return await PluginsInfo.delete_plugin_by_name({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            bodyFile: {
                type: "any"               
            }
        }
    )
    static async install_plugin(data: install_plugins_payload) {
        return await PluginsInfo.install_plugin({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            name: {
                type: "string",
                empty: false
            },
            activate: {
                type: "boolean",
                empty: false
            }
        }
    )
    static async activate_plugin(data: activate_plugin_payload) {
        return await PluginsInfo.activate_plugin({
            options: data,
        })
    }

}
