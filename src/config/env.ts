/**
 * Environment variable configuration
 * Centralizes access to environment variables with type safety
 */

interface Env {
  API_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
}

/**
 * Typed environment variables
 */
export const env: Env = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
};

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const required: (keyof Env)[] = ["API_URL"];

  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
