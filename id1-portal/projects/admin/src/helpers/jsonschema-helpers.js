export function translateUiSchema(ui_schema, translate) {
    const reg = /[^[\]]+(?=])/;
    for (let i in ui_schema) {
        if (typeof ui_schema[i] === "string" && reg.test(ui_schema[i])) {
            ui_schema[i] = translate(ui_schema[i].match(reg)[0]) || ui_schema[i];
        } else if (typeof ui_schema[i] === "object" && ui_schema[i] !== null) {
            ui_schema[i] = translateUiSchema(ui_schema[i], translate);
        }
    }
    return ui_schema;
};
export function translateJsonSchema(json_schema, translate, additionalFields = []) {
    const fields = ['title', ...additionalFields];
    const reg = /[^[\]]+(?=])/;
    for (let i in json_schema) {
        if (typeof json_schema[i] === "string" && fields.includes(i) && reg.test(json_schema[i])) {
            json_schema[i] = translate(json_schema[i].match(reg)[0]) || json_schema[i];
        } else if (typeof json_schema[i] === "object" && json_schema[i] !== null) {
            json_schema[i] = translateJsonSchema(json_schema[i], translate, additionalFields);
        }
    }
    return json_schema;
};