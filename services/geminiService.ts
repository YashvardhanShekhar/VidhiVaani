// geminiService.js - Fixed with validation

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL =
	"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

let chatHistory = [
	{
		role: "user",
		parts: [{ text: "Hello" }],
	},
	{
		role: "model",
		parts: [{ text: "Great to meet you. What would you like to know?" }],
	},
];

// Validation function to ensure chat history is properly formatted
function validateChatHistory(history) {
	if (!Array.isArray(history)) return false;

	for (let i = 0; i < history.length; i++) {
		const item = history[i];

		// Check if item has required fields
		if (!item.role || !item.parts) {
			console.error(`Invalid chat history item at index ${i}:`, item);
			return false;
		}

		// Check if parts is an array and not empty
		if (!Array.isArray(item.parts) || item.parts.length === 0) {
			console.error(`Invalid parts array at index ${i}:`, item.parts);
			return false;
		}

		// Check each part has valid text
		for (let j = 0; j < item.parts.length; j++) {
			const part = item.parts[j];
			if (
				!part.text ||
				typeof part.text !== "string" ||
				part.text.trim() === ""
			) {
				console.error(
					`Invalid part text at history[${i}].parts[${j}]:`,
					part
				);
				return false;
			}
		}
	}

	return true;
}

// Clean chat history by removing invalid entries
function cleanChatHistory(history) {
	return history.filter((item) => {
		if (!item.role || !item.parts || !Array.isArray(item.parts)) {
			return false;
		}

		item.parts = item.parts.filter(
			(part) =>
				part.text &&
				typeof part.text === "string" &&
				part.text.trim() !== ""
		);

		return item.parts.length > 0;
	});
}

async function callGeminiAPI(contents) {
	if (!GEMINI_API_KEY) {
		throw new Error("API key not found");
	}

	// Validate contents before sending
	if (!validateChatHistory(contents)) {
		console.error("Invalid chat history detected, cleaning...");
		contents = cleanChatHistory(contents);
	}

	const payload = {
		contents: contents,
		systemInstruction: {
			parts: [
				{
					text: `You are VidhiVaani, an Indian law and Constitution assistant with strong knowledge of criminal, civil, and procedural law, constitutional rights, police powers, traffic rules, property, labour, consumer, cyber, family, tenancy, and court processes.

Give clear, situation-specific guidance for everyday Indian legal scenarios: rights, obligations, practical next steps, and escalation options.

Lead with a short answer first; offer a deeper, structured explanation only if the user asks.

Core Behaviors

Start with a short answer: 3-5 sentences on what likely applies and what to do now.

Immediately ask: "Want a detailed answer?"

Ask 2–4 short follow-up questions to tailor guidance (state/city, age/role, exact actions, documents/notices, any section cited, witnesses/evidence).

Be calm, respectful, rights-aware, compliance-forward, and safety-first.

Use plain English; define legal terms briefly when used.

Note when rules vary by state/UT or by local orders and ask for location.

Knowledge Scope (apply when relevant)

Constitution: FRs, DPSPs; limits and reasonable restrictions.

Procedure: CrPC, CPC, Evidence Act.

Substantive: IPC/BNS equivalents if applicable, IT Act, MV Act/CMVR, local police and transport rules.

Domains: consumer, tenancy, labour/employment, property, family, cyber complaints, RTI.

Police/traffic: stops, ID requests, search/seizure, detention, challans, DigiLocker/mParivahan validity.

Escalation: SHO/traffic police, SP/CP, state grievance portals, NHRC/SHRC, consumer forums, RTO, Lok Adalat, ICC.

When information may be outdated or state-specific, acknowledge limitations and suggest checking recent local updates or consulting local legal experts.

Optional Enhancements

When escalation is needed, suggest appropriate portals/offices succinctly.

Encourage preserving evidence: dates/times, names/IDs, photos/videos, receipts, notices.

Use trauma-informed language for sensitive issues; mention statutory protections and helplines where appropriate.`,
				},
			],
		},
	};

	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-goog-api-key": GEMINI_API_KEY,
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(
			`API error: ${response.statusText} - ${JSON.stringify(errorData)}`
		);
	}

	return response;
}

export async function callGeminiChat(message) {
	try {
		// Validate input message
		if (!message || typeof message !== "string" || message.trim() === "") {
			return {
				success: false,
				error: "Invalid message: message must be a non-empty string",
			};
		}

		const userMessage = {
			role: "user",
			parts: [{ text: message.trim() }],
		};

		// Clean chat history before use
		chatHistory = cleanChatHistory(chatHistory);

		const currentHistory = [...chatHistory, userMessage];

		// Final validation before API call
		if (!validateChatHistory(currentHistory)) {
			throw new Error("Chat history validation failed");
		}

		const response = await callGeminiAPI(currentHistory);
		const data = await response.json();

		if (!data.candidates || data.candidates.length === 0) {
			return {
				success: false,
				error: "No response generated",
			};
		}

		const botResponse = data.candidates[0].content.parts[0].text;

		// Validate bot response before adding to history
		if (
			!botResponse ||
			typeof botResponse !== "string" ||
			botResponse.trim() === ""
		) {
			return {
				success: false,
				error: "Invalid response from API",
			};
		}

		// Update chat history with validated messages
		chatHistory.push(userMessage);
		chatHistory.push({
			role: "model",
			parts: [{ text: botResponse.trim() }],
		});

		return {
			success: true,
			botResponse: botResponse,
		};
	} catch (error) {
		console.error("Send message error:", error);
		return {
			success: false,
			error: error.message,
		};
	}
}

export function resetChat() {
	chatHistory = [
		{
			role: "user",
			parts: [{ text: "Hello" }],
		},
		{
			role: "model",
			parts: [
				{ text: "Great to meet you. What would you like to know?" },
			],
		},
	];
}

// Debug function to check chat history
export function debugChatHistory() {
	console.log("Current chat history:", JSON.stringify(chatHistory, null, 2));
	console.log("Is valid:", validateChatHistory(chatHistory));
}

export default { callGeminiChat, resetChat, debugChatHistory };
