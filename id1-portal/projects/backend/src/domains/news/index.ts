import { News } from '../../features/news';
import { Validate } from '../../etc/helpers';
import { Validation } from '../../helper/validationElements';
import {
    create_news_payload,
    get_news_payload,
    get_news_by_id_payload,
    update_news_payload,
    delete_news_by_id_payload,
    get_tags_rating_payload,
    add_view_to_news,
    get_news_by_rubric_payload
} from './types';
import { Users } from '../../features/users';
import { EXCEPTION_MESSAGES } from '../../constants'
const Entities = "allNews";

export class news_with_validation {
    @Validate(
        args => args[0],
        {
            title: {
                type: "string",
                min: 3
            },
            main_picture: {
                type: "string"
            },
            description: {
                type: "string"
            },
            content: {
                type: "string"
            },
            rubric_id: {
                type: "number",
                optional: true,
                integer: true
            },
            tags: {
                type: "array",
                items: {
                    type: "string",
                    empty: false
                }
            },
            is_published: {
                type: "boolean"
            },
            attachments: {
                type: "array",
                optional: true,
                items: {
                    type: "object",
                    props: {
                        id: {
                            type: "uuid"
                        },
                        is_active: {
                            type: "boolean"
                        }
                    },
                }
            },
            language: Validation.language,
            published_date: {
                type: "date",
                convert: true,
                optional: true
            },
            images: {
                optional: true,
                type: "array",
                max: 15,
                items: {
                    type: "string",
                    empty: false
                }
            },
            facebook_enable: { type: 'boolean' }
        }
    )
    static async create_news(data: create_news_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);

        return await News.create_news({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            selectedFields: Validation.selectedFields,
            includedResources: Validation.includedResources,
            aggregate: Validation.aggregate,
            filters: {
                type: "object",
                props: {
                    ids: {
                        type: "array",
                        optional: true,
                        empty: false,
                        items: {
                            type: "number",
                            integer: true,
                            positive: true
                        }
                    },
                    search: Validation.search,
                    searchKeys: Validation.searchKeys,
                    rubrics: {
                        type: "array",
                        optional: true,
                        empty: false,
                        items: {
                            type: "number",
                            integer: true
                        }
                    },
                    tags: {
                        type: "array",
                        optional: true,
                        empty: false,
                        items: {
                            type: "string",
                            empty: false
                        }
                    },
                    from: {
                        type: "date",
                        optional: true
                    },
                    to: {
                        type: "date",
                        optional: true
                    },
                    isPublished: {
                        type: "boolean",
                        optional: true
                    }
                }
            },
            sort: Validation.sort,
            limit: Validation.limit,
            language: Validation.language,
        }
    )
    static async get_news(data: get_news_payload) {
        return await News.get_news({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            selectedFields: Validation.selectedFields,
            rubrics: {
                type: "array",
                empty: false,
                items: {
                    type: "number",
                    integer: true
                }
            },
            filters: {
                type: "object",
                props: {
                    from: {
                        type: "date",
                        optional: true
                    },
                    to: {
                        type: "date",
                        optional: true
                    },
                    isPublished: {
                        type: "boolean",
                        optional: true
                    }
                }
            },
            sort: Validation.sort,
            limit: {
                type: "object",
                props: {
                    count: {
                        type: "number",
                        optional: true,
                        integer: true,
                        min: 1
                    }
                }
            },
            language: Validation.language,
        }
    )
    static async get_news_by_rubrics(data: get_news_by_rubric_payload) {
        return await News.get_news_by_rubrics({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id,
            selectedFields: Validation.selectedFields,
            includedResources: Validation.includedResources,
            language: Validation.language,
        }
    )
    static async get_news_by_id(data: get_news_by_id_payload) {        
        return await News.get_news_by_id({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id,
            title: {
                type: "string",
                min: 3
            },
            main_picture: {
                type: "string"
            },
            description: {
                type: "string"
            },
            content: {
                type: "string"
            },
            rubric_id: {
                type: "number",
                optional: true,
                integer: true
            },
            tags: {
                type: "array",
                items: {
                    type: "string",
                    empty: false
                }
            },
            is_published: {
                type: "boolean"
            },
            attachments: {
                type: "array",
                optional: true,
                items: {
                    type: "object",
                    props: {
                        id: {
                            type: "uuid"
                        },
                        is_active: {
                            type: "boolean"
                        }
                    },
                }
            },
            language: Validation.language,
            published_date: {
                type: "date",
                convert: true,
                optional: true
            },
            images: {
                optional: true,
                type: "array",
                max: 15,
                items: {
                    type: "string",
                    empty: false
                }
            },
            facebook_enable: { type: 'boolean' }
        }
    )
    static async update_news(data: update_news_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
        return await News.update_news({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id
        }
    )
    static async delete_news_by_id(data: delete_news_by_id_payload) {
        await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
        return await News.delete_news_by_id({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
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
                    // ,
                    // language: {
                    //     type: "string",
                    //     optional: true
                    // }
                }
            }
        }
    )
    static async get_tags_rating(data: get_tags_rating_payload) {
        return await News.get_tags_rating({
            options: data,
        })
    }

    @Validate(
        args => args[0],
        {
            id: Validation.id
        }
    )
    static async add_view(data: add_view_to_news) {
        return await News.add_view({
            options: data,
        })
    }
}
