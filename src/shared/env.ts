import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { registerOTel } from "@vercel/otel";
import { model } from "../shared/models.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  get model() {
    return model;
  }

  readFile(projectPath: string) {
    const rpath = path.join(__dirname, `../../${projectPath}`);
    return fs.readFileSync(rpath, "utf-8");
  }
}

export default new Env();
