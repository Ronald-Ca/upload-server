// src/infra/http/transform-swagger-schema.ts
import { jsonSchemaTransform } from "fastify-type-provider-zod";
function transformSwaggerSchema(data) {
  const { schema, url } = jsonSchemaTransform(data);
  if (schema.consumes?.includes("multipart/form-data")) {
    schema.body = schema.body || {
      type: "object",
      required: [],
      properties: {}
    };
    schema.body.properties.file = {
      type: "string",
      format: "binary"
    };
    if (!schema.body.required.includes("file")) {
      schema.body.required.push("file");
    }
  }
  return { schema, url };
}

export {
  transformSwaggerSchema
};
