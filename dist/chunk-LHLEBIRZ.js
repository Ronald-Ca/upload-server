import {
  InvalidFileFormat
} from "./chunk-ERKDV6EQ.js";
import {
  uploadFileToStorage
} from "./chunk-ZTADTLS2.js";
import {
  db
} from "./chunk-PZ2RNHNC.js";
import {
  schema
} from "./chunk-7DLTNFCV.js";
import {
  makeLeft,
  makeRight
} from "./chunk-H4LMWBIU.js";

// src/app/functions/upload-image.ts
import { Readable } from "node:stream";
import { z } from "zod";
var uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
});
var allowedMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
async function uploadImage(input) {
  const { contentStream, contentType, fileName } = uploadImageInput.parse(input);
  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormat());
  }
  const { key, url } = await uploadFileToStorage({
    folder: "images",
    fileName,
    contentType,
    contentStream
  });
  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url
  });
  return makeRight({ url });
}

export {
  uploadImage
};
