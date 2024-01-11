'use client';

async function run(model: string, input: any) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/259d9cff4d0f27bf78eb3a6300b4f676/ai/run/${model}`,
    {
        headers: { 
          'Authorization': `Bearer ${process.env.CF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(input),
        credentials: 'include' // Include cookies with the request
      }
  );
  const result = await response.json();
  return result;
}

// Export the run function
export { run };