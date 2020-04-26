import * as dotenv from "dotenv";

const env = dotenv.config();
if (env.error) {
    throw env.error;
}
// console.log("env", env.parsed); // This shows all loaded environment variables

export const port = env.parsed.port || 3000;
export const jwtSecret = env.parsed.jwtSecret;
export const jwtExpire = env.parsed.jwtExpire || "1h";
export const disableSecurity = env.parsed.disableSecurity || "0";
