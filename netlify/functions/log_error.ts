import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || '{}');
    console.error(">>> FRONTEND ERROR LOGGED >>>", body);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to log error" })
    };
  }
};
