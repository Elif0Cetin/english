import { Badge } from "../types";

export const BADGES_DATA: Badge[] = [
  {
    id: "badge-first-step",
    title: "First Spark",
    description: "Complete your very first English grammar quiz.",
    icon: "Sparkles",
    category: "level",
    targetCount: 1
  },
  {
    id: "badge-streak-3",
    title: "On Fire (3-Day Streak)",
    description: "Practice English for 3 consecutive days without breaking your streak.",
    icon: "Flame",
    category: "streak",
    targetCount: 3
  },
  {
    id: "badge-streak-7",
    title: "Weekly Champion (7-Day Streak)",
    description: "Maintain a solid 7-day study habit.",
    icon: "Award",
    category: "streak",
    targetCount: 7
  },
  {
    id: "badge-a1-master",
    title: "A1 Foundation Master",
    description: "Pass all mandatory A1 level quizzes with an 80%+ score.",
    icon: "CheckCircle2",
    category: "level",
    targetCount: 2
  },
  {
    id: "badge-a2-master",
    title: "A2 Elementary Conqueror",
    description: "Pass all mandatory A2 level quizzes.",
    icon: "Target",
    category: "level",
    targetCount: 2
  },
  {
    id: "badge-b1-master",
    title: "B1 Intermediate Pioneer",
    description: "Complete all B1 Core Intermediate quizzes to unlock the Advanced Vault!",
    icon: "Trophy",
    category: "level",
    targetCount: 4
  },
  {
    id: "badge-speech-pro",
    title: "Silver Tongue",
    description: "Score 85%+ on 5 AI Pronunciation speech evaluations.",
    icon: "Mic",
    category: "speaking",
    targetCount: 5
  },
  {
    id: "badge-social-butterfly",
    title: "Peer Conversationalist",
    description: "Exchange 10+ turns in live Peer-to-Peer Speaking Lounge.",
    icon: "Users",
    category: "speaking",
    targetCount: 10
  },
  {
    id: "badge-game-wizard",
    title: "Word Scramble Ace",
    description: "Score over 500 points in English vocabulary mini-games.",
    icon: "Gamepad2",
    category: "game",
    targetCount: 500
  }
];
