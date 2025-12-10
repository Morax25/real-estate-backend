import type { CorsOptions } from "cors";
import { env } from "./env.js";

export const corsConfig: CorsOptions = {
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
