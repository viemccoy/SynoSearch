'use server'

interface RequestContext {
    request: {
      json: () => Promise<{ prompt: string }>;
    };
    functionPath: string;
    waitUntil: (promise: Promise<any>) => void;
    passThroughOnException: () => void;
    next: (input?: any, init?: any) => void;
    env: any;
    params: any;
  }
  
  export async function onRequest(context: RequestContext) {
    const { prompt } = await context.request.json();
  
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/259d9cff4d0f27bf78eb3a6300b4f676/ai/run/@cf/meta/llama-2-7b-chat-int8`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a friendly assistant that helps write stories',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      }
    );
  
    const result = await response.json();
  
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  }