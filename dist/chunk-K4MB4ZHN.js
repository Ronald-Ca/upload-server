import {
  uploadImage
} from "./chunk-LHLEBIRZ.js";
import {
  isRight,
  unwrapEither
} from "./chunk-H4LMWBIU.js";

// src/infra/http/routes/upload-image.ts
import { z } from "zod";
var uploadImageRoute = async (server) => {
  server.post(
    "/uploads",
    {
      schema: {
        summary: "Upload an image",
        tags: ["uploads"],
        consumes: ["multipart/form-data"],
        response: {
          201: z.null().describe("Image uploaded"),
          400: z.object({ message: z.string() })
        }
      }
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: { fileSize: 1024 * 1024 * 2 }
        // 2MB
      });
      if (!uploadedFile) {
        return reply.status(400).send({ message: "File is required" });
      }
      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file
      });
      if (uploadedFile.file.truncated) {
        return reply.status(400).send({ message: "File size limit reached." });
      }
      if (isRight(result)) {
        return reply.status(201).send();
      }
      const error = unwrapEither(result);
      switch (error.constructor.name) {
        case "InvalidFileFormat":
          return reply.status(400).send({ message: error.message });
      }
    }
  );
};

export {
  uploadImageRoute
};
