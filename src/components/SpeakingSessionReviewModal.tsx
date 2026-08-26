import React, { useState } from "react";
import { SpeakingSessionLog } from "../types";
import { gradeSpeakingSession } from "../utils/storage";
import { audioSpeech } from "../utils/audioSpeech";
import {
  X,
  MessageSquare,
  Volume2,
  CheckCircle2,
  Sparkles,
  Award,
  Clock,
  User,
  Bot,
  Calendar,
  Layers,
  ChevronRight,
  Send
} from "lucide-react";

interface SpeakingSessionReviewModalProps {
  session: SpeakingSessionLog;
  onClose: () => void;
  onGraded: () => void;
}

export const SpeakingSessionReviewModal: React.FC<SpeakingSessionReviewModalProps> = ({
  session,
  onClose,
  onGraded
}) => {
  const [feedback, setFeedback] = useState(session.teacherFeedback || "");
  const [grade, setGrade] = useState(session.teacherGrade || "A");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);

  const handlePlayMessageAudio = (msgId: string, text: string) => {
    setCurrentlyPlayingMsgId(msgId);
    audioSpeech.speak(text, {
      rate: 0.95,
      onEnd: () => setCurrentlyPlayingMsgId(null)
    });
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    gradeSpeakingSession(session.id, grade, feedback);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onGraded();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold leading-tight">{session.roomTitle}</h3>
                <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-md uppercase">
                  {session.level}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Scenario: <strong>{session.scenario || session.roomTitle}</strong> • Topic: {session.topic || session.roomTopic}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: 2 Column Layout (Conversation Log & Teacher Grading) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-y-auto">
          {/* Left Column: Conversation Transcript */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-4 overflow-y-auto max-h-[60vh] lg:max-h-[68vh] bg-slate-50/50">
            {/* Session Metadata Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center space-x-1.5 font-bold text-slate-900">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Student: {session.studentName} (@{session.studentUsername})</span>
                </span>
                <span className="flex items-center space-x-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{session.updatedAt || session.startedAt}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                <span>Partner: <strong>{session.partnerName}</strong> ({session.partnerCountry})</span>
                <span>Turns Recorded: <strong>{session.turnCount}</strong></span>
              </div>
            </div>

            {/* AI Real-Time Critique Highlight */}
            {session.aiCritiqueSummary && (
              <div className="bg-purple-50/80 border border-purple-200 p-3.5 rounded-2xl text-xs space-y-1 text-purple-950">
                <div className="flex items-center space-x-1.5 font-bold text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Real-Time Speaking Analysis</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed italic">
                  "{session.aiCritiqueSummary}"
                </p>
              </div>
            )}

            {/* Message Flow */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Conversation Transcript ({session.messages.length} messages)
              </h4>

              {session.messages.map((msg) => {
                const isStudent = msg.sender === "user";
                const isSystem = msg.sender === "system";

                if (isSystem) {
                  return (
                    <div
                      key={msg.id}
                      className="text-center text-[11px] text-slate-400 italic py-1 bg-slate-100 rounded-lg"
                    >
                      {msg.text}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStudent ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1 px-1">
                      {isStudent ? (
                        <>
                          <span className="font-bold text-blue-700">{session.studentName}</span>
                          <span>• {msg.timestamp}</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-indigo-600" />
                          <span className="font-bold text-slate-700">{session.partnerName}</span>
                          <span>• {msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] text-xs leading-relaxed shadow-xs flex items-start space-x-2 ${
                        isStudent
                          ? "bg-blue-600 text-white rounded-tr-xs"
                          : "bg-white text-slate-900 border border-slate-200 rounded-tl-xs"
                      }`}
                    >
                      <p className="flex-1 whitespace-pre-wrap">{msg.text}</p>
                      <button
                        onClick={() => handlePlayMessageAudio(msg.id, msg.text)}
                        className={`p-1 rounded-md transition shrink-0 cursor-pointer ${
                          isStudent
                            ? "hover:bg-blue-700 text-blue-100"
                            : "hover:bg-slate-100 text-slate-500"
                        } ${currentlyPlayingMsgId === msg.id ? "text-amber-300 animate-pulse" : ""}`}
                        title="Listen to speech"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Teacher Evaluation & Feedback */}
          <div className="lg:col-span-5 p-6 space-y-5 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Teacher Evaluation & Speaking Grade</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluate vocabulary usage, grammar accuracy, and conversational fluency.
                </p>
              </div>

              <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
                {/* Grade Selection */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Speaking Performance Grade
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {["A+", "A", "B", "C", "Needs Practice"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        className={`py-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                          grade === g
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Feedback Snippets */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Quick Comments:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Great natural phrasing and turn-taking!",
                      "Accurate use of grammar & target tense.",
                      "Clear pronunciation and confident responses.",
                      "Try to expand answers with reasons (because...).",
                      "Watch out for subject-verb agreement."
                    ].map((snippet, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFeedback(snippet)}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded-lg transition cursor-pointer text-left"
                      >
                        + {snippet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Written Feedback */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Instructor Written Feedback
                  </label>
                  <textarea
                    rows={5}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback for the student to read on their speaking progress..."
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs text-slate-900 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Speaking Feedback Saved!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Save & Publish Speaking Grade</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Pedagogical Guidance Tip */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500">
              💡 <strong>Pedagogical tip:</strong> Highlighting both conversational strengths and 1 concrete correction builds student confidence in real peer rooms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
