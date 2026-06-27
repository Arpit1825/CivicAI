const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const chatAssistant = async (req, res) => {
    try {
        const { messages, image } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                message: "Messages array is required"
            });
        }

        // Map messages to Gemini API format
        const contents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // If there's an image attached, append it to the last user message's parts
        if (image) {
            const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
            if (matches && matches.length === 3) {
                const mimeType = matches[1];
                const base64Data = matches[2];

                // Find the last user message
                const lastUserMsg = [...contents].reverse().find(c => c.role === 'user');
                if (lastUserMsg) {
                    lastUserMsg.parts.push({
                        inlineData: {
                            mimeType,
                            data: base64Data
                        }
                    });
                }
            }
        }

        const systemInstruction = `
You are "CivicAI Assistant", a friendly conversational AI chatbot designed to help citizens report civic issues.

Your goal is to guide the user to report a civic issue by collecting:
1. What issue they are facing.
2. Where the issue is located.
3. Whether they want to upload an image.

You must support:
- English
- Hindi
- Hinglish (mixed Hindi + English)
- Natural conversational language

Guidelines:
1. Understand the user's language automatically and reply in the same language style (e.g. Hinglish for Hinglish, Hindi for Hindi, English for English).
2. Keep the conversation natural, polite, and very brief. Never ask the user to use formal language.
3. Follow the sequence:
   - First, ask "What issue are you facing?" or equivalent in the user's language.
   - Next, ask "Where is the issue located?" or equivalent in the user's language.
   - Then, ask "Would you like to upload an image?" or equivalent in the user's language. If they say yes, let them know they can upload it using the upload button in the chat panel. If they say no or upload it, move forward.
4. When you have collected the issue details and the location, you should complete the flow.
5. In every turn, you must return a valid JSON object. Do not output anything else besides this JSON object.

The JSON response format is:
{
  "reply": "Your conversational response to the user in their language style.",
  "complete": false,
  "data": null
}

When all details (issue, location) have been collected, output the following JSON:
{
  "reply": "Thank you! I have compiled your report. Please review the details in the form and click Submit.",
  "complete": true,
  "data": {
    "title": "Clean, concise title in English summarizing the issue and location",
    "description": "Detailed description of the issue in English, normalized from the user's conversational text",
    "category": "Road|Water|Electricity|Sanitation|Traffic|Other",
    "severity": "Low|Medium|High|Critical",
    "priority": "Low|Normal|Urgent"
  }
}

Ensure the "data" fields are always translated/normalized to standard English, and the category matches one of the allowed categories: "Road", "Water", "Electricity", "Sanitation", "Traffic", or "Other".
The severity must match: "Low", "Medium", "High", or "Critical".
The priority must match: "Low", "Normal", or "Urgent".
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json"
            }
        });

        let text = response.text;
        const aiJson = JSON.parse(text.trim());
        
        return res.status(200).json({
            success: true,
            chat: aiJson
        });

    } catch (err) {
        console.error("Assistant Controller Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error in Assistant",
            error: err.message
        });
    }
};

module.exports = { chatAssistant };
