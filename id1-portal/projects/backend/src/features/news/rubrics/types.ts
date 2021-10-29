export type create_rubric_payload = {
    title: string,
    language: string
}

export type get_rubrics_payload = {
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

export type get_rubric_by_id_payload = {
    id: number,
    selectedFields: string[]
}

export type update_rubric_payload = {
    id: number,
    title: string,
    language: string
}

export type delete_rubric_by_id_payload = {
    id: number
}