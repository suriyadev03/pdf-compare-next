import { DiffCheckApi } from "@/service/query/endpoints/diffCheckApi";
import { ParsePdfApi } from "@/service/query/endpoints/parsePDFApi";

const middleware = [
    DiffCheckApi.middleware,
    ParsePdfApi.middleware
];

export default middleware;