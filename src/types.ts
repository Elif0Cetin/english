export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "Advanced";
export type UserRole = "student" | "teacher";

export interface UserAccount {
  username: string;
  passwordHash?: string;
  role: UserRole;
  profileId: string;
  createdAt: string;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  description: string;
  targetLevel: CEFRLevel | "All";
  type: "photo_submission" | "quiz" | "pronunciation" | "speaking" | "general";
  allowPhotoUpload?: boolean;
  topicId?: string;
  dueDate?: string;
  assignedBy: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentUsername: string;
  studentAvatar: string;
  photoDataUrl: string; // Base64 data URL (JPG/PNG)
  fileType: "image/jpeg" | "image/png" | string;
  fileName: string;
  fileSizeBytes: number;
  studentNote?: string;
  submittedAt: string;
  status: "pending" | "reviewed";
  teacherFeedback?: string;
  teacherGrade?: string;
  reviewedAt?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: UserRole;
  avatarUrl: string;
  authProvider: "username" | "google" | "email" | "guest" | "github";
  level: CEFRLevel;
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDays: string[]; // ['2026-08-20', '2026-08-21', ...]
  dailyGoalMinutes: number;
  minutesSpentToday: number;
  completedLessons: string[]; // lesson ids
  completedQuizzes: { [quizId: string]: QuizScoreRecord };
  completedAssignments?: string[]; // assignment ids
  unlockedAdvanced: boolean;
  earnedBadges: string[];
  skills: {
    grammar: number; // 0 - 100
    vocabulary: number;
    speaking: number;
    listening: number;
    pronunciation: number;
  };
}

export interface QuizScoreRecord {
  score: number; // 0 - 100
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
  level: CEFRLevel;
}

export interface GrammarTopic {
  id: string;
  title: string;
  level: CEFRLevel;
  category: "Grammar" | "Vocabulary" | "Practical Speaking" | "Business/Formal";
  description: string;
  estimatedMinutes: number;
  iconName: string;
  isMandatoryForAdvance: boolean;
  overview: {
    explanation: string;
    rules: string[];
    examples: { sentence: string; translation?: string; note?: string }[];
    commonMistakes: { wrong: string; correct: string; reason: string }[];
  };
  quiz: QuizQuestion[];
  pronunciationSentences: PronunciationSentence[];
}

export interface PronunciationSentence {
  id: string;
  text: string;
  phoneticHints: string;
  focusSound: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export type QuestionType = "multiple-choice" | "fill-in-blank" | "sentence-order" | "error-identification";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[]; // string or array for order
  explanation: string;
  contextSentence?: string;
  hint?: string;
}

export interface PronunciationResult {
  score: number;
  accuracyScore: number;
  fluencyScore: number;
  phoneticAnalysis: string;
  feedback: string;
  wordBreakdown: {
    word: string;
    status: "correct" | "minor_error" | "needs_practice";
    phoneticTip: string;
  }[];
  cefrLevelAssessed: string;
  audioDrillTip: string;
}

export interface PeerRoom {
  id: string;
  title: string;
  topic: string;
  level: CEFRLevel;
  scenario: string;
  activeParticipants: number;
  maxParticipants: number;
  partner: {
    name: string;
    avatar: string;
    country: string;
    level: CEFRLevel;
    accent: string;
    bio: string;
  };
  prompts: string[];
  suggestedPhrases: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "partner" | "system" | "ai_coach";
  senderName: string;
  text: string;
  timestamp: string;
  audioGenerated?: boolean;
  critique?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "streak" | "accuracy" | "level" | "speaking" | "game";
  unlockedAt?: string;
  targetCount: number;
  currentCount?: number;
}

export interface SpeakingSessionLog {
  id: string;
  studentId: string;
  studentName: string;
  studentUsername: string;
  studentAvatar: string;
  roomId: string;
  roomTitle: string;
  roomTopic: string;
  scenario?: string;
  topic?: string;
  partnerName: string;
  partnerCountry: string;
  level: CEFRLevel;
  messages: ChatMessage[];
  startedAt: string;
  updatedAt: string;
  turnCount: number;
  aiCritiqueSummary?: string;
  teacherGrade?: string;
  teacherFeedback?: string;
  teacherReviewedAt?: string;
}
