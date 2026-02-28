export async function analyzeSymptoms(symptomText) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        throw new Error("API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

    // gemini-2.5-flash — latest model. It's a thinking model: skip thought parts, use the actual text part.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const validDepts = ["General Medicine", "Cardiology", "Neurology", "Pediatrics", "Orthopedics"];

    function validateTriageResult(result) {
        if (!result || typeof result !== 'object') return false;
        return (
            validDepts.includes(result.department) &&
            Number.isInteger(result.urgency) &&
            result.urgency >= 1 &&
            result.urgency <= 5 &&
            typeof result.summary === "string" &&
            typeof result.recommendation === "string" &&
            Array.isArray(result.tips)
        );
    }

    const prompt = `You are a medical triage AI assistant. Analyze the patient symptoms and respond ONLY with a valid JSON object — no markdown, no explanation, no extra text.

Required JSON format:
{
  "department": "<one of: General Medicine, Cardiology, Neurology, Pediatrics, Orthopedics>",
  "urgency": <integer 1-5>,
  "summary": "<one sentence summary of the suspected issue>",
  "recommendation": "<brief advice for the patient>",
  "tips": [
    "<Provide 2-3 general wellness tips, home remedies, or encouraging motivation related to their specific symptoms>"
  ]
}

Patient symptoms: "${symptomText}"`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            maxOutputTokens: 1024  // Increased — 300 was truncating the JSON response
        }
    };

    const makeRequest = async () => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(`API error ${response.status}: ${errData?.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];

        // gemini-2.5-flash is a thinking model — parts[0] may be an internal thought block.
        // Find the first part that is NOT marked as a thought to get the actual response.
        const actualPart = parts.find(p => !p.thought && typeof p.text === 'string') || parts[0] || {};
        const rawText = actualPart.text || '';

        // Robust JSON extraction: handles markdown fences and inline text
        let cleaned = rawText
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();

        // Extract JSON object even if wrapped in explanatory text
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleaned = jsonMatch[0];

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch {
            console.error("Raw AI response:", rawText);
            throw new Error("AI returned an unexpected format. Please try again.");
        }

        // Fix department if AI returned something close but not exact
        if (!validDepts.includes(parsed.department)) {
            const match = validDepts.find(d => d.toLowerCase().includes((parsed.department || '').toLowerCase().split(' ')[0]));
            if (match) parsed.department = match;
            else parsed.department = "General Medicine";
        }

        // Normalise urgency
        parsed.urgency = Math.min(5, Math.max(1, Math.round(Number(parsed.urgency) || 1)));

        // Ensure tips is always an array
        if (!Array.isArray(parsed.tips)) parsed.tips = [];

        if (!validateTriageResult(parsed)) {
            console.error("Validation failed on:", parsed);
            throw new Error("AI returned an unexpected format. Please try again.");
        }

        return parsed;
    };

    // Exponential backoff (3 retries: 1s, 2s, 4s)
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await makeRequest();
        } catch (err) {
            if (i === maxRetries - 1) throw err;
            const delay = Math.pow(2, i) * 1000;
            console.warn(`AI API call failed (attempt ${i + 1}). Retrying in ${delay / 1000}s...`, err.message);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

export async function sendChatMessage(messages) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        throw new Error("API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    // Format conversation history for Gemini
    // Gemini expects { role: 'user'|'model', parts: [{ text: '' }] }
    const formattedMessages = messages.map(msg => ({
        role: msg.isBot ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    // System prompt basically injected as the first message or prepend
    const systemPrompt = `You are Pulse AI, a friendly, concise, and professional AI healthcare assistant.
Your role:
1. Provide helpful, accurate, general health information and wellness tips.
2. Be empathetic and supportive.
3. Keep responses relatively brief (1-3 paragraphs maximum) and easy to read.

Important constraints:
- DO NOT provide definitive medical diagnoses or prescribe medications.
- ALWAYS encourage users to consult a real human doctor for serious concerns.
- If a user mentions severe symptoms (e.g., chest pain, severe bleeding, difficulty breathing), strongly advise them to seek emergency care immediately.
- Refuse to answer non-health-related or inappropriate queries politely.

Respond directly to the user's latest message considering the conversation history.`;

    // We prepend the system instruction context to the first user message if possible,
    // or we can use the system_instruction field

    const requestBody = {
        system_instruction: {
            parts: [{ text: systemPrompt }]
        },
        contents: formattedMessages,
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 500,
        }
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`API error ${response.status}: ${errData?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];

    // Extract actual response skipping thought blocks
    const actualPart = parts.find(p => !p.thought && typeof p.text === 'string') || parts[0] || {};
    return actualPart.text || "I'm sorry, I couldn't process that response.";
}

