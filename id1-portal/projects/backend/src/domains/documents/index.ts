// import { Validate } from "../../etc/helpers";
// import { Validation } from "../../helper/validationElements";
// import {
//   get_documents_payload,
//   update_documents_payload,
//   save_document_payload,
//   delete_document_by_id_payload,
//   get_document_by_id_payload,
// } from "./types";
// import { Documents } from "../../features/documents";
// import { attachments } from "../../features/attachments";
// import { Users } from "../../features/users";
// const Entities = "documents";
//
// export class documents_with_validation {
//   @Validate((args) => args[0], {
//     userId: Validation.id,
//     content: {
//       type: "array",
//       empty: false,
//       items: {
//         type: "string",
//       },
//     },
//   })
//   static async save_document(data: save_document_payload) {
//     await Users.checkIfUserHavePermissionToAccess(
//       parseInt(data.ctx.userId!),
//       Entities,
//       data.ctx.role!
//     );
//     return await attachments.save_attachment({
//       options: data,
//     });
//   }
//
//   @Validate((args) => args[0], {
//     id: {
//       type: "uuid",
//       empty: false,
//     },
//     storage_key: {
//       type: "string",
//       empty: false,
//     },
//     content: {
//       type: "array",
//       empty: false,
//       items: {
//         type: "string",
//       },
//     },
//   })
//   static async update_document(data: update_documents_payload) {
//     await Users.checkIfUserHavePermissionToAccess(
//       parseInt(data.ctx.userId!),
//       Entities,
//       data.ctx.role!
//     );
//     return await Documents.update_document({
//       options: data,
//     });
//   }
//
//   @Validate((args) => args[0], {
//     id: {
//       type: "uuid",
//       empty: false,
//     },
//   })
//   static async delete_document_by_id(data: delete_document_by_id_payload) {
//     await Users.checkIfUserHavePermissionToAccess(
//       parseInt(data.ctx.userId!),
//       Entities,
//       data.ctx.role!
//     );
//     return await attachments.delete_attachment_by_id({
//       options: data,
//     });
//   }
//
//   @Validate((args) => args[0], {
//     filters: {
//       type: "object",
//       props: {
//         search: Validation.search,
//         searchKeys: Validation.searchKeys,
//       },
//     },
//     selectedFields: Validation.selectedFields,
//     aggregate: Validation.aggregate,
//     sort: Validation.sort,
//     limit: Validation.limit,
//   })
//   static async get_documents(data: get_documents_payload) {
//     return await Documents.get_documents({ options: data });
//   }
//
//   @Validate((args) => args[0], {
//     filters: {
//       type: "object",
//       props: {
//         search: Validation.search,
//         searchKeys: Validation.searchKeys,
//       },
//     },
//     selectedFields: Validation.selectedFields,
//     aggregate: Validation.aggregate,
//     sort: Validation.sort,
//     limit: Validation.limit,
//   })
//   static async get_documents_search(data: get_documents_payload) {
//     return await Documents.get_documents_search({ options: data });
//   }
//
//   @Validate((args) => args[0], {
//     id: {
//       type: "uuid",
//     },
//     selectedFields: Validation.selectedFields,
//   })
//   static async get_document_by_id(data: get_document_by_id_payload) {
//     return await attachments.get_attachment_by_id({ options: data });
//   }
// }
