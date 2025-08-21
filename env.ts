import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .url()
      .default("https://pingdigital.online"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});

// export const env = createEnv({
//   server: {
//     SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
//   },
//   client: {
//     NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
//     NEXT_PUBLIC_BASE_URL: z.string().url(),
//   },
//   runtimeEnv: {
//     NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
//   },
//   emptyStringAsUndefined: true,
// });
