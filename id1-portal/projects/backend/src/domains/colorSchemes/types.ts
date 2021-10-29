import { handler_context } from "../../etc/http/micro_controller";

export type create_color_scheme_payload = {
    color_scheme: string,
    ctx: handler_context
}

export type get_color_schemes_payload = {
    selectedFields: string[],
    aggregate: {
        func: string,
        field: string
    },
    sort: {
        field: string,
        direction: string
    },
    limit: {
        start: number,
        count: number,
    }
}

export type get_color_scheme_by_id_payload = {
    id: number,
    selectedFields: string[]
}

export type update_color_scheme_payload = {
    id: number,
    color_scheme: string,
    ctx: handler_context
}

export type delete_color_scheme_by_id_payload = {
    id: number,
    ctx: handler_context
}