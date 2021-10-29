import { Groups } from '../../features/groups';
import { Validate } from '../../etc/helpers';
import { Validation } from '../../helper/validationElements';
import {
    create_group_payload,
    get_groups_payload,
    get_group_by_id_payload,
    update_group_payload,
    delete_group_by_id_payload,
    added_user_to_group_payload
} from './types';

export class groups_with_validation {

    @Validate(
        args => args[0],
        {
            group_id: {
                type: "number",
                integer: true
            },
            users_id: {
                type: "array",
                empty: false,
                items: {
                    type: "number",
                    empty: false
                }
            }
        }
    )
    static async added_users_to_group(data: added_user_to_group_payload) {
        if (data.ctx.role === "group_admin") {
            const UserInGroup = await Groups.containsUserInGroup(data.group_id, data.ctx.userId ? parseInt(data.ctx.userId) : 0);
            if (!UserInGroup) throw new Error(`Not have permission to perform this action.`);
        }
        return await Groups.added_users_to_group({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            name: {
                type: "string",
                min: 3,
                max: 100
            },
            permission: {
                type: "array",
                optional: true,
                items: {
                    type: "string",
                    empty: false
                }
            }
        }
    )
    static async create_group(data: create_group_payload) {
        return await Groups.create_group({
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
    static async get_groups(data: get_groups_payload) {
        return await Groups.get_groups({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id,
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
    static async get_group_by_id(data: get_group_by_id_payload) {
        return await Groups.get_group_by_id({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id,
            name: {
                type: "string",
                min: 3,
                max: 100
            },
            permission: {
                type: "array",
                optional: true,
                items: {
                    type: "string",
                    empty: false
                }
            }
        })
    static async update_group(data: update_group_payload) {

        if (data.ctx.role === "group_admin") {
            const UserInGroup = await Groups.containsUserInGroup(data.id, data.ctx.userId ? parseInt(data.ctx.userId) : 0);
            if (!UserInGroup) throw new Error(`Not have permission to perform this action.`);
        }

        return await Groups.update_group({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id
        }
    )
    static async delete_group_by_id(data: delete_group_by_id_payload) {
        return await Groups.delete_group_by_id({
            options: data,
        })
    }
}