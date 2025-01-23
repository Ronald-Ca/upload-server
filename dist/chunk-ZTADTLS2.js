import {
  r2
} from "./chunk-GXAWCARI.js";
import {
  env
} from "./chunk-X452J2QD.js";
import {
  __export
} from "./chunk-MLKGABMK.js";

// src/infra/storage/upload-file-to-storage.ts
var upload_file_to_storage_exports = {};
__export(upload_file_to_storage_exports, {
  uploadFileToStorage: () => uploadFileToStorage
});
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import { Readable } from "node:stream";
import { Upload } from "@aws-sdk/lib-storage";
import { z } from "zod";
var uploadFileToStorageInput = z.object({
  folder: z.enum(["images", "downloads"]),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
});
async function uploadFileToStorage(input) {
  const { folder, fileName, contentType, contentStream } = uploadFileToStorageInput.parse(input);
  const fileExtension = extname(fileName);
  const fileNameWithoutExtension = basename(fileName);
  const sanitizedFileName = fileNameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    ""
  );
  const sanitizedFileNameWithExtension = sanitizedFileName.concat(fileExtension);
  const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`;
  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType
    }
  });
  await upload.done();
  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString()
  };
}

export {
  uploadFileToStorage,
  upload_file_to_storage_exports
};
