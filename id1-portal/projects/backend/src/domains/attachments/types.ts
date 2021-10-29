import { IncomingMessage } from 'http';

export type attachment_payload = {
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
