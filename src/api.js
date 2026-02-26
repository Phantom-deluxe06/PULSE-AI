export async function analyzeSymptoms(symptomText) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        throw new Error("API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    function validateTriageResult(result) {
        const validDepts = [
            "General Medicine", "Cardiology", "Neurology",
            "Pediatrics", "Orthopedics"
        ];

        if (!result || typeof result !== 'object') return false;

        return (
            validDepts.includes(result.department) &&
            Number.isInteger(result.urgency) &&
            result.urgency >= 1 &&
            result.urgency <= 5 &&
            typeof result.summary === "string" &&
            typeof result.recommendation === "string"
        );
    }

    async function callWithRetry(fn, maxRetries = 5) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                const delay = Math.pow(2, i) * 1000;
                console.warn(`API call failed. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    const prompt = `
You are a medical triage AI. Analyze the following patient symptoms and respond in strict JSON format.

JSON Schema:
{
  "department": "string" // Must be EXACTLY one of: "General Medicine", "Cardiology", "Neurology", "Pediatrics", "Orthopedics"
  "urgency": number // Integer from 1 (Routine) to 5 (Emergency)
  "summary": "string" // A 1-sentence summary of the suspected issue
  "recommendation": "string" // Brief advice, e.g., "See a doctor within 24 hours"
}

Patient Symptoms:
"${symptomText}"

DO NOT wrap the response in markdown code blocks. DO NOT output any text other than the JSON object.
`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.3,
            topP: 0.8,
            maxOutputTokens: 256
        }
    };

    const apiCall = async () => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;

        try {
            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanedText);

            if (!validateTriageResult(parsed)) {
                throw new Error("Invalid response format from AI");
            }

            return parsed;
        } catch (e) {
            console.error("Failed to parse or validate AI response:", responseText);
            throw new Error("Failed to process AI response");
        }
    };

    return await callWithRetry(apiCall, 5);
}
