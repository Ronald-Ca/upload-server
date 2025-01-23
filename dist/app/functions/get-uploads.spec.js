import {
  makeUpload
} from "../../chunk-SYVXZBU5.js";
import {
  getUploads
} from "../../chunk-C53Z4MUI.js";
import "../../chunk-PZ2RNHNC.js";
import "../../chunk-7DLTNFCV.js";
import "../../chunk-F4OS3W64.js";
import "../../chunk-X452J2QD.js";
import {
  isRight,
  unwrapEither
} from "../../chunk-H4LMWBIU.js";
import "../../chunk-MLKGABMK.js";

// src/app/functions/get-uploads.spec.ts
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
describe("get uploads", () => {
  it("should be able to get the uploads", async () => {
    const namePattern = randomUUID();
    const upload1 = await makeUpload({ name: `${namePattern}.webp` });
    const upload2 = await makeUpload({ name: `${namePattern}.webp` });
    const upload3 = await makeUpload({ name: `${namePattern}.webp` });
    const upload4 = await makeUpload({ name: `${namePattern}.webp` });
    const upload5 = await makeUpload({ name: `${namePattern}.webp` });
    const sut = await getUploads({
      searchQuery: namePattern
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id })
    ]);
  });
  it("should be able to get paginated uploads", async () => {
    const namePattern = randomUUID();
    const upload1 = await makeUpload({ name: `${namePattern}.webp` });
    const upload2 = await makeUpload({ name: `${namePattern}.webp` });
    const upload3 = await makeUpload({ name: `${namePattern}.webp` });
    const upload4 = await makeUpload({ name: `${namePattern}.webp` });
    const upload5 = await makeUpload({ name: `${namePattern}.webp` });
    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id })
    ]);
    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id })
    ]);
  });
  it("should be able to get sorted uploads", async () => {
    const namePattern = randomUUID();
    const upload1 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const upload2 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: dayjs().subtract(1, "day").toDate().toISOString()
    });
    const upload3 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: dayjs().subtract(2, "day").toDate().toISOString()
    });
    const upload4 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: dayjs().subtract(3, "day").toDate().toISOString()
    });
    const upload5 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: dayjs().subtract(4, "day").toDate().toISOString()
    });
    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "desc"
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id })
    ]);
    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "asc"
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id })
    ]);
  });
});
