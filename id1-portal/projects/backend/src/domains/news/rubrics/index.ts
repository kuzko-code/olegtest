import { NewsRubrics } from '../../../features/news/rubrics';
import { Validate } from '../../../etc/helpers';
import { Validation } from '../../../helper/validationElements';
import {
    create_rubric_payload,
    get_rubrics_payload,
    get_rubric_by_id_payload,
    update_rubric_payload,
    delete_rubric_by_id_payload
} from './types';
import { Users } from '../../../features/users';
import { EXCEPTION_MESSAGES } from '../../../constants'
const Entities = "rubricsAndTags";

export class news_rubrics_with_validation {

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
    static async create_rubric(data: create_rubric_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
        return await NewsRubrics.create_rubric({
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
    static async get_rubrics(data: get_rubrics_payload) {
        return await NewsRubrics.get_rubrics({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id,
            // language: {
            //     type: "string",
            //     optional: true
            // },
            selectedFields: {
                type: "array",
                optional: true,
                empty: false,
                items: {
                    type: "string",
                    empty: false
                }
            }
        }
    )
    static async get_rubric_by_id(data: get_rubric_by_id_payload) {
        return await NewsRubrics.get_rubric_by_id({
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
            },
            language: Validation.language,
        }
    )
    static async update_rubric(data: update_rubric_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
        return await NewsRubrics.update_rubric({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id
        }
    )
    static async delete_rubric_by_id(data: delete_rubric_by_id_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
        return await NewsRubrics.delete_rubric_by_id({
            options: data,
        })
    }
}