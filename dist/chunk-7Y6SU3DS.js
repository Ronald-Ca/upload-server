import {
  getUploads
} from "./chunk-C53Z4MUI.js";
import {
  unwrapEither
} from "./chunk-H4LMWBIU.js";

// src/infra/http/routes/get-uploads.ts
import { z } from "zod";
var getUploadsRoute = async (server) => {
  server.get(
    "/uploads",
    {
      schema: {
        summary: "Get uploads",
        tags: ["uploads"],
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(["createdAt"]).optional(),
          sortDirection: z.enum(["asc", "desc"]).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20)
        }),
        response: {
          200: z.object({
            uploads: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                remoteKey: z.string(),
                remoteUrl: z.string(),
                createdAt: z.any()
              })
            ),
            total: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { page, pageSize, searchQuery, sortBy, sortDirection } = request.query;
      const result = await getUploads({
        page,
        pageSize,
        searchQuery,
        sortBy,
        sortDirection
      });
      const { total, uploads } = unwrapEither(result);
      return reply.status(200).send({ total, uploads });
    }
  );
};

export {
  getUploadsRoute
};