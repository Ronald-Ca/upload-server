import {
  db
} from "./chunk-PZ2RNHNC.js";
import {
  schema
} from "./chunk-7DLTNFCV.js";

// src/test/factories/make-upload.ts
import { fakerPT_BR as faker } from "@faker-js/faker";
async function makeUpload(overrides) {
  const fileName = faker.system.fileName();
  const result = await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: `images/${fileName}`,
    remoteUrl: `https://example.com/images/${fileName}`,
    ...overrides
  }).returning();
  return result[0];
}

export {
  makeUpload
};
