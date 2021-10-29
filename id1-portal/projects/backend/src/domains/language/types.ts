export type get_languages_payload = {
    selectedFields: string[],
    aggregate: {
        func: string,
        field: string
    },
    filters: {
        cutbacks: string[],
        search: string
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

export type get_site_language_payload = {
    portal: string,
}