import { NewsTags } from '../../../features/news/tags';
import {
    create_tag_payload,
    get_tags_payload,
    get_tag_by_id_payload,
    update_tag_payload,
    delete_tag_by_id_payload
} from './types';
import { Validate } from '../../../etc/helpers';
import { Validation } from '../../../helper/validationElements';
import { Users } from '../../../features/users';
import { EXCEPTION_MESSAGES } from '../../../constants'
const Entities = "rubricsAndTags";

export class news_tags_with_validation {
    @Validate(
        args => args[0],
        {
            title: {
                type: "string",
                empty: false
            },
            language: Validation.language,
        }
    )
    static async create_tag(data: create_tag_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
        return await NewsTags.create_tag({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            selectedFields: Validation.selectedFields,
            aggregate: Validation.aggregate,
            filters: {
                type: "object",
                props: {
            search: Validation.search,
                }
            },
            sort: Validation.sort,
            limit: Validation.limit,
            language: Validation.language,
        }
    )
    static async get_tags(data: get_tags_payload) {
        return await NewsTags.get_tags({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id,
            selectedFields: Validation.selectedFields,
            language: Validation.language,
        }
    )
    static async get_tag_by_id(data: get_tag_by_id_payload) {
        return await NewsTags.get_tag_by_id({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id,
            title: {
                type: "string",
                empty: false
            }
            // ,
            // language: {
            //     type: "string",
            //     optional: true
            // }
        }
    )
    static async update_tag(data: update_tag_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
        return await NewsTags.update_tag({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id
        }
    )
    static async delete_tag_by_id(data: delete_tag_by_id_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
        return await NewsTags.delete_tag_by_id({
            options: data,
        })
    }
}