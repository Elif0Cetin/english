import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { audioSpeech } from "../utils/audioSpeech";
import { triggerCelebrationConfetti } from "../utils/storage";
import {
  Gamepad2,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  Timer,
  Play,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Zap,
  Volume2
} from "lucide-react";

interface GameCenterProps {
  user: UserProfile;
  onAddXp: (amount: number) => void;
}

// B1 Vocabulary for Scramble
const SCRAMBLE_WORDS = [
  { word: "FLUENT", hint: "Able to speak or write a particular foreign language easily and accurately." },
  { word: "OPPORTUNITY", hint: "A set of circumstances that makes it possible to do something." },
  { word: "CONFIDENT", hint: "Feeling or showing certainty about something." },
  { word: "CHALLENGE", hint: "A call to take part in a contest or demanding task." },
  { word: "PRONUNCIATION", hint: "The way in which a word is spoken or articulated." },
  { word: "VOCABULARY", hint: "The body of words used in a particular language." },
  { word: "PERSISTENCE", hint: "Continuing firmly in a course of action in spite of difficulty." },
  { word: "EXPERIENCE", hint: "Practical contact with and observation of facts or events." }
];

// Collocations / Phrasal Verbs for Speed Match
const COLLOCATION_PAIRS = [
  { left: "Look forward", right: "to meeting you" },
  { left: "Run out", right: "of time" },
  { left: "Depend", right: "on the weather" },
  { left: "Take advantage", right: "of the opportunity" },
  { left: "Pay attention", right: "to details" },
  { left: "Make an effort", right: "to improve" }
];

export const GameCenter: React.FC<GameCenterProps> = ({ user, onAddXp }) => {
  const [activeGame, setActiveGame] = useState<"hub" | "scramble" | "match">("hub");

  // Word Scramble State
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [scrambleScore, setScrambleScore] = useState(0);
  const [scrambleTimer, setScrambleTimer] = useState(40);
  const [isScrambleOver, setIsScrambleOver] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Speed Match State
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [matchTimer, setMatchTimer] = useState(30);
  const [isMatchOver, setIsMatchOver] = useState(false);

  // Helper to shuffle letters
  const initScrambleWord = (index: number) => {
    const target = SCRAMBLE_WORDS[index % SCRAMBLE_WORDS.length].word;
    const shuffled = target
      .split("")
      .sort(() => Math.random() - 0.5);
    setScrambledLetters(shuffled);
    setUserLetters([]);
    setShowHint(false);
  };

  // Timer for Word Scramble
  useEffect(() => {
    let interval: any;
    if (activeGame === "scramble" && !isScrambleOver && scrambleTimer > 0) {
      interval = setInterval(() => {
        setScrambleTimer((prev) => {
          if (prev <= 1) {
            setIsScrambleOver(true);
            audioSpeech.playMilestoneSound();
            onAddXp(scrambleScore);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, isScrambleOver, scrambleTimer, scrambleScore]);

  // Timer for Speed Match
  useEffect(() => {
    let interval: any;
    if (activeGame === "match" && !isMatchOver && matchTimer > 0) {
      interval = setInterval(() => {
        setMatchTimer((prev) => {
          if (prev <= 1) {
            setIsMatchOver(true);
            audioSpeech.playMilestoneSound();
            onAddXp(matchScore);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, isMatchOver, matchTimer, matchScore]);

  // Handle Scramble Click
  const handlePickLetter = (letter: string, indexInScramble: number) => {
    setUserLetters([...userLetters, letter]);
    const newScrambled = [...scrambledLetters];
    newScrambled.splice(indexInScramble, 1);
    setScrambledLetters(newScrambled);

    const currentBuilt = [...userLetters, letter].join("");
    const target = SCRAMBLE_WORDS[scrambleIdx % SCRAMBLE_WORDS.length].word;

    if (currentBuilt === target) {
      audioSpeech.playSuccessSound();
      triggerCelebrationConfetti();
      setScrambleScore((s) => s + 50);
      setScrambleTimer((t) => t + 5); // Time bonus!
      setTimeout(() => {
        const nextIdx = scrambleIdx + 1;
        setScrambleIdx(nextIdx);
        initScrambleWord(nextIdx);
      }, 400);
    }
  };

  const handleRemoveUserLetter = (letter: string, indexInUser: number) => {
    setScrambledLetters([...scrambledLetters, letter]);
    const newUser = [...userLetters];
    newUser.splice(indexInUser, 1);
    setUserLetters(newUser);
  };

  // Start Scramble Game
  const startScramble = () => {
    setActiveGame("scramble");
    setScrambleIdx(0);
    setScrambleScore(0);
    setScrambleTimer(45);
    setIsScrambleOver(false);
    initScrambleWord(0);
  };

  // Start Speed Match Game
  const startMatch = () => {
    setActiveGame("match");
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchScore(0);
    setMatchTimer(35);
    setIsMatchOver(false);
  };

  // Match Click Handler
  const handleLeftClick = (left: string) => {
    if (matchedPairs.includes(left)) return;
    setSelectedLeft(left);
    if (selectedRight) {
      checkMatch(left, selectedRight);
    }
  };

  const handleRightClick = (right: string) => {
    const pair = COLLOCATION_PAIRS.find((p) => p.right === right);
    if (!pair || matchedPairs.includes(pair.left)) return;
    setSelectedRight(right);
    if (selectedLeft) {
      checkMatch(selectedLeft, right);
    }
  };

  const checkMatch = (left: string, right: string) => {
    const valid = COLLOCATION_PAIRS.some((p) => p.left === left && p.right === right);
    if (valid) {
      audioSpeech.playSuccessSound();
      setMatchedPairs([...matchedPairs, left]);
      setMatchScore((s) => s + 40);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (matchedPairs.length + 1 === COLLOCATION_PAIRS.length) {
        setIsMatchOver(true);
        triggerCelebrationConfetti();
        audioSpeech.playMilestoneSound();
        onAddXp(matchScore + 40);
      }
    } else {
      audioSpeech.playIncorrectSound();
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-semibold text-purple-200">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Gamified English Training Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Arcade & Streak Booster
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Play quick, high-energy games to build English vocabulary reflexes, collocation intuition, and earn extra XP.
          </p>
        </div>
      </div>

      {activeGame === "hub" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game 1: Word Scramble Sprint */}
          <div className="bg-white border border-slate-200 hover:border-purple-300 rounded-2xl p-6 shadow-xs space-y-5 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                🔤
              </div>
              <h3 className="text-lg font-bold text-slate-900">B1 Word Scramble Sprint</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unscramble intermediate vocabulary words before the timer runs out. Earn time bonuses and streak multipliers for consecutive correct answers!
              </p>
              <div className="flex items-center space-x-2 text-xs font-semibold text-purple-700">
                <Zap className="w-4 h-4" />
                <span>+50 XP per solved word + Time Bonus</span>
              </div>
            </div>

            <button
              id="start-scramble-btn"
              onClick={startScramble}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play Word Scramble</span>
            </button>
          </div>

          {/* Game 2: Speed Collocation Match */}
          <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-xs space-y-5 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-slate-900">Speed Collocation Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect essential B1 phrasal verbs and prepositions (e.g., 'look forward' + 'to meeting you') as fast as possible.
              </p>
              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700">
                <Zap className="w-4 h-4" />
                <span>+40 XP per perfect collocation match</span>
              </div>
            </div>

            <button
              id="start-match-btn"
              onClick={startMatch}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play Speed Match</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME 1 ACTIVE: Word Scramble */}
      {activeGame === "scramble" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-700">
              <Sparkles className="w-4 h-4" />
              <span>Word Scramble Sprint</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                <Timer className="w-4 h-4" />
                <span>{scrambleTimer}s</span>
              </div>
              <div className="text-xs font-black text-purple-900">Score: {scrambleScore} XP</div>
            </div>
          </div>

          {!isScrambleOver ? (
            <div className="space-y-6 text-center">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Word {scrambleIdx + 1}
                </span>
                <p className="text-xs text-slate-500 mt-1">Tap letters in correct spelling order:</p>
              </div>

              {/* Built letters slot */}
              <div className="min-h-[64px] bg-slate-50 border-2 border-dashed border-purple-200 rounded-2xl flex flex-wrap gap-2 items-center justify-center p-3">
                {userLetters.map((char, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveUserLetter(char, idx)}
                    className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold text-lg shadow-sm hover:bg-purple-700 cursor-pointer"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Available pool */}
              <div className="flex flex-wrap gap-2 justify-center">
                {scrambledLetters.map((char, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePickLetter(char, idx)}
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-900 font-extrabold text-lg border border-slate-200 hover:border-purple-400 shadow-xs cursor-pointer active:scale-95 transition"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Hint */}
              <div>
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-xs text-purple-700 font-bold hover:underline flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Show Meaning Hint</span>
                  </button>
                ) : (
                  <div className="text-xs bg-purple-50 text-purple-950 p-3 rounded-xl border border-purple-200 max-w-md mx-auto">
                    💡 <strong>Meaning:</strong> {SCRAMBLE_WORDS[scrambleIdx % SCRAMBLE_WORDS.length].hint}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold text-slate-900">Sprint Complete!</h3>
              <p className="text-xs text-slate-500">
                You earned <strong className="text-purple-700 font-bold">+{scrambleScore} XP</strong> for your daily streak progress.
              </p>
              <button
                onClick={() => setActiveGame("hub")}
                className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Back to Games Hub
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2 ACTIVE: Speed Collocation Match */}
      {activeGame === "match" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700">
              <Zap className="w-4 h-4" />
              <span>Speed Collocation Match</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                <Timer className="w-4 h-4" />
                <span>{matchTimer}s</span>
              </div>
              <div className="text-xs font-black text-blue-900">Score: {matchScore} XP</div>
            </div>
          </div>

          {!isMatchOver ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase text-center">Phrasal Verbs / Stems</h4>
                {COLLOCATION_PAIRS.map((pair, idx) => {
                  const isMatched = matchedPairs.includes(pair.left);
                  const isSelected = selectedLeft === pair.left;

                  return (
                    <button
                      key={idx}
                      disabled={isMatched}
                      onClick={() => handleLeftClick(pair.left)}
                      className={`w-full p-4 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        isMatched
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800 opacity-60 line-through"
                          : isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      {pair.left}
                    </button>
                  );
                })}
              </div>

              {/* Right column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase text-center">Complements / Particles</h4>
                {COLLOCATION_PAIRS.slice()
                  .reverse()
                  .map((pair, idx) => {
                    const isMatched = matchedPairs.includes(pair.left);
                    const isSelected = selectedRight === pair.right;

                    return (
                      <button
                        key={idx}
                        disabled={isMatched}
                        onClick={() => handleRightClick(pair.right)}
                        className={`w-full p-4 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                          isMatched
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 opacity-60 line-through"
                            : isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        {pair.right}
                      </button>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="text-4xl">🏆</div>
              <h3 className="text-xl font-bold text-slate-900">Collocation Master!</h3>
              <p className="text-xs text-slate-500">
                You matched all collocations and earned <strong className="text-blue-700 font-bold">+{matchScore} XP</strong>.
              </p>
              <button
                onClick={() => setActiveGame("hub")}
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Back to Games Hub
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
