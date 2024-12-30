# Fast Llama Inference with SambaNova

https://www.unremarkable.ai/fast-llama-inference-with-sambanova/?ref=github

![Xyz](images/xyz.png)

## Setup

Run npm install and build. 

```shell
npm install
npm run build
```

Make sure you have the following environment variables needed:

- `SAMBANOVA_API_KEY` - Your [SambaNova](https://cloud.sambanova.ai/apis?ref=unremarkable.ai) API Key.

All demos & experiments leverage the following tools:

1. Use of [Inquirer.js](https://www.npmjs.com/package/inquirer?ref=unremarkable.ai) with the CLI to prompt for user questions.
2. The [Vercel AI SDK](https://sdk.vercel.ai?ref=unremarkable.ai) is used to invoke and stream model output to the CLI.
3. Using the `Meta-Llama-3.3-70B-Instruct` model via hyper fast inference thanks to [SambaNova](https://sambanova.ai?ref=unremarkable.ai).

```shell
npm run demo
```

If you are testing other providers such as OpenAI or Bedrock you will need to make sure you have supporting API keys in your environment. For example `OPENAI_API_KEY` and standard AWS environment variables.

```shell
MODEL=gpt-4o npm run demo
MODEL=bedrock npm run demo
```

## Notes

My first use of LLama 3.3 70B was with the Bedrock model after enabling it produced this error below. Simple fix was to use the `us.` prefix for cross-region inference support. More here: https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html

```
ValidationException: Invocation of model ID meta.llama3-3-70b-instruct-v1:0 with on-demand throughput isn’t supported. Retry your request with the ID or ARN of an inference profile that contains this model.
```

The bedrock-cross-region.md file contains the following claims which the demo verifies.

```
✅ Amazon Bedrock launched cross-region inference on August 27, 2024
   Summary: The claim is correct as Amazon Bedrock did launch cross-region inference on August 27, 2024, as stated in the provided sources.
✅ Cross-region inference provides up to 2x the allocated in-region quotas
   Summary: The claim is correct as cross-region inference provides up to 2x the allocated in-region quotas according to the sources.
✅ Cross-region inference support was extended to Knowledge Bases on September 13, 2024
   Summary: The claim is correct as cross-region inference support was indeed extended to Knowledge Bases on September 13, 2024, as stated in the provided sources.
```

But if you change the first claim in that file to August 25, 2024, you will see the following output.

```
❌ Amazon Bedrock launched cross-region inference on August 25, 2024
   Summary: The claim is incorrect because Amazon Bedrock launched cross-region inference on August 27, 2024, not August 25, 2024.
   Fixed Claim: Amazon Bedrock launched cross-region inference on August 27, 2024
```
