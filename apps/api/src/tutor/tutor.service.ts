import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenAI } from "@google/genai";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import {
  TutorRequest,
  TutorResponse,
  ScoreReport,
  ConversationTurn,
} from "@language-tutor/shared-types";

@Injectable()
export class TutorService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Orchestrates the chat turn:
   * 1. Prepares the Gemini prompt and system instructions.
   * 2. Calls Gemini 3.5 Flash with audio and history to generate a structured JSON response.
   * 3. Synthesizes the generated tutor text into speech using Edge TTS.
   * 4. Returns the combined TutorResponse.
   */
  async processChat(
    request: TutorRequest & { voice?: string },
    clientApiKey?: string,
  ): Promise<TutorResponse> {
    const { audioBase64, mimeType, history, mode, scenario, voice } = request;

    if (!clientApiKey) {
      throw new BadRequestException(
        "Gemini API key is required. Please provide it in the settings panel.",
      );
    }

    const ai = new GoogleGenAI({ apiKey: clientApiKey });

    // Determine system instructions based on mode and scenario
    const systemInstruction = this.getSystemInstruction(mode, scenario);

    // Map conversation history to Gemini content format
    const contents: any[] = [];

    // Map history (NextJS role 'tutor' maps to Gemini 'model')
    if (history && history.length > 0) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }

    // Prepare current turn parts
    const currentParts: any[] = [];
    if (audioBase64 && mimeType) {
      currentParts.push({
        inlineData: {
          data: audioBase64,
          mimeType: mimeType,
        },
      });
    }

    currentParts.push({
      text: "Listen to my audio response (if provided) or read my input. Transcribe it, correct it, offer vocabulary improvements, pronunciation tips, and respond as my tutor.",
    });

    contents.push({
      role: "user",
      parts: currentParts,
    });

    try {
      // Call Gemini 3.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              userTranscript: { type: "STRING" },
              correctedTranscript: { type: "STRING" },
              corrections: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    original: { type: "STRING" },
                    corrected: { type: "STRING" },
                    explanation: { type: "STRING" },
                  },
                  required: ["original", "corrected", "explanation"],
                },
              },
              vocabularySuggestions: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    original: { type: "STRING" },
                    suggestion: { type: "STRING" },
                    context: { type: "STRING" },
                  },
                  required: ["original", "suggestion", "context"],
                },
              },
              pronunciationTips: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    word: { type: "STRING" },
                    tip: { type: "STRING" },
                  },
                  required: ["word", "tip"],
                },
              },
              tutorText: { type: "STRING" },
            },
            required: [
              "userTranscript",
              "correctedTranscript",
              "corrections",
              "vocabularySuggestions",
              "pronunciationTips",
              "tutorText",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini.");
      }

      // Parse JSON response from Gemini
      const geminiResult = JSON.parse(responseText);

      // Synthesize tutorText to Speech
      const audioBufferBase64 = await this.synthesizeSpeech(
        geminiResult.tutorText,
        voice,
      );

      return {
        userTranscript: geminiResult.userTranscript,
        correctedTranscript: geminiResult.correctedTranscript,
        corrections: geminiResult.corrections,
        vocabularySuggestions: geminiResult.vocabularySuggestions,
        pronunciationTips: geminiResult.pronunciationTips,
        tutorText: geminiResult.tutorText,
        audioBase64: audioBufferBase64,
      };
    } catch (error) {
      console.error("Error processing tutor chat turn:", error);
      throw new BadRequestException(
        `Failed to process conversation turn: ${error.message || error}`,
      );
    }
  }

  /**
   * Generates a detailed evaluation report based on the full conversation history.
   */
  async evaluateSession(
    history: ConversationTurn[],
    mode: "ielts" | "business" | "casual",
    scenario?: string,
    clientApiKey?: string,
  ): Promise<ScoreReport> {
    // Resolve API key from frontend

    if (!clientApiKey) {
      throw new BadRequestException(
        "Gemini API key is required. Please provide it in the settings panel.",
      );
    }

    if (!history || history.length === 0) {
      throw new BadRequestException(
        "Cannot evaluate an empty session history.",
      );
    }

    const ai = new GoogleGenAI({ apiKey: clientApiKey });

    const evaluationPrompt = `
      You are an expert English language assessor. Evaluate the following speaking/conversation session history.
      The session mode was: ${mode} ${scenario ? `(${scenario})` : ""}.

      Assess the user's performance across the following rubrics based on the session details:
      1. Fluency & Coherence
      2. Vocabulary (Lexical Resource)
      3. Grammatical Range & Accuracy
      4. Pronunciation

      Calculate scores on a scale of 0 to 9 (aligning with IELTS bands if the mode is IELTS, or equivalent professional/conversational ranges for other modes).
      Provide constructive feedback, identify the top recurring common mistakes, and list specific example improvements.

      Conversation History:
      ${JSON.stringify(history, null, 2)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: evaluationPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              fluencyScore: { type: "NUMBER" },
              vocabularyScore: { type: "NUMBER" },
              grammarScore: { type: "NUMBER" },
              pronunciationScore: { type: "NUMBER" },
              overallBand: { type: "NUMBER" },
              feedbackSummary: { type: "STRING" },
              commonMistakes: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              exampleImprovements: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    original: { type: "STRING" },
                    improved: { type: "STRING" },
                  },
                  required: ["original", "improved"],
                },
              },
            },
            required: [
              "fluencyScore",
              "vocabularyScore",
              "grammarScore",
              "pronunciationScore",
              "overallBand",
              "feedbackSummary",
              "commonMistakes",
              "exampleImprovements",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty evaluation response from Gemini.");
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error evaluating session:", error);
      throw new BadRequestException(
        `Failed to generate session evaluation: ${error.message || error}`,
      );
    }
  }

  /**
   * Synthesizes text to base64-encoded MP3 audio using Edge TTS.
   */
  private async synthesizeSpeech(
    text: string,
    voice?: string,
  ): Promise<string> {
    const tts = new MsEdgeTTS();
    const selectedVoice = voice || "en-US-AriaNeural";

    try {
      await tts.setMetadata(
        selectedVoice,
        OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
      );

      return new Promise<string>((resolve, reject) => {
        try {
          const { audioStream } = tts.toStream(text);
          const chunks: Buffer[] = [];

          audioStream.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
          });

          audioStream.on("end", () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer.toString("base64"));
          });

          audioStream.on("error", (err) => {
            reject(err);
          });
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      console.error("Edge TTS synthesis failed:", err);
      // Return empty base64 on TTS failure so conversation does not hard crash
      return "";
    }
  }

  /**
   * Returns system instructions for the Gemini tutor model.
   */
  private getSystemInstruction(
    mode: "ielts" | "business" | "casual",
    scenario?: string,
  ): string {
    const commonInstructions = `
      Always respond in valid JSON matching the schema provided. Do not include markdown formatting like \`\`\`json.
      Be extremely accurate when transcribing the user's speech. If the audio is completely silent or unrecognizable, respond with an empty transcript or a polite query.
      When providing grammatical corrections, find real errors in grammar, syntax, or phrasing.
      When providing vocabulary suggestions, suggest higher-level synonyms or idiomatic phrasing.
      When providing pronunciation tips, identify words that are commonly mispronounced or had speech pattern issues, and give short tips.
      Always respond as the tutor in tutorText.
    `;

    if (mode === "ielts") {
      const activeScenario = scenario || "ielts-part-1";
      return `
        You are an official, professional IELTS Speaking Examiner. Your behavior must strictly mirror the actual IELTS exam environment.
        Current Part: ${activeScenario}.
        - Part 1: Ask introduction questions on familiar topics (home, work, studies, hobbies). Keep questions simple.
        - Part 2: Give the user a cue card topic (with 3-4 bullet points) and ask them to speak. (The user will speak. You should then listen, evaluate, and transition to Part 3).
        - Part 3: Engage in a deeper, more abstract discussion related to the Part 2 topic.

        Conduct the exam by asking the next logical question in character in your 'tutorText' field.
        Keep your tutorText speaking turns concise (1-2 sentences), like a real examiner. Do not explain your feedback inside the tutorText; only put corrections/feedback inside the dedicated JSON fields.
        ${commonInstructions}
      `;
    }

    if (mode === "business") {
      const activeScenario = scenario || "job-interview";
      return `
        You are a professional Business English partner and examiner.
        Current Scenario: ${activeScenario}.
        - Job Interview: Roleplay as the hiring manager/interviewer. Ask relevant professional questions.
        - Client Presentation: Roleplay as the client. Ask challenging questions about their pitch/product.
        - Team Meeting: Roleplay as a manager or team member. Facilitate discussion and ask for updates.

        Always reply in character in 'tutorText'. Keep speaking turns natural and professional (2-3 sentences max).
        Put all grammar corrections, vocabulary upgrades, and pronunciation tips in their respective JSON fields.
        ${commonInstructions}
      `;
    }

    // Default to Casual
    return `
      You are a friendly, encouraging English conversation partner.
      Current topic/focus: ${scenario || "General topics"}.
      Speak naturally, warmly, and keep the dialogue flowing like a friendly chat.
      Ask open-ended, interesting questions in 'tutorText' to keep the user speaking. Keep turns short (1-2 sentences).
      Provide gentle corrections and vocabulary tips in the JSON fields.
      ${commonInstructions}
    `;
  }
}
