import {
  db
} from "./chunk-PZ2RNHNC.js";
import {
  schema
} from "./chunk-7DLTNFCV.js";
import {
  makeRight
} from "./chunk-H4LMWBIU.js";

// src/app/functions/get-uploads.ts
import { asc, count, desc, ilike } from "drizzle-orm";
import { z } from "zod";
var getUploadsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20)
});
async function getUploads(input) {
  const { page, pageSize, searchQuery, sortBy, sortDirection } = getUploadsInput.parse(input);
  const [uploads, [{ total }]] = await Promise.all([
    db.select({
      id: schema.uploads.id,
      name: schema.uploads.name,
      remoteKey: schema.uploads.remoteKey,
      remoteUrl: schema.uploads.remoteUrl,
      createdAt: schema.uploads.createdAt
    }).from(schema.uploads).where(
      searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : void 0
    ).orderBy((fields) => {
      if (sortBy && sortDirection === "asc") {
        return asc(fields[sortBy]);
      }
      if (sortBy && sortDirection === "desc") {
        return desc(fields[sortBy]);
      }
      return desc(fields.id);
    }).offset((page - 1) * pageSize).limit(pageSize),
    db.select({ total: count(schema.uploads.id) }).from(schema.uploads).where(
      searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : void 0
    )
  ]);
  const uploadsWithDates = uploads.map((upload) => ({
    ...upload,
    createdAt: new Date(upload.createdAt)
  }));
  return makeRight({ uploads: uploadsWithDates, total });
}

export {
  getUploads
};
