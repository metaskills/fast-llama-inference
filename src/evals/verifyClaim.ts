import env from "../shared/env.js";
import { Eval } from "braintrust";
import { ValidJSON } from "autoevals";
import { verifyClaim } from "../agents/verifyClaim.js";

const claims = [
  {
    claim: "Amazon Bedrock launched cross-region inference on August 27, 2024",
    original_text:
      "Amazon Bedrock launched cross-region inference on August 27, 2024[1]",
  },
  {
    claim:
      "Cross-region inference enables developers to utilize compute across different AWS Regions, providing up to 2x their allocated in-region quotas",
    original_text:
      "enables developers to seamlessly manage traffic bursts by utilizing compute across different AWS Regions, providing up to 2x their allocated in-region quotas and enhanced resilience during periods of peak demand[1]",
  },
  {
    claim:
      "Cross-region inference has expanded to include support for various models, including Anthropic Claude and Meta Llama models as of November 6, 2024",
    original_text:
      "cross-region inference has expanded to include support for various models, with cross-region inference profiles being added for Anthropic Claude and Meta Llama models on November 6, 2024[2]",
  },
];

const sources = [
  env.readFile("data/bedrock-cross-region/1.md"),
  env.readFile("data/bedrock-cross-region/2.md"),
  env.readFile("data/bedrock-cross-region/3.md"),
];

await Eval("Verify Claim", {
  data: () => {
    return [
      {
        input: {
          claim: claims[0].claim,
          original_text: claims[0].original_text,
          sources: sources,
        },
        expected: 1,
      },
      {
        input: {
          claim: claims[1].claim,
          original_text: claims[1].original_text,
          sources: sources,
        },
        expected: 1,
      },
      {
        input: {
          claim: claims[2].claim,
          original_text: claims[2].original_text,
          sources: sources,
        },
        expected: 1,
      },
    ];
  },
  task: async (input) => {
    return await verifyClaim(input.claim, input.original_text, input.sources);
  },
  scores: [
    ValidJSON.partial({
      schema: {
        type: "object",
        properties: {
          claim: { type: "string" },
          assessment: { type: ["boolean", "null"] },
          summary: { type: "string" },
          fixed_claim: { type: ["string", "null"] },
        },
        required: ["claim", "assessment", "summary", "fixed_claim"],
        additionalProperties: false,
      },
    }),
  ],
  metadata: {
    model: env.model.modelId,
  },
});
