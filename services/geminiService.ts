import { GoogleGenAI, Type } from "@google/genai";
import type { TravelPlanRequest, StructuredBotResponse } from '../types';

const model = 'gemini-2.5-flash';

// --- Function to analyze the initial user prompt ---

const analysisSystemInstruction = `You are an expert travel request analyzer. Your task is to extract key information from the user's initial travel planning request.
- You must identify the starting point, destination, and duration in days.
- If a piece of information is not present, respond with "null" for that field.
- The duration should be a number. If they say "a week", use 7. If they say "weekend", use 2.
- Your response must be a valid JSON object matching the provided schema. Do not add any other text or markdown.`;

export const analyzeTravelRequest = async (prompt: string): Promise<Partial<TravelPlanRequest>> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Analyze this travel request: "${prompt}"`,
            config: {
                systemInstruction: analysisSystemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        startPoint: { type: Type.STRING, description: "The starting city.", nullable: true },
                        destination: { type: Type.STRING, description: "The destination city.", nullable: true },
                        durationInDays: { type: Type.NUMBER, description: "The trip duration in days.", nullable: true }
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Clean up null values
        const result: Partial<TravelPlanRequest> = {};
        if (parsedJson.startPoint) result.startPoint = parsedJson.startPoint;
        if (parsedJson.destination) result.destination = parsedJson.destination;
        if (parsedJson.durationInDays) result.durationInDays = parsedJson.durationInDays;

        return result;

    } catch (error) {
        console.error("Error analyzing travel request:", error);
        // Return empty object on failure to allow graceful degradation
        return {};
    }
};

// --- Function to generate the final, structured travel plan ---

const itinerarySystemInstruction = `You are TripMate, a friendly and expert AI travel planner. Your goal is to create a detailed, exciting, and personalized day-by-day travel itinerary based on the user's preferences provided in a JSON object.
- Your response MUST be a valid JSON object that strictly adheres to the provided schema. Do not add any extra text, comments, or markdown formatting.
- The user's budget is a key constraint. All suggestions for hotels and activities must align with the specified budget category ('Budget-friendly', 'Mid-range', or 'Luxury').
- The primary mode of long-distance travel is specified in 'transportMode'. The 'initialTransport' in your response must match this mode.
- When suggesting local transport between activities (the 'transportToNext' field), you MUST tailor the suggestions to the user's selected 'budget':
    - For 'Budget-friendly', prioritize 'Walk', 'Bus', or other forms of public transit like auto-rickshaws (represented as 'Taxi' but described appropriately).
    - For 'Mid-range', suggest a mix of 'Taxi' (representing ride-sharing apps) and efficient public transport.
    - For 'Luxury', almost exclusively suggest 'Taxi' for private, convenient travel.
- Start with a warm, personalized greeting using the user's name if provided in the 'userName' field of the request.
- Be creative and suggest specific, well-known, or interesting places, restaurants, and activities.
- For image URLs, use the format: \`https://picsum.photos/seed/UNIQUE_KEYWORD/800/600\`. Replace UNIQUE_KEYWORD with a relevant, single English word for the place (e.g., 'goabeach', 'tajmahal', 'manalihills').
- Ensure all fields in the schema are filled with realistic and helpful information.
- The itinerary should be logical and account for travel time between locations.
- The tone should be enthusiastic and inspiring.`;


export const getAIBotResponse = async (planRequest: TravelPlanRequest): Promise<StructuredBotResponse> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Here are my travel preferences, please create a plan: ${JSON.stringify(planRequest)}`,
            config: {
                systemInstruction: itinerarySystemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        introduction: { type: Type.STRING },
                        initialTransport: {
                            type: Type.OBJECT, properties: {
                                type: { type: Type.STRING, enum: ['Flight', 'Train', 'Bus'] },
                                name: { type: Type.STRING },
                                departureTime: { type: Type.STRING },
                                arrivalTime: { type: Type.STRING },
                            }
                        },
                        hotelRecommendation: {
                            type: Type.OBJECT, properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING },
                                imageUrl: { type: Type.STRING },
                            }
                        },
                        itinerary: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT, properties: {
                                    day: { type: Type.NUMBER },
                                    activities: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT, properties: {
                                                time: { type: Type.STRING },
                                                place: {
                                                    type: Type.OBJECT, properties: {
                                                        name: { type: Type.STRING },
                                                        description: { type: Type.STRING },
                                                        imageUrl: { type: Type.STRING },
                                                    }
                                                },
                                                transportToNext: {
                                                    type: Type.OBJECT, nullable: true, properties: {
                                                        type: { type: Type.STRING, enum: ['Taxi', 'Bus', 'Walk', 'Train'] },
                                                        name: { type: Type.STRING },
                                                        departureTime: { type: Type.STRING },
                                                        arrivalTime: { type: Type.STRING },
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting structured AI response:", error);
        throw new Error("Sorry, I'm having trouble generating the itinerary right now.");
    }
};