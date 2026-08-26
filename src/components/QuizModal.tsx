import React, { useState, useEffect, useRef } from "react";
import { GrammarTopic, QuizQuestion, CEFRLevel, UserProfile } from "../types";
import { recordQuizCompletion } from "../utils/storage";
import { audioSpeech } from "../utils/audioSpeech";
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Volume2,
  Award,
  RotateCcw,
  BookOpen,
  Loader2,
  Lightbulb,
  ShieldAlert,
  Lock,
  EyeOff
} from "lucide-react";

interface QuizModalProps {
  topic: GrammarTopic;
  user: UserProfile;
  onClose: () => void;
  onQuizCompleted: (updatedProfile: UserProfile, newlyUnlocked: boolean, newBadges: string[]) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  topic,
  user,
  onClose,
  onQuizCompleted
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSecurityAlert = (message: string) => {
    setSecurityWarning(message);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    warningTimeoutRef.current = setTimeout(() => {
      setSecurityWarning(null);
    }, 3500);
  };

  // Anti-Cheat & Screen Protection Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        triggerSecurityAlert("⚠️ Screenshots and screen captures are blocked during quizzes.");
        return;
      }

      // Block Ctrl+C, Cmd+C (Copy)
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        triggerSecurityAlert("🔒 Copying questions to external AI tools is strictly disabled.");
        return;
      }

      // Block Ctrl+P, Cmd+P (Print / PDF)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        triggerSecurityAlert("🔒 Printing or PDF exporting is prohibited during the test.");
        return;
      }

      // Block Ctrl+S, Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        return;
      }

      // Block Devtools inspect shortcuts
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
        e.preventDefault();
        triggerSecurityAlert("🔒 Developer tools and page inspection are restricted.");
        return;
      }
    };

    const handleWindowBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleWindowFocus = () => {
      setIsWindowBlurred(false);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, []);

  // AI Personalized Feedback State
  const [isLoadingAiFeedback, setIsLoadingAiFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{
    summary: string;
    grammarRule: string;
    commonMistake: string;
    mnemonicTip: string;
    exampleSentence: string;
  } | null>(null);

  const currentQ: QuizQuestion = topic.quiz[currentIdx];
  const isLastQuestion = currentIdx === topic.quiz.length - 1;

  // Handle TTS for question
  const speakQuestion = () => {
    audioSpeech.speak(currentQ.question);
  };

  // Check correctness
  const isCurrentCorrect = (): boolean => {
    if (currentQ.type === "sentence-order") {
      const correctArr = currentQ.correctAnswer as string[];
      return orderedWords.join(" ") === correctArr.join(" ");
    }
    return selectedOption === currentQ.correctAnswer;
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const correct = isCurrentCorrect();
    if (correct) {
      audioSpeech.playSuccessSound();
      setScore((prev) => prev + 1);
    } else {
      audioSpeech.playIncorrectSound();
    }
  };

  // Fetch AI Pedagogical Breakdown from Server Gemini Route
  const handleFetchAiFeedback = async () => {
    setIsLoadingAiFeedback(true);
    try {
      const correct = isCurrentCorrect();
      const userAns = currentQ.type === "sentence-order" ? orderedWords.join(" ") : selectedOption || "None";
      const correctAns = Array.isArray(currentQ.correctAnswer)
        ? currentQ.correctAnswer.join(" ")
        : currentQ.correctAnswer;

      const res = await fetch("/api/gemini/quiz-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.title,
          question: currentQ.question,
          selectedAnswer: userAns,
          correctAnswer: correctAns,
          isCorrect: correct,
          level: topic.level
        })
      });

      if (!res.ok) throw new Error("Failed to get feedback");
      const data = await res.json();
      setAiFeedback(data);
    } catch (e) {
      console.error(e);
      setAiFeedback({
        summary: "Notice the grammatical pattern and subject-verb agreement.",
        grammarRule: topic.overview.explanation,
        commonMistake: "Mixing up time expressions and auxiliary forms.",
        mnemonicTip: "Always check the subject and timeframe first.",
        exampleSentence: topic.overview.examples[0]?.sentence || "She has worked here for two years."
      });
    } finally {
      setIsLoadingAiFeedback(false);
    }
  };

  // Move to next question or complete
  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setOrderedWords([]);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setAiFeedback(null);
    } else {
      // Calculate final percentage score
      const finalScorePct = Math.round(((score + (isCurrentCorrect() ? 1 : 0)) / topic.quiz.length) * 100);
      const { profile, newlyUnlockedAdvanced, newBadges } = recordQuizCompletion(
        topic.id,
        finalScorePct,
        topic.quiz.length,
        score + (isCurrentCorrect() ? 1 : 0),
        topic.level
      );

      if (finalScorePct >= 70) {
        audioSpeech.playMilestoneSound();
      }

      setIsFinished(true);
      onQuizCompleted(profile, newlyUnlockedAdvanced, newBadges);
    }
  };

  // Sentence order helpers
  const handleWordClick = (word: string) => {
    if (isAnswerSubmitted) return;
    if (orderedWords.includes(word)) {
      setOrderedWords(orderedWords.filter((w) => w !== word));
    } else {
      setOrderedWords([...orderedWords, word]);
    }
  };

  // Completion screen
  if (isFinished) {
    const finalPct = Math.round((score / topic.quiz.length) * 100);
    const passed = finalPct >= 70;

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-lg ${
              passed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            {passed ? "🏆" : "💪"}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {passed ? "Quiz Successfully Completed!" : "Good Effort! Keep Practicing"}
            </h2>
            <p className="text-xs text-slate-500">
              Topic: <strong className="text-slate-800">{topic.title}</strong> ({topic.level})
            </p>
          </div>

          {/* Score card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-3 gap-3">
            <div>
              <div className="text-2xl font-black text-blue-600">{finalPct}%</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {score}/{topic.quiz.length}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-500">+{Math.round((finalPct / 100) * 50) + 20}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">XP Earned</div>
            </div>
          </div>

          {passed ? (
            <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              ✨ Great job! This score counts toward unlocking the Advanced C1 Grammar Vault.
            </p>
          ) : (
            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
              Score 70% or higher to count this topic toward unlocking the Advanced Vault.
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrentIdx(0);
                setSelectedOption(null);
                setOrderedWords([]);
                setIsAnswerSubmitted(false);
                setScore(0);
                setIsFinished(false);
                setAiFeedback(null);
              }}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Continue Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        triggerSecurityAlert("🔒 Right-click and context actions are disabled during tests.");
      }}
      onCopy={(e) => {
        e.preventDefault();
        triggerSecurityAlert("🔒 Copying quiz text is disabled to maintain exam integrity.");
      }}
      onCut={(e) => {
        e.preventDefault();
        triggerSecurityAlert("🔒 Text cutting is disabled during tests.");
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none print:hidden"
      style={{
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none"
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Floating Security Alert Toast */}
        {securityWarning && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center space-x-2 border border-slate-700 animate-in fade-in slide-in-from-top-3 duration-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{securityWarning}</span>
          </div>
        )}

        {/* Focus Loss Overlay (Discourages Window Switching & External AI Captures) */}
        {isWindowBlurred && (
          <div className="absolute inset-0 z-40 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
            <EyeOff className="w-12 h-12 text-amber-400" />
            <h4 className="text-lg font-bold">Quiz Screen Protected</h4>
            <p className="text-xs text-slate-300 max-w-xs">
              Window focus lost. Please click back inside this window to continue your English test.
            </p>
            <button
              onClick={() => setIsWindowBlurred(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            >
              Resume Quiz
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
              {topic.level}
            </span>
            <span className="text-xs font-bold text-slate-700 truncate max-w-[160px] sm:max-w-xs">
              {topic.title}
            </span>
            <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-2.5 h-2.5" />
              <span>Anti-Copy Shield Active</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold text-slate-500">
              Question {currentIdx + 1} of {topic.quiz.length}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / topic.quiz.length) * 100}%` }}
          />
        </div>

        {/* Question Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
              <button
                onClick={speakQuestion}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition shrink-0 cursor-pointer"
                title="Listen to question"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {currentQ.hint && !showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-amber-700 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Show grammatical hint</span>
              </button>
            )}

            {showHint && currentQ.hint && (
              <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg">
                💡 <strong>Hint:</strong> {currentQ.hint}
              </div>
            )}
          </div>

          {/* Options: Multiple Choice / Fill in Blank / Error identification */}
          {currentQ.options && currentQ.type !== "sentence-order" && (
            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrectOpt = opt === currentQ.correctAnswer;

                let optionStyles = "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30";
                if (isSelected) {
                  optionStyles = "border-blue-600 bg-blue-50/60 text-blue-900 font-semibold";
                }
                if (isAnswerSubmitted) {
                  if (isCorrectOpt) {
                    optionStyles = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                  } else if (isSelected && !isCorrectOpt) {
                    optionStyles = "border-rose-500 bg-rose-50 text-rose-900 line-through";
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${optionStyles}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrectOpt && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectOpt && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Sentence Reassembly (Order Words) */}
          {currentQ.type === "sentence-order" && (
            <div className="space-y-4">
              {/* Selected / Built Sentence Area */}
              <div className="min-h-[56px] p-3.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-wrap gap-2 items-center">
                {orderedWords.length === 0 ? (
                  <span className="text-xs text-slate-400">Tap words below in the correct order...</span>
                ) : (
                  orderedWords.map((word, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleWordClick(word)}
                      className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs hover:bg-blue-700 cursor-pointer"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Pool of Available Words */}
              <div className="flex flex-wrap gap-2">
                {(currentQ.correctAnswer as string[])
                  .slice()
                  .sort()
                  .map((word, idx) => {
                    const isUsed = orderedWords.includes(word);
                    return (
                      <button
                        key={idx}
                        disabled={isUsed || isAnswerSubmitted}
                        onClick={() => handleWordClick(word)}
                        className={`text-xs font-semibold px-3 py-2 rounded-lg border transition ${
                          isUsed
                            ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                            : "bg-white text-slate-800 border-slate-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Feedback & AI Explanation Section when submitted */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-200 ${
                isCurrentCorrect()
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-rose-50/70 border-rose-200"
              }`}
            >
              <div className="flex items-start space-x-2">
                {isCurrentCorrect() ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    {isCurrentCorrect() ? "Correct Answer!" : "Incorrect"}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>

              {/* Button to request personalized Gemini AI Pedagogical explanation */}
              {!aiFeedback && (
                <button
                  onClick={handleFetchAiFeedback}
                  disabled={isLoadingAiFeedback}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  {isLoadingAiFeedback ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  )}
                  <span>{isLoadingAiFeedback ? "Analyzing with Gemini AI..." : "Get AI Pedagogical Breakdown"}</span>
                </button>
              )}

              {/* Gemini AI breakdown card */}
              {aiFeedback && (
                <div className="bg-white p-4 rounded-xl border border-purple-200 space-y-2.5 text-xs text-slate-800 shadow-xs">
                  <div className="font-bold text-purple-900 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Gemini AI Tutor Insights</span>
                  </div>
                  <p className="italic text-slate-700">"{aiFeedback.summary}"</p>
                  <div>
                    <strong className="text-slate-900">Grammar Rule:</strong> {aiFeedback.grammarRule}
                  </div>
                  <div>
                    <strong className="text-amber-800">Common Pitfall:</strong> {aiFeedback.commonMistake}
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg text-purple-950">
                    💡 <strong>Memory Tip:</strong> {aiFeedback.mnemonicTip}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <strong>Example:</strong> "{aiFeedback.exampleSentence}"
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Exit Quiz
          </button>

          {!isAnswerSubmitted ? (
            <button
              disabled={
                currentQ.type === "sentence-order"
                  ? orderedWords.length === 0
                  : !selectedOption
              }
              onClick={handleSubmitAnswer}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{isLastQuestion ? "Finish Quiz" : "Next Question"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
