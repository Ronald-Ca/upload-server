import {
  uploadFileToStorage
} from "./chunk-ZTADTLS2.js";
import {
  db,
  pg
} from "./chunk-PZ2RNHNC.js";
import {
  schema
} from "./chunk-7DLTNFCV.js";
import {
  makeRight
} from "./chunk-H4LMWBIU.js";

// src/app/functions/export-uploads.ts
import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { stringify } from "csv-stringify";
import { ilike } from "drizzle-orm";
import { z } from "zod";
var exportUploadsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20)
});
async function exportUploads(input) {
  const { searchQuery } = exportUploadsInput.parse(input);
  const { sql, params } = db.select({
    id: schema.uploads.id,
    name: schema.uploads.name,
    remoteUrl: schema.uploads.remoteUrl,
    createdAt: schema.uploads.createdAt
  }).from(schema.uploads).where(
    searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : void 0
  ).toSQL();
  const cursor = pg.unsafe(sql, params).cursor(50);
  const csv = stringify({
    delimiter: ",",
    header: true,
    columns: [
      { key: "id", header: "ID" },
      { key: "name", header: "Name" },
      { key: "remote_url", header: "URL" },
      { key: "created_at", header: "Uploaded At" }
    ]
  });
  const uploadToStorageStream = new PassThrough();
  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks, encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }
        callback();
      }
    }),
    csv,
    uploadToStorageStream
  );
  const uploadToStorage = uploadFileToStorage({
    contentType: "text/csv",
    folder: "downloads",
    fileName: `${(/* @__PURE__ */ new Date()).toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream
  });
  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);
  return makeRight({ reportUrl: url });
}

export {
  exportUploads
};
