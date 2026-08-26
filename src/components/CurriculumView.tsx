import React, { useState } from "react";
import { UserProfile, CEFRLevel, GrammarTopic } from "../types";
import { LESSONS_DATA, CEFR_LEVEL_METRICS } from "../data/lessonsData";
import { audioSpeech } from "../utils/audioSpeech";
import {
  Lock,
  Unlock,
  CheckCircle2,
  Play,
  Volume2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Mic,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from "lucide-react";

interface CurriculumViewProps {
  user: UserProfile;
  selectedTopicId?: string;
  onOpenQuiz: (topicId: string) => void;
  onOpenPronunciation: (sentenceText?: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  user,
  selectedTopicId,
  onOpenQuiz,
  onOpenPronunciation
}) => {
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>("ALL");
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(selectedTopicId || "b1-present-perfect-simple");

  const mandatoryTopics = LESSONS_DATA.filter((l) => l.isMandatoryForAdvance);
  const completedMandatoryCount = mandatoryTopics.filter((t) => {
    const res = user.completedQuizzes[t.id];
    return res && res.score >= 70;
  }).length;

  const filteredTopics = LESSONS_DATA.filter((topic) => {
    if (activeLevelFilter === "ALL") return true;
    return topic.level === activeLevelFilter;
  });

  const handleSpeak = (text: string) => {
    audioSpeech.speak(text, { rate: 0.9 });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & CEFR Level Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Structured English Curriculum
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Master grammar rules step-by-step from A1 to B1, and unlock the Advanced C1 level.
            </p>
          </div>

          {/* Level Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {["ALL", "A1", "A2", "B1", "Advanced"].map((lvl) => {
              const isActive = activeLevelFilter === lvl;
              const isAdvanced = lvl === "Advanced";
              return (
                <button
                  key={lvl}
                  id={`filter-level-${lvl}`}
                  onClick={() => setActiveLevelFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                    isActive
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>{lvl}</span>
                  {isAdvanced && !user.unlockedAdvanced && <Lock className="w-3 h-3 text-slate-400" />}
                  {isAdvanced && user.unlockedAdvanced && <Unlock className="w-3 h-3 text-purple-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unlock Alert Banner if Advanced is locked */}
        {!user.unlockedAdvanced && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-900 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-900 block">
                Advanced Level Lock Notice ({completedMandatoryCount}/{mandatoryTopics.length} Completed)
              </strong>
              <span>
                To ensure a rock-solid foundation, Advanced C1 topics (Grammatical Inversion, Mixed Conditionals) remain locked until all mandatory A1, A2, and B1 quizzes have been passed with 70%+ score.
              </span>
            </div>
          </div>
        )}

        {user.unlockedAdvanced && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start space-x-3 text-purple-900 text-xs">
            <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-purple-900 block">
                👑 Advanced C1 Mastery Unlocked!
              </strong>
              <span>
                Congratulations on mastering the foundational levels! You now have access to high-level stylistic inversions and nuanced mixed conditionals.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Topics List */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const isLocked = topic.level === "Advanced" && !user.unlockedAdvanced;
          const quizResult = user.completedQuizzes[topic.id];
          const isPassed = quizResult && quizResult.score >= 70;
          const isExpanded = expandedTopicId === topic.id;

          return (
            <div
              key={topic.id}
              id={`topic-card-${topic.id}`}
              className={`bg-white border rounded-2xl transition overflow-hidden shadow-xs ${
                isLocked
                  ? "border-slate-200 bg-slate-50/70 opacity-80"
                  : isPassed
                  ? "border-emerald-200 hover:border-emerald-300"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              {/* Card Header Row */}
              <div
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                onClick={() => !isLocked && setExpandedTopicId(isExpanded ? null : topic.id)}
              >
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isLocked
                        ? "bg-slate-200 text-slate-500"
                        : isPassed
                        ? "bg-emerald-100 text-emerald-700 font-bold"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          topic.level === "A1"
                            ? "bg-emerald-100 text-emerald-800"
                            : topic.level === "A2"
                            ? "bg-cyan-100 text-cyan-800"
                            : topic.level === "B1"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {topic.level}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{topic.category}</span>
                      {topic.isMandatoryForAdvance && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                          Prerequisite
                        </span>
                      )}
                      {isPassed && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                          Passed ({quizResult.score}%)
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{topic.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{topic.description}</p>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center space-x-3 self-end sm:self-center">
                  {!isLocked && (
                    <>
                      <button
                        id={`take-quiz-btn-${topic.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQuiz(topic.id);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-xs cursor-pointer ${
                          isPassed
                            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isPassed ? "Retake Quiz" : "Take Quiz"}</span>
                      </button>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </>
                  )}
                  {isLocked && (
                    <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-lg flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Lesson Theory & Practice Area */}
              {isExpanded && !isLocked && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6">
                  {/* Overview explanation */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Grammar Core Concept
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                      {topic.overview.explanation}
                    </p>
                  </div>

                  {/* Rules list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>Key Rules & Form</span>
                      </h4>
                      <ul className="space-y-2">
                        {topic.overview.rules.map((rule, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Pitfalls & Mistakes */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-rose-900 flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span>Common Traps for Intermediate Learners</span>
                      </h4>
                      <div className="space-y-2.5">
                        {topic.overview.commonMistakes.map((mistake, idx) => (
                          <div key={idx} className="text-xs bg-rose-50/70 p-2.5 rounded-lg border border-rose-100">
                            <div className="text-rose-800 line-through">❌ {mistake.wrong}</div>
                            <div className="text-emerald-800 font-bold mt-0.5">✅ {mistake.correct}</div>
                            <p className="text-[11px] text-slate-600 mt-1">{mistake.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Real Examples with Audio */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      <span>Natural Example Sentences (Click to Listen)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {topic.overview.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSpeak(ex.sentence)}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition cursor-pointer group"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                              "{ex.sentence}"
                            </div>
                            {ex.note && <div className="text-[11px] text-slate-500 mt-0.5">{ex.note}</div>}
                          </div>
                          <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pronunciation sentences drill link */}
                  {topic.pronunciationSentences.length > 0 && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-indigo-950">AI Pronunciation & Intonation Drill</h5>
                          <p className="text-[11px] text-indigo-700">
                            Practice speaking "{topic.pronunciationSentences[0].text}" with instant phoneme feedback.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenPronunciation(topic.pronunciationSentences[0].text)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition shrink-0 cursor-pointer"
                      >
                        Launch Speech Lab
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
