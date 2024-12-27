
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

All demos & expierments leverage the following tools:

1. Use of [Inquirer.js](https://www.npmjs.com/package/inquirer?ref=unremarkable.ai) with the CLI to prompt for user questions.
2. The [Vercel AI SDK](https://sdk.vercel.ai?ref=unremarkable.ai) is used to invoke and stream model output to the CLI.
3. Using the `Meta-Llama-3.3-70B-Instruct` model via hyper fast inference thanks to [SambaNova](https://sambanova.ai?ref=unremarkable.ai).


## Notes

My first use of LLama 3.3 70B was with the Bedrock model after enabling it produced this error:

```
ValidationException: Invocation of model ID meta.llama3-3-70b-instruct-v1:0 with on-demand throughput isn’t supported. Retry your request with the ID or ARN of an inference profile that contains this model.
```

