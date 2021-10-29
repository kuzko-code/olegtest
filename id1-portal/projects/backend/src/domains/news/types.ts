import { handler_context } from "../../etc/http/micro_controller";
export type create_news_payload = {
    title: string,
    main_picture: string,
    description: string,
    content: string,
    rubric_id: number,
    tags: string[],
    is_published: boolean,
    attachments: any[],
    images: string[],
    language: string,
    published_date: Date,
    facebook_enable: boolean,
    ctx: handler_context,
}

export type get_news_payload = {
    selectedFields: string[],
    includedResources: string[],
    aggregate: {
        func: string,
        field: string
    },
    filters: {
        ids: number[],
        search: string,
        searchKeys: string[],
        rubrics: number[],
        tags: string[],
        from: Date,
        to: Date,
        isPublished: boolean
    },
    sort: {
        field: string,
        direction: string
    },
    limit: {
        start: number,
        count: number,
    },
    language: string
}


export type get_news_by_rubric_payload = {
    selectedFields: string[],
    rubrics: number[],
    filters: {
        from: Date,
        to: Date,
        isPublished: boolean
    },
    sort: {
        field: string,
        direction: string
    },
    limit: {
        count: number
    },
    language: string
}

export type get_news_by_id_payload = {
    id: number,
    selectedFields: string[],
    includedResources: string[]
}

export type update_news_payload = {
    id: number,
    title: string,
    main_picture: string,
    description: string,
    content: string,
    rubric_id: number,
    tags: string[],
    is_published: boolean,
    attachments: any[],
    images: string[],
    language: string,
    published_date: Date,
    facebook_enable: boolean,
    ctx: handler_context,
}

export type delete_news_by_id_payload = {
    id: number,
    ctx: handler_context
}

export type get_tags_rating_payload = {
    limit: {
        start: number,
        count: number,
    },
    language: string
}

export type add_view_to_news = {
    id: number
}