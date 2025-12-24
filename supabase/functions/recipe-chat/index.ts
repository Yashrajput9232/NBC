const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  category: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  recipes: Recipe[];
  conversationHistory: Message[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, recipes, conversationHistory }: RequestBody = await req.json();

    const recipeContext = recipes.length > 0
      ? `\n\nUser's Recipe Collection:\n${recipes.map(r => `- ${r.title} (${r.category}): ${r.description || 'No description'}`).join('\n')}`
      : '';

    const conversationContext = conversationHistory.length > 0
      ? `\n\nPrevious conversation:\n${conversationHistory.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}`
      : '';

    const prompt = `You are a helpful recipe assistant. You can help users with cooking advice, recipe suggestions, ingredient substitutions, cooking techniques, and more. Be friendly, concise, and practical in your responses.

Current user message: "${message}"
${recipeContext}${conversationContext}

Provide a helpful, conversational response in 1-3 sentences.`;

    const response = await fetch("https://api.together.xyz/inference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("TOGETHER_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-2-7b-chat-hf",
        prompt: prompt,
        max_tokens: 256,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      console.error("Together API error:", await response.text());
      return new Response(
        JSON.stringify({
          response: "I'm having trouble connecting to my AI backend right now. Please try again in a moment.",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();
    const assistantResponse = data.output?.choices?.[0]?.text || "I'm not sure how to respond to that. Could you rephrase your question?";

    return new Response(
      JSON.stringify({
        response: assistantResponse.trim(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        response: "Sorry, something went wrong. Please try again.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
