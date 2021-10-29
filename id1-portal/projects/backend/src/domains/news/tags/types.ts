import { handler_context } from "../../../etc/http/micro_controller";

export type create_tag_payload = {
    title: string,
    language: string,
    ctx: handler_context
}

export type get_tags_payload = {
    selectedFields: string[],
    aggregate: {
        func: string,
        field: string
    },
    filters: {
        search: string
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

export type get_tag_by_id_payload = {
    id: number,
    selectedFields: string[]
    // ,
    // language: string
}

export type update_tag_payload = {
    id: number,
    title: string,
    language: string,
    ctx: handler_context
}

export type delete_tag_by_id_payload = {
    id: number,
    ctx: handler_context
}