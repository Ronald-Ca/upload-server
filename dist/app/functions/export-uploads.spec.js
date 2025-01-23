import {
  exportUploads
} from "../../chunk-76CKMNK6.js";
import {
  makeUpload
} from "../../chunk-SYVXZBU5.js";
import {
  upload_file_to_storage_exports
} from "../../chunk-ZTADTLS2.js";
import "../../chunk-GXAWCARI.js";
import "../../chunk-PZ2RNHNC.js";
import "../../chunk-7DLTNFCV.js";
import "../../chunk-F4OS3W64.js";
import "../../chunk-X452J2QD.js";
import {
  isRight,
  unwrapEither
} from "../../chunk-H4LMWBIU.js";
import "../../chunk-MLKGABMK.js";

// src/app/functions/export-uploads.spec.ts
import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
describe("export uploads", () => {
  it("should be able to export uploads", async () => {
    const uploadStub = vi.spyOn(upload_file_to_storage_exports, "uploadFileToStorage").mockImplementationOnce(async () => {
      return {
        key: `${randomUUID()}.csv`,
        url: "http://example.com/file.csv"
      };
    });
    const namePattern = randomUUID();
    const upload1 = await makeUpload({ name: `${namePattern}.webp` });
    const upload2 = await makeUpload({ name: `${namePattern}.webp` });
    const upload3 = await makeUpload({ name: `${namePattern}.webp` });
    const upload4 = await makeUpload({ name: `${namePattern}.webp` });
    const upload5 = await makeUpload({ name: `${namePattern}.webp` });
    const sut = await exportUploads({
      searchQuery: namePattern
    });
    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;
    const csvAsString = await new Promise((resolve, reject) => {
      const chunks = [];
      generatedCSVStream.on("data", (chunk) => {
        chunks.push(chunk);
      });
      generatedCSVStream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });
      generatedCSVStream.on("error", (err) => {
        reject(err);
      });
    });
    const csvAsArray = csvAsString.trim().split("\n").map((row) => row.split(","));
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).reportUrl).toBe("http://example.com/file.csv");
    expect(csvAsArray).toEqual([
      ["ID", "Name", "URL", "Uploaded At"],
      [upload1.id, upload1.name, upload1.remoteUrl, expect.any(String)],
      [upload2.id, upload2.name, upload2.remoteUrl, expect.any(String)],
      [upload3.id, upload3.name, upload3.remoteUrl, expect.any(String)],
      [upload4.id, upload4.name, upload4.remoteUrl, expect.any(String)],
      [upload5.id, upload5.name, upload5.remoteUrl, expect.any(String)]
    ]);
  });
});
