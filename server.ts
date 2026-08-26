import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. AI Pronunciation Evaluation & Phonetic Correction
app.post("/api/gemini/pronunciation", async (req, res) => {
  try {
    const { targetText, spokenText, level = "B1" } = req.body;

    if (!targetText) {
      return res.status(400).json({ error: "targetText is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback heuristics if no API key
      const similarity = calculateSimilarity(targetText.toLowerCase(), (spokenText || "").toLowerCase());
      const score = Math.round(similarity * 100);
      return res.json({
        score: Math.max(40, score),
        fluencyScore: Math.min(100, score + 5),
        accuracyScore: score,
        phoneticAnalysis: `Target: "${targetText}". You said: "${spokenText || "No speech detected"}"`,
        feedback: score > 80 
          ? "Great clarity and pacing! Your rhythm is natural for intermediate English." 
          : "Keep practicing vowel lengths and word endings like '-ed' and '-s'.",
        wordBreakdown: targetText.split(" ").map((w: string) => ({
          word: w,
          status: (spokenText || "").toLowerCase().includes(w.toLowerCase().replace(/[^a-z]/g, "")) ? "correct" : "needs_practice",
          phoneticTip: `Focus on clean stress in '${w}'`
        })),
        cefrLevelAssessed: score > 85 ? "B2" : score > 60 ? "B1" : "A2",
        audioDrillTip: "Try linking consonants to vowels for smoother connected speech."
      });
    }

    const prompt = `You are a certified English Language Teacher & Pronunciation Coach specialized in CEFR levels (A1, A2, B1, B2).
Target Sentence: "${targetText}"
Learner's Spoken Transcription: "${spokenText || "(Silence / Unclear)"}"
Target CEFR Level: ${level}

Evaluate the learner's pronunciation, speech accuracy, phonetic challenges, stress patterns, and intonation.
Return a structured JSON with:
- score (0 to 100 overall score)
- accuracyScore (0 to 100)
- fluencyScore (0 to 100)
- phoneticAnalysis (2-3 sentences explaining exact phonemes, silent letters, or syllable stress)
- feedback (constructive, warm, encouraging B1-appropriate feedback)
- wordBreakdown (array of objects for each word in the target sentence with { word, status: 'correct'|'minor_error'|'needs_practice', phoneticTip: string })
- cefrLevelAssessed ('A1'|'A2'|'B1'|'B2')
- audioDrillTip (practical action for the user to try right now)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            accuracyScore: { type: Type.INTEGER },
            fluencyScore: { type: Type.INTEGER },
            phoneticAnalysis: { type: Type.STRING },
            feedback: { type: Type.STRING },
            wordBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  status: { type: Type.STRING },
                  phoneticTip: { type: Type.STRING },
                },
                required: ["word", "status", "phoneticTip"],
              },
            },
            cefrLevelAssessed: { type: Type.STRING },
            audioDrillTip: { type: Type.STRING },
          },
          required: [
            "score",
            "accuracyScore",
            "fluencyScore",
            "phoneticAnalysis",
            "feedback",
            "wordBreakdown",
            "cefrLevelAssessed",
            "audioDrillTip",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Pronunciation API error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze pronunciation" });
  }
});

// 2. Personalized Quiz Feedback & Grammar Explanation
app.post("/api/gemini/quiz-feedback", async (req, res) => {
  try {
    const { topic, question, selectedAnswer, correctAnswer, isCorrect, level = "B1" } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: isCorrect ? "Excellent job! You correctly applied the rule." : "Good try! Here is why the answer differs.",
        grammarRule: `Key topic: ${topic}. Pay attention to verb tenses, prepositions, and standard B1 sentence structure.`,
        commonMistake: "Learners frequently mix up present perfect and past simple or preposition collocations.",
        mnemonicTip: "Remember: 'have/has + past participle' connects past events to now.",
        exampleSentence: "She has lived here for three years (and still does)."
      });
    }

    const prompt = `You are an English pedagogical tutor explaining a quiz result to an English learner (${level} CEFR level).
Topic: ${topic}
Question: "${question}"
User Selected: "${selectedAnswer}"
Correct Answer: "${correctAnswer}"
Result: ${isCorrect ? "CORRECT" : "INCORRECT"}

Provide clear, friendly, and practical feedback suitable for intermediate B1 students. Avoid overly academic terminology.
Return JSON with:
- summary (brief 1-2 sentence congratulations or positive re-direction)
- grammarRule (clear explanation of the underlying rule)
- commonMistake (why learners often pick the wrong option or make this error)
- mnemonicTip (a quick memory trick or rule of thumb)
- exampleSentence (a realistic daily life B1 sentence demonstrating this correctly)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            grammarRule: { type: Type.STRING },
            commonMistake: { type: Type.STRING },
            mnemonicTip: { type: Type.STRING },
            exampleSentence: { type: Type.STRING },
          },
          required: ["summary", "grammarRule", "commonMistake", "mnemonicTip", "exampleSentence"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Quiz feedback API error:", error);
    res.status(500).json({ error: error.message || "Failed to generate feedback" });
  }
});

// 3. Peer-to-Peer Speaking Partner & Live Roleplay / AI Conversational Chatbot
app.post("/api/gemini/peer-partner", async (req, res) => {
  try {
    const { peerProfile, messages, scenario, targetTopic, userLevel = "B1" } = req.body;

    const lastUserMessage = (messages || [])
      .filter((m: { sender: string }) => m.sender === "user")
      .pop();
    const lastUserText = lastUserMessage?.text || "";

    const ai = getGeminiClient();
    if (!ai) {
      // Dynamic context-aware fallback if Gemini is offline
      const dynamicTopic = targetTopic || "this topic";
      let dynamicReply = `I really like what you mentioned about "${lastUserText.slice(0, 40) || dynamicTopic}"! That's a great point. How did you first get interested in this?`;
      if (lastUserText.toLowerCase().includes("travel") || lastUserText.toLowerCase().includes("visit") || lastUserText.toLowerCase().includes("trip")) {
        dynamicReply = `Traveling is such an amazing experience! You mentioned "${lastUserText.slice(0, 35)}", which sounds wonderful. What's the next destination on your bucket list?`;
      } else if (lastUserText.toLowerCase().includes("work") || lastUserText.toLowerCase().includes("job") || lastUserText.toLowerCase().includes("study")) {
        dynamicReply = `That sounds very fulfilling and busy! How do you usually balance your schedule during the week?`;
      }

      return res.json({
        reply: dynamicReply,
        suggestedUserReplies: [
          `To be honest, what I enjoy most is learning new things every day.`,
          `I try to set aside thirty minutes each morning for focused practice.`,
          `Could you share how people usually handle that in your home country?`
        ],
        speakingCritique: lastUserText.length > 30 
          ? "Great sentence length and clear idea expression! You communicated your thought effectively."
          : "Good start! Try expanding with connectors like 'because', 'although', or 'for instance'.",
        vocabularyBonus: "B1 Phrase: 'to get the hang of something' (to learn how to do something well with practice)."
      });
    }

    const conversationHistory = (messages || [])
      .map((m: { sender: string; senderName?: string; text: string }) => `${m.senderName || m.sender}: ${m.text}`)
      .join("\n");

    const prompt = `You are roleplaying as ${peerProfile?.name || "Emma"} (${peerProfile?.country || "Ireland"}, ${peerProfile?.accent || "Warm English"}), an engaging, friendly conversation partner and AI English tutor in an English speaking lounge.
Scenario & Topic: "${scenario || "Casual Coffee Chat & Culture Exchange"}" (${targetTopic || "Daily Life & Hobbies"}).
Learner Target Level: ${userLevel} (B1 Intermediate).

CONVERSATION TRANSCRIPT:
${conversationHistory}

CRITICAL INSTRUCTIONS:
1. DIRECTLY AND SPECIFICALLY RESPOND to the user's latest input ("${lastUserText}"). Acknowledge what they said, comment on their specific opinion or fact, and ask 1 natural follow-up question.
2. Keep your reply concise (2-3 sentences max), warm, lively, and appropriate for ${userLevel} English listeners. Avoid robotic answers.
3. Provide 3 diverse, natural suggested replies the user could say next in response to what YOU just asked.
4. Provide a constructive, encouraging 1-sentence speaking critique on the user's latest utterance (e.g. praising good vocabulary, fixing minor grammar, or suggesting a more natural collocation).
5. Provide a relevant B1/B2 idiom or phrasal verb ('vocabularyBonus') with a brief definition.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { 
              type: Type.STRING,
              description: "Natural 2-3 sentence conversational response directly reacting to the user's message and asking a follow-up question."
            },
            suggestedUserReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 natural, realistic suggested replies the user can send back."
            },
            speakingCritique: { 
              type: Type.STRING,
              description: "1-sentence constructive feedback or grammar/vocabulary praise on user's last message."
            },
            vocabularyBonus: { 
              type: Type.STRING,
              description: "A useful B1/B2 idiom or phrasal verb relevant to this topic with definition."
            },
          },
          required: ["reply", "suggestedUserReplies", "speakingCritique", "vocabularyBonus"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Peer partner error:", error);
    res.status(500).json({ error: error.message || "Failed to generate peer response" });
  }
});

// Helper simple similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.replace(/[^a-z0-9\s]/gi, "");
  const s2 = str2.replace(/[^a-z0-9\s]/gi, "");
  if (!s1 || !s2) return 0.5;
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  let matches = 0;
  for (const w of words1) {
    if (words2.includes(w)) matches++;
  }
  return Math.min(1, (matches / Math.max(words1.length, 1)) * 0.85 + 0.15);
}

// Vite middleware in dev or static files in prod
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LinguaStep server is running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
