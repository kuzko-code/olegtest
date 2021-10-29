import { ApiLanguages } from '../../features/language';
import { Validate } from '../../etc/helpers';
import { Validation } from '../../helper/validationElements';
import {
    get_languages_payload,
    get_site_language_payload
} from './types';

export class languages_with_validation {     

    @Validate(
        args => args[0],
        {
            cutbacks: {
                type: "array",
                optional: true,
                empty: false,
                items: {
                    type: "string",
                    empty: false
                }
            },
            selectedFields: Validation.selectedFields,
            aggregate: Validation.aggregate,
            filters: {
                type: "object",
                props: {
                    search: {
                        type: "string",
                        optional: true,
                        empty: false
                    },
                }
            },
            sort: Validation.sort,
            limit: {
                type: "object",
                props: {
                    start: {
                        type: "number",
                        optional: true,
                        integer: true
                    },
                    count: {
                        type: "number",
                        optional: true,
                        integer: true,
                        min: 1
                    }
                }
            }
        }
    )
    static async get_languages(data: get_languages_payload) {
        return await ApiLanguages.get_languages({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            portal: {
                type: "string",
                empty: false
            }
        }
    )
    static async get_site_language(data: get_site_language_payload) {
        return await ApiLanguages.get_site_language({
            options: data,
        })
    }
}