import {
  uploadImage
} from "../../chunk-LHLEBIRZ.js";
import {
  InvalidFileFormat
} from "../../chunk-ERKDV6EQ.js";
import "../../chunk-ZTADTLS2.js";
import "../../chunk-GXAWCARI.js";
import {
  db
} from "../../chunk-PZ2RNHNC.js";
import {
  schema
} from "../../chunk-7DLTNFCV.js";
import "../../chunk-F4OS3W64.js";
import "../../chunk-X452J2QD.js";
import {
  isLeft,
  isRight,
  unwrapEither
} from "../../chunk-H4LMWBIU.js";
import "../../chunk-MLKGABMK.js";

// src/app/functions/upload-image.spec.ts
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";
describe("upload image", () => {
  beforeAll(() => {
    vi.mock("@/infra/storage/upload-file-to-storage", () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: "https://storage.com/image.jpg"
          };
        })
      };
    });
  });
  it("should be able to upload an image", async () => {
    const fileName = `${randomUUID()}.jpg`;
    const sut = await uploadImage({
      fileName,
      contentType: "image/jpg",
      contentStream: Readable.from([])
    });
    expect(isRight(sut)).toBe(true);
    const result = await db.select().from(schema.uploads).where(eq(schema.uploads.name, fileName));
    expect(result).toHaveLength(1);
  });
  it("should be able to upload an invalid file", async () => {
    const fileName = `${randomUUID()}.pdf`;
    const sut = await uploadImage({
      fileName,
      contentType: "document/pdf",
      contentStream: Readable.from([])
    });
    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat);
  });
});
