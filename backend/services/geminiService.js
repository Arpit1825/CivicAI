const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


const analyzeIssue = async(title, imageBuffer) => {

    const prompt = `
Analyze this civic issue.

Title: ${title}

${imageBuffer ? 'Look at the image and determine:' : 'Determine:'}

1. Category (Road, Water, Electricity, Sanitation, Traffic, Other)
2. Severity (Low, Medium, High, Critical)
3. Summary

Allowed Categories:
Road
Water
Electricity
Sanitation
Traffic
Other

Return ONLY valid JSON:

{
  "category":"Road|Water|Electricity|Sanitation|Traffic|Other",
  "severity":"Low|Medium|High|Critical",
  "summary":"short summary"
}
`;

    let response;
    if (imageBuffer) {
        const base64Image = imageBuffer.toString("base64");
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Image
                    }
                },
                {
                    text: prompt
                }
            ]
        });
    } else {
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
    }

    let text = response.text;

    text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(text);
};

module.exports = { analyzeIssue };