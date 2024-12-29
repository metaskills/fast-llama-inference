import env from "./shared/env.js";
import { extractClaims } from "./agents/extractClaims.js";

const bedrock = env.readFile("data/bedrock-cross-region.md");
const claims = await extractClaims(bedrock);
