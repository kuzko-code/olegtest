import { IncomingMessage } from 'http';

export type attachment_payload = {
    id: string,
    filename: string,
    owner_id: number,
    mimetype: string,
    source_url: string
}

export type save_attachment_payload = {
    bodyFile: any,
    userId: number,
    imgWidth: number,
    imgHeight: number,
    imgQuality: number,
}

export type get_attachments_payload = {
    selectedFields: string[],
    aggregate: {
        func: string,
        field: string
    },
    filters: {
        search: string,
        author: number
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

export type get_attachment_by_id_payload = {
    id: string,
    selectedFields: string[]
}

export type delete_attachment_by_id_payload = {
    id: string
}

export type delete_attachments_by_ids_payload = {
    ids: string[]
}
