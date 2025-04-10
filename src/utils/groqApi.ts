
// This utility connects to the Groq API for AI responses

/**
 * Get a response from the Groq API
 * Note: In a production app, this API call should be made through a backend service
 * to protect your API key. For this demo, we'll store the key in localStorage.
 */
export async function getGroqResponse(prompt: string): Promise<string> {
  // Check if API key exists in localStorage
  const apiKey = localStorage.getItem('groq_api_key');
  
  if (!apiKey) {
    return "Please set your Groq API key in the settings to enable AI-powered responses.";
  }
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a motorsport expert assistant. Provide accurate and helpful information about racing series, championships, drivers, teams, and motorsport history. Focus on Formula 1, MotoGP, IndyCar, WEC, Formula E, NASCAR, WRC, and DTM."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching from Groq API:", error);
    return "Sorry, I encountered an error while generating a response. Please try again later.";
  }
}
