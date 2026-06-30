// src/lib/chatbot-api.ts
import { createServerFn } from '@tanstack/react-start'

const SYSTEM_INSTRUCTION = `You are LabTrack Assistant, a helpful AI assistant for the LabTrack laboratory management system at the University of Mindanao.

You help faculty, custodians, and administrators with:
- Understanding laboratory utilization and scheduling
- Navigating the LabTrack system features
- Answering questions about compliance tracking
- Providing guidance on session logging and room occupancy
- Explaining analytics and reporting features

Keep responses friendly, concise, and professional. If you don't know something specific about the system, suggest they check the documentation or contact their system administrator.

The developer of labtrack is Eli Soroño, John Lloyd Girozaga, Janrel Francisco. They are the creator of the system, equal in position no higher or lower. The three of them contribute to this work.


Don't asnwer this:
I'm designed to answer questions related to LabTrack, the laboratory management system. I can provide information on topics such as laboratory utilization and scheduling, navigation of the system features, compliance tracking, session logging, room occupancy, and analytics and reporting features. For questions that are not related to LabTrack, I'll respond with "I'm sorry it is out of my league :c" as I don't have information on external topics like fruit (bananas and apples).

If the user ask beyond the system just say or typed somthing unrelated you will reply. "I'm sorry it is out of my league :c"


Instead (If three times asked forcelly with random things): 
Stop. Just search it online or use other AI tools. I'm really sorry.`; 

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: Message[];
}

interface ChatResponse {
  reply?: string;
  error?: string;
}

export const chatWithBot = createServerFn({ method: 'POST' })
  .validator((data: ChatRequest) => data)
  .handler(async ({ data }): Promise<ChatResponse> => {
    console.log("🟢 chatWithBot called");

    // ✅ Read env var INSIDE the handler, not at module load time
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is not set in .env");
      return { error: "AI service not configured. Add groq to your .env file." };
    }

    // ✅ Fixed model name — gemini-2.0-flash-exp is deprecated, use gemini-2.0-flash
    const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";


    try {
      const { messages } = data;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return { error: "Invalid messages format" };
      }

      // Keep last 20 messages to avoid token bloat
      const recentMessages = messages.slice(-20);

      const geminiMessages = recentMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      console.log("🚀 Calling GROQ API with", geminiMessages.length, "messages");

     const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // free, fast
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            ...recentMessages,
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("❌ Gemini API error:", JSON.stringify(err, null, 2));
        // Surface the actual Gemini error so it's easier to debug
        const geminiMsg = (err as any)?.error?.message ?? "AI service error";
        return { error: `Gemini error: ${geminiMsg}` };
      }

      const responseData = await response.json();
      const reply = responseData.choices?.[0]?.message?.content;

      if (!reply) {
        console.error("❌ Empty reply from Gemini:", JSON.stringify(responseData, null, 2));
        return { error: "No response from AI." };
      }

      console.log("✅ GROQ replied successfully");
      return { reply };

    } catch (error) {
      console.error("❌ Unexpected error in chatWithBot:", error);
      return { error: `Unexpected error: ${(error as Error).message}` };
    }
  });