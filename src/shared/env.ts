import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { registerOTel } from "@vercel/otel";

config();

const LOCAL_ENV_PATH = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(LOCAL_ENV_PATH)) {
  config({ path: LOCAL_ENV_PATH, override: true });
}

registerOTel({
  serviceName: "multi-step-tool-calls-demo",
});

class Env {
  static #instance: Env;

  constructor() {
    if (Env.#instance) return Env.#instance;
    Env.#instance = this;
  }
}

export default new Env();
