export async function analyzeSymptoms(symptomText) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        throw new Error("API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

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
            typeof result.recommendation === "string"
        );
    }

    const prompt = `You are a medical triage AI assistant. Analyze the patient symptoms and respond ONLY with a valid JSON object — no markdown, no explanation, no extra text.

Required JSON format:
{
  "department": "<one of: General Medicine, Cardiology, Neurology, Pediatrics, Orthopedics>",
  "urgency": <integer 1-5>,
  "summary": "<one sentence summary of the suspected issue>",
  "recommendation": "<brief advice for the patient>"
}

Patient symptoms: "${symptomText}"`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            maxOutputTokens: 300
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
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Strip any accidental markdown fences
        const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

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

        // Clamp urgency just in case
        parsed.urgency = Math.min(5, Math.max(1, Math.round(Number(parsed.urgency) || 1)));

        if (!validateTriageResult(parsed)) {
            console.error("Validation failed on:", parsed);
            throw new Error("AI returned an unexpected format. Please try again.");
        }

        return parsed;
    };

    // Exponential backoff for AI API calls (5 retries: 1s, 2s, 4s, 8s, 16s)
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await makeRequest();
        } catch (err) {
            if (i === maxRetries - 1) throw err;
            const delay = Math.pow(2, i) * 1000;
            console.warn(`AI API call failed. Retrying in ${delay / 1000}s...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}
