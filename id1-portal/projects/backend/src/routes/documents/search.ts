// import { IncomingMessage } from "http";
// import { documents_with_validation } from "../../domains/documents";
// import { MicroController, Catch, Send } from "../../etc/http/micro_controller";
//
// class Controller implements MicroController {
//   path = "/documents/search";
//   priority = 3;
//
//   @Catch
//   @Send(200)
//   async GET(req: IncomingMessage) {
//     const { query } = req;
//
//     const selectedFields = query.fields ? query.fields.split(",") : null;
//
//     const aggregate = {
//       func: query.aggFunc || null,
//       field: query.aggField || null,
//     };
//
//     const filters = {
//       search: query.search || null,
//       searchKeys: query.searchKeys ? query.searchKeys.split(",") : ["title"],
//     };
//
//     let sort = {
//       field: query.sortField || null,
//       direction: query.sortDirection || "asc",
//     };
//
//     let limit = {
//       start: query.start ? parseInt(query.start) : null,
//       count: query.count ? parseInt(query.count) : null,
//     };
//
//     return documents_with_validation.get_documents_search(<any>{
//       selectedFields,
//       aggregate,
//       filters,
//       sort,
//       limit,
//     });
//   }
// }
//
// export = new Controller();
