import React, { useState, useEffect, useRef } from "react";
import { UserProfile, PeerRoom, ChatMessage, SpeakingSessionLog } from "../types";
import { SPEAKING_ROOMS } from "../data/speakingRoomsData";
import { audioSpeech } from "../utils/audioSpeech";
import { saveSpeakingSession } from "../utils/storage";
import {
  Users,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Radio,
  Award,
  Lightbulb,
  Loader2,
  ArrowRight,
  Headphones,
  Check,
  Bot,
  Zap
} from "lucide-react";

interface PeerSpeakingLoungeProps {
  user: UserProfile;
}

// Specialized AI Chatbot Personas
const AI_CHATBOT_PERSONAS = [
  {
    id: "bot-coach-david",
    name: "Coach David",
    role: "IELTS & Fluency Examiner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "United Kingdom",
    level: "B2" as const,
    accent: "British Received Pronunciation",
    scenario: "1-on-1 IELTS speaking practice & fluency coaching with instant band-score style feedback.",
    greeting: "Hello! I'm Coach David. I'm here to help you practice structured English answers, transition words, and natural rhythm. What topic would you like to discuss today?"
  },
  {
    id: "bot-dr-sarah",
    name: "Dr. Sarah Jenkins",
    role: "Grammar & Vocabulary Specialist",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    country: "United States",
    level: "B1" as const,
    accent: "Clear American Standard",
    scenario: "Friendly English tutor specializing in correcting sentence structures and expanding vocabulary naturally.",
    greeting: "Hi there! I'm Dr. Sarah. Feel free to talk about your day, your studies, or any question you have. I'll help you refine your sentences as we chat!"
  }
];

export const PeerSpeakingLounge: React.FC<PeerSpeakingLoungeProps> = ({ user }) => {
  const [selectedRoom, setSelectedRoom] = useState<PeerRoom>(SPEAKING_ROOMS[0]);
  const [isInsideRoom, setIsInsideRoom] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [isPartnerResponding, setIsPartnerResponding] = useState(false);
  const [partnerSpeaking, setPartnerSpeaking] = useState(false);
  const [aiCritique, setAiCritique] = useState<string | null>(null);
  const [vocabBonus, setVocabBonus] = useState<string | null>(null);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  
  // Speed & Audio preferences
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [turnCount, setTurnCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"rooms" | "chatbot">("rooms");

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentSessionIdRef = useRef<string | null>(null);

  // Helper to persist conversation session to teacher dashboard log
  const syncSessionToStorage = (
    currentRoom: PeerRoom,
    currentHistory: ChatMessage[],
    turns: number,
    critique?: string | null
  ) => {
    if (!currentSessionIdRef.current) return;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const sessionData: SpeakingSessionLog = {
      id: currentSessionIdRef.current,
      studentId: user.id,
      studentName: user.name,
      studentUsername: user.username || user.name.toLowerCase().replace(/\s+/g, "_"),
      studentAvatar: user.avatarUrl,
      roomId: currentRoom.id,
      roomTitle: currentRoom.title,
      roomTopic: currentRoom.topic,
      partnerName: currentRoom.partner.name,
      partnerCountry: currentRoom.partner.country,
      level: currentRoom.level,
      messages: currentHistory,
      startedAt: formattedDate,
      updatedAt: formattedDate,
      turnCount: turns,
      aiCritiqueSummary: critique || undefined
    };

    saveSpeakingSession(sessionData);
  };

  // Initialize Speech Recognition for live voice turns
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let current = "";
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setSpokenText(current);
        };

        recognition.onerror = (e: any) => {
          console.warn("Lounge speech recognition error:", e);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerResponding]);

  // Join Room & Initialize Partner Welcome
  const handleJoinRoom = (room: PeerRoom) => {
    setSelectedRoom(room);
    setIsInsideRoom(true);
    setTurnCount(0);
    const sessionId = `spk-${user.id.slice(0, 8)}-${Date.now()}`;
    currentSessionIdRef.current = sessionId;

    const initialGreeting = `Hi ${user.name.split(" ")[0]}! I'm ${room.partner.name} from ${room.partner.country}. Great to connect with you in this ${room.topic} practice room! ${room.prompts[0]}`;
    
    const initialMsgs: ChatMessage[] = [
      {
        id: "m-system",
        sender: "system",
        senderName: "Lounge System",
        text: `Connected to live peer audio channel with ${room.partner.name} (${room.partner.country}). Scenario: ${room.scenario}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "m-welcome",
        sender: "partner",
        senderName: room.partner.name,
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];

    setMessages(initialMsgs);
    setSuggestedReplies(room.suggestedPhrases.slice(0, 3));
    setAiCritique("Take a deep breath and speak in full sentences. Focus on natural intermediate pace.");
    setVocabBonus("Useful phrase: 'In my experience...' (introduces personal stories smoothly).");

    syncSessionToStorage(room, initialMsgs, 0, "Initial room entrance");

    // Speak partner's welcome if auto-play is enabled
    if (autoPlayAudio) {
      setPartnerSpeaking(true);
      audioSpeech.speak(initialGreeting, {
        rate: speechRate,
        onEnd: () => setPartnerSpeaking(false)
      });
    }
  };

  // Start direct AI Chatbot Tutor session
  const handleStartChatbot = (bot: typeof AI_CHATBOT_PERSONAS[0]) => {
    const customRoom: PeerRoom = {
      id: bot.id,
      title: `🤖 ${bot.name} - ${bot.role}`,
      topic: bot.role,
      level: bot.level,
      scenario: bot.scenario,
      activeParticipants: 1,
      maxParticipants: 2,
      partner: {
        name: bot.name,
        avatar: bot.avatar,
        country: bot.country,
        level: bot.level,
        accent: bot.accent,
        bio: bot.scenario
      },
      prompts: [
        "What are your main language goals this week?",
        "Tell me about something you did recently that you found exciting.",
        "Would you like to practice interview questions or everyday conversation?"
      ],
      suggestedPhrases: [
        "I'd love to improve my speaking confidence and fluency.",
        "Could you give me feedback on my sentence structure?",
        "Recently I've been working on expanding my daily vocabulary."
      ]
    };

    setSelectedRoom(customRoom);
    setIsInsideRoom(true);
    setTurnCount(0);
    const sessionId = `spk-bot-${user.id.slice(0, 8)}-${Date.now()}`;
    currentSessionIdRef.current = sessionId;

    const initialMsgs: ChatMessage[] = [
      {
        id: "m-system",
        sender: "system",
        senderName: "AI Chatbot Engine",
        text: `⚡ Fast AI Chatbot active: Instant response mode with ${bot.name} (${bot.role}). Responses are customized to your exact answers.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "m-welcome",
        sender: "partner",
        senderName: bot.name,
        text: bot.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];

    setMessages(initialMsgs);
    setSuggestedReplies(customRoom.suggestedPhrases);
    setAiCritique("Speak naturally and reply to the question. The AI evaluates your grammar and vocabulary in real time.");
    setVocabBonus("Pro-tip: 'To take something with a grain of salt' (to not completely believe something).");

    syncSessionToStorage(customRoom, initialMsgs, 0, "Chatbot session started");

    if (autoPlayAudio) {
      setPartnerSpeaking(true);
      audioSpeech.speak(bot.greeting, {
        rate: speechRate,
        onEnd: () => setPartnerSpeaking(false)
      });
    }
  };

  // Leave room
  const handleLeaveRoom = () => {
    audioSpeech.stopSpeaking();
    setIsInsideRoom(false);
    setMessages([]);
    setIsRecording(false);
    setPartnerSpeaking(false);
  };

  // Handle Recording Toggle
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    } else {
      setSpokenText("");
      setIsRecording(true);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn("Recognition already started:", e);
      }
    }
  };

  // Send User Message / Spoken Audio Turn
  const handleSendTurn = async (textToSend?: string) => {
    const finalContent = (textToSend || spokenText).trim();
    if (!finalContent) return;

    if (isRecording) {
      setIsRecording(false);
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      senderName: user.name.split(" ")[0],
      text: finalContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setSpokenText("");
    setIsPartnerResponding(true);
    setTurnCount((prev) => prev + 1);

    // Call Gemini Peer Partner API (Fast ThinkingLevel.LOW)
    try {
      const res = await fetch("/api/gemini/peer-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peerProfile: selectedRoom.partner,
          messages: updatedHistory.filter((m) => m.sender !== "system"),
          scenario: selectedRoom.scenario,
          targetTopic: selectedRoom.topic,
          userLevel: user.level || "B1"
        })
      });

      if (!res.ok) throw new Error("Peer response failed");
      const data = await res.json();

      const partnerMsg: ChatMessage = {
        id: `prt-${Date.now()}`,
        sender: "partner",
        senderName: selectedRoom.partner.name,
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, partnerMsg]);
      setSuggestedReplies(data.suggestedUserReplies || []);
      if (data.speakingCritique) setAiCritique(data.speakingCritique);
      if (data.vocabularyBonus) setVocabBonus(data.vocabularyBonus);

      syncSessionToStorage(selectedRoom, [...updatedHistory, partnerMsg], turnCount + 1, data.speakingCritique);

      // Play audio if enabled
      if (autoPlayAudio) {
        setPartnerSpeaking(true);
        audioSpeech.speak(data.reply, {
          rate: speechRate,
          onEnd: () => setPartnerSpeaking(false)
        });
      }
    } catch (e) {
      console.error(e);
      // Contextual instant fallback
      const fallbackReply = `That's a very clear answer! I like how you expressed that. Could you tell me more about why you feel that way?`;
      const partnerMsg: ChatMessage = {
        id: `prt-${Date.now()}`,
        sender: "partner",
        senderName: selectedRoom.partner.name,
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, partnerMsg]);
      syncSessionToStorage(selectedRoom, [...updatedHistory, partnerMsg], turnCount + 1, aiCritique);
      if (autoPlayAudio) {
        setPartnerSpeaking(true);
        audioSpeech.speak(fallbackReply, {
          rate: speechRate,
          onEnd: () => setPartnerSpeaking(false)
        });
      }
    } finally {
      setIsPartnerResponding(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
            <Bot className="w-3.5 h-3.5 text-blue-300" />
            <span>AI Conversational Chatbot & Live Peer Lounge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Live Audio & Text Speaking Practice
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Practice real-time conversations with intelligent AI tutors and peer characters. Responses are generated in under a second and react directly to what you say!
          </p>
        </div>
      </div>

      {!isInsideRoom ? (
        /* Room & Chatbot Selection View */
        <div className="space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex space-x-2">
              <button
                id="tab-practice-rooms"
                onClick={() => setActiveTab("rooms")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "rooms"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Scenario Practice Rooms ({SPEAKING_ROOMS.length})</span>
              </button>

              <button
                id="tab-ai-tutors"
                onClick={() => setActiveTab("chatbot")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "chatbot"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>1-on-1 AI Chatbot Tutors</span>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                  FAST
                </span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Ultra-fast response enabled</span>
            </div>
          </div>

          {activeTab === "rooms" ? (
            /* Scenario Rooms Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SPEAKING_ROOMS.map((room) => (
                <div
                  key={room.id}
                  id={`speaking-room-${room.id}`}
                  className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-xs space-y-5 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{room.title}</h3>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md shrink-0">
                        {room.level}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {room.scenario}
                    </p>

                    {/* Partner Preview */}
                    <div className="flex items-center space-x-3 pt-1">
                      <img
                        src={room.partner.avatar}
                        alt={room.partner.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{room.partner.name}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({room.partner.country})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{room.partner.bio}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{room.activeParticipants} active learners</span>
                    </div>

                    <button
                      id={`join-room-btn-${room.id}`}
                      onClick={() => handleJoinRoom(room)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Join Voice Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* AI Chatbot Personas Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {AI_CHATBOT_PERSONAS.map((bot) => (
                <div
                  key={bot.id}
                  id={`chatbot-persona-${bot.id}`}
                  className="bg-gradient-to-br from-white to-indigo-50/40 border border-indigo-200 hover:border-indigo-400 rounded-2xl p-6 shadow-xs space-y-5 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{bot.name}</span>
                          <span className="text-xs font-normal text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                            {bot.role}
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-500">{bot.country} • {bot.accent}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md shrink-0">
                        AI Tutor
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-indigo-100">
                      {bot.scenario}
                    </p>

                    <div className="text-[11px] text-indigo-900 bg-indigo-50/80 p-2.5 rounded-lg border border-indigo-100 italic">
                      "{bot.greeting}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-indigo-100">
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span>Instant Contextual Chat</span>
                    </div>

                    <button
                      id={`start-ai-chat-btn-${bot.id}`}
                      onClick={() => handleStartChatbot(bot)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Chat with {bot.name.split(" ")[0]}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Inside Live Speaking Room / AI Chatbot */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main Live Chat & Audio Stream */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col h-[660px] overflow-hidden">
            {/* Room Header & Controls */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={selectedRoom.partner.avatar}
                    alt={selectedRoom.partner.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                  />
                  {partnerSpeaking && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>{selectedRoom.partner.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal">({selectedRoom.partner.country})</span>
                    {partnerSpeaking && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded animate-pulse">
                        Speaking...
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">{selectedRoom.title}</p>
                </div>
              </div>

              {/* Speed & Audio Settings Bar */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (partnerSpeaking) audioSpeech.stopSpeaking();
                    setAutoPlayAudio(!autoPlayAudio);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center space-x-1 transition cursor-pointer ${
                    autoPlayAudio
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                  title={autoPlayAudio ? "Auto-speak audio on" : "Auto-speak audio off (fast text mode)"}
                >
                  {autoPlayAudio ? <Volume2 className="w-3.5 h-3.5 text-blue-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                  <span className="hidden sm:inline">{autoPlayAudio ? "Voice On" : "Text Only"}</span>
                </button>

                <select
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-1.5 rounded-lg focus:outline-hidden"
                  title="Voice Speech Speed"
                >
                  <option value={0.85}>0.85x (Slow)</option>
                  <option value={0.95}>0.95x (Normal)</option>
                  <option value={1.15}>1.15x (Fast)</option>
                </select>

                <button
                  id="leave-speaking-room-btn"
                  onClick={handleLeaveRoom}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Leave
                </button>
              </div>
            </div>

            {/* Conversation Messages Transcript */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
              {messages.map((msg) => {
                if (msg.sender === "system") {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="text-[11px] bg-slate-200/80 text-slate-700 px-3 py-1 rounded-full font-medium inline-flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>{msg.text}</span>
                      </span>
                    </div>
                  );
                }

                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                      {msg.senderName} • {msg.timestamp}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed shadow-xs flex items-start space-x-2 ${
                        isUser
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                      }`}
                    >
                      <p className="flex-1">{msg.text}</p>
                      {!isUser && (
                        <button
                          onClick={() => {
                            setPartnerSpeaking(true);
                            audioSpeech.speak(msg.text, {
                              rate: speechRate,
                              onEnd: () => setPartnerSpeaking(false)
                            });
                          }}
                          className="text-slate-400 hover:text-blue-600 p-1 shrink-0 cursor-pointer"
                          title="Listen to phrase"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {isPartnerResponding && (
                <div className="flex items-center space-x-2 text-xs text-blue-600 p-2 font-medium bg-blue-50/60 rounded-xl w-fit">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>{selectedRoom.partner.name} is formulating a response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Speaking Input Bar */}
            <div className="p-4 border-t border-slate-200 bg-white space-y-3">
              {/* Spoken transcription interim preview */}
              {isRecording && (
                <div className="text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-900 flex items-center justify-between animate-pulse">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-rose-600" />
                    <span>Listening to your voice: <strong>"{spokenText || "Start speaking into mic..."}"</strong></span>
                  </div>
                  <button
                    onClick={handleToggleRecord}
                    className="bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer"
                  >
                    Done Speaking
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                {/* Hold / Toggle to speak button */}
                <button
                  id="lounge-mic-toggle-btn"
                  onClick={handleToggleRecord}
                  className={`p-3 rounded-xl flex items-center justify-center transition cursor-pointer ${
                    isRecording
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-500/30 animate-pulse"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                  title={isRecording ? "Stop Voice Input" : "Speak via Microphone"}
                >
                  {isRecording ? <Square className="w-5 h-5 fill-white" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text input fallback */}
                <input
                  type="text"
                  value={spokenText}
                  onChange={(e) => setSpokenText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isPartnerResponding && handleSendTurn()}
                  placeholder={`Speak into mic or type your answer to ${selectedRoom.partner.name.split(" ")[0]}...`}
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />

                <button
                  id="lounge-send-turn-btn"
                  disabled={!spokenText.trim() || isPartnerResponding}
                  onClick={() => handleSendTurn()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition cursor-pointer shadow-xs flex items-center space-x-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Speaking Coach, Dynamic Suggested Replies & Idioms */}
          <div className="space-y-4">
            {/* Suggested Conversational Replies (Reacts directly to what was asked) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Suggested Replies (Tap to Send)</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">Smart AI suggestions</span>
              </div>
              <div className="space-y-2">
                {suggestedReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    disabled={isPartnerResponding}
                    onClick={() => handleSendTurn(reply)}
                    className="w-full text-left text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 p-2.5 rounded-xl text-slate-700 hover:text-blue-900 transition flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    <span className="line-clamp-2">"{reply}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time AI Coach Critique */}
            {aiCritique && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-5 shadow-xs space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Speaking Coach Live Tip</span>
                </h4>
                <p className="text-xs text-indigo-950 leading-relaxed">{aiCritique}</p>
                {vocabBonus && (
                  <div className="text-[11px] bg-white p-2.5 rounded-lg border border-indigo-100 text-indigo-900 mt-2 font-medium">
                    🌟 {vocabBonus}
                  </div>
                )}
              </div>
            )}

            {/* Live Session Progress Tracker */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Session Speaking Goals</span>
                </span>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {turnCount} Turns
                </span>
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center space-x-2">
                  <Check className={`w-3.5 h-3.5 ${turnCount >= 2 ? "text-emerald-600 font-bold" : "text-slate-300"}`} />
                  <span className={turnCount >= 2 ? "text-slate-900 font-semibold" : ""}>
                    Exchange at least 2 conversational turns
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className={`w-3.5 h-3.5 ${turnCount >= 4 ? "text-emerald-600 font-bold" : "text-slate-300"}`} />
                  <span className={turnCount >= 4 ? "text-slate-900 font-semibold" : ""}>
                    Exchange 4+ turns for speaking fluency bonus
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>React directly to partner's questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
