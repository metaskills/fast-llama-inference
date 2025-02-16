import env from "../shared/env.ts";
import { Eval } from "braintrust";
import { JSONDiff } from "autoevals";
import { verifyClaims } from "../agents/verifyClaims.ts";

await Eval("Verify Claims", {
  data: () => {
    return [
      {
        input: env.readFile("data/bedrock-cross-region.md"),
        expected: [true, true, true],
      },
    ];
  },
  task: async (input) => {
    const verifications = await verifyClaims(input);
    return verifications.map((v) => v.assessment);
  },
  scores: [JSONDiff],
  metadata: {
    model: env.model.modelId,
  },
  trialCount: 3,
});
