import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    // Extract the `messages` and `synthesis` from the body of the request
    const { messages, synthesis } = await req.json();

    // Include a system message to start the conversation that contains the article content
    const response = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      stream: true,
      messages: [
        ...messages,
        {
          role: "system",
          content:
            "Here is the article content. Answer the user's question based on the article. Keep your answer under 30 words.\n" +
            synthesis,
        },
      ],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}