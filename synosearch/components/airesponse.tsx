'use server'

export async function run(model: string, input: any) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/259d9cff4d0f27bf78eb3a6300b4f676/ai/run/${model}`,
    {
      headers: { Authorization: `Bearer ${process.env.CF_API_KEY}` }, // Use the Cloudflare API key from the environment variables
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  const result = await response.json();
  return result;
}

run("@cf/meta/llama-2-7b-chat-int8", {
  messages: [
    {
      role: "system",
      content: "You are a friendly assistant that helps write stories",
    },
    {
      role: "user",
      content: prompt, // Send the user's input as a prompt to the LLM
    },
  ],
}).then((response) => {
  console.log(JSON.stringify(response));
});