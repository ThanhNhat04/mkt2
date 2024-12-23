import jwt from 'jsonwebtoken';


// app/api/gpt/route.js
export async function POST(request) {
  const { messages } = await request.json();
  console.log(messages);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.openAIkey}`, // Make sure this variable is set
      },
      body: JSON.stringify({
        model: 'gpt-4', // or 'gpt-4'
        messages: messages, // An array of message objects
        max_tokens: 400,
      }),
    });

    // Check if the response is OK
    if (!response.ok) {
      console.log('lỗi');
      
      const errorResponse = await response.json();
      return new Response(JSON.stringify({ error: errorResponse.error.message }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the data from the response
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error occurred while calling the API' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
