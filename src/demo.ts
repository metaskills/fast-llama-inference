import env from "./shared/env.js";
import { extractClaims } from "./agents/extractClaims.js";
import { verifyClaim } from "./agents/verifyClaim.js";

const bedrock = env.readFile("data/bedrock-cross-region.md");
// const claims = await extractClaims(bedrock);
// const verified = await verifyClaim(claims[0].claim, bedrock, claims[0].sources);
