import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env" });

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().optional().default("5000"),

  MONGO_URI: z.string().nonempty(),

  JWT_SECRET: z.string().nonempty(),
  JWT_EXPIRES_IN: z.string().optional().default("1d"),
  REFRESH_SECRET: z.string().nonempty(),
  REFRESH_EXPIRES_IN: z.string().optional().default("7d"),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  CLIENT_URL: z.string().optional().default("http://localhost:3000"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
