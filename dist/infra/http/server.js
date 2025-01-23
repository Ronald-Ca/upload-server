import {
  exportUploadsRoute
} from "../../chunk-G7L3I4RR.js";
import {
  getUploadsRoute
} from "../../chunk-7Y6SU3DS.js";
import {
  uploadImageRoute
} from "../../chunk-K4MB4ZHN.js";
import {
  transformSwaggerSchema
} from "../../chunk-QAJKDOA2.js";
import "../../chunk-76CKMNK6.js";
import "../../chunk-C53Z4MUI.js";
import "../../chunk-LHLEBIRZ.js";
import "../../chunk-ERKDV6EQ.js";
import "../../chunk-ZTADTLS2.js";
import "../../chunk-GXAWCARI.js";
import "../../chunk-PZ2RNHNC.js";
import "../../chunk-7DLTNFCV.js";
import "../../chunk-F4OS3W64.js";
import "../../chunk-X452J2QD.js";
import "../../chunk-H4LMWBIU.js";
import "../../chunk-MLKGABMK.js";

// src/infra/http/server.ts
import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
var server = fastify();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation errpr.",
      issues: error.validation
    });
  }
  console.error(error);
  return reply.status(500).send({
    message: "Internal server error."
  });
});
server.register(fastifyCors, { origin: "*" });
server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Upload Server",
      version: "1.0.0"
    }
  },
  transform: transformSwaggerSchema
});
server.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
server.register(uploadImageRoute);
server.register(getUploadsRoute);
server.register(exportUploadsRoute);
server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server is running on port 3333");
});
