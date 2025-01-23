import {
  schema
} from "./chunk-7DLTNFCV.js";
import {
  env
} from "./chunk-X452J2QD.js";

// src/infra/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var pg = postgres(env.DATABASE_URL);
var db = drizzle(pg, { schema });

export {
  pg,
  db
};
