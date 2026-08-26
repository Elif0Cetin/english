import { UserProfile, CEFRLevel, QuizScoreRecord, UserAccount, TeacherAssignment, AssignmentSubmission, SpeakingSessionLog } from "../types";
import { LESSONS_DATA } from "../data/lessonsData";
import { syncUserProfileToSupabase } from "../lib/supabase";
import confetti from "canvas-confetti";

const ACTIVE_USER_ID_KEY = "linguastep_active_user_id_v3";
const ACCOUNTS_STORAGE_KEY = "linguastep_accounts_v3";
const PROFILES_STORAGE_KEY = "linguastep_profiles_v3";
const ASSIGNMENTS_STORAGE_KEY = "linguastep_assignments_v3";
const SUBMISSIONS_STORAGE_KEY = "linguastep_assignment_submissions_v3";
const SPEAKING_SESSIONS_STORAGE_KEY = "linguastep_speaking_sessions_v3";

// Master Teacher Secret Config
export const MASTER_TEACHER_USERNAME = "teacher_elif";
export const MASTER_TEACHER_PASSWORD = "Teacher2026!";
export const MASTER_TEACHER_PASSKEY = "TEACHER-ELIF-2026";

// Default Initial Teacher Profile
export const DEFAULT_TEACHER_PROFILE: UserProfile = {
  id: "teacher-master-elif",
  username: MASTER_TEACHER_USERNAME,
  name: "Teacher Elif Cetin",
  email: "elif2001cetin@gmail.com",
  role: "teacher",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  authProvider: "username",
  level: "Advanced",
  xp: 5000,
  streak: 30,
  lastActiveDate: new Date().toISOString().split("T")[0],
  activeDays: [new Date().toISOString().split("T")[0]],
  dailyGoalMinutes: 30,
  minutesSpentToday: 15,
  completedLessons: [],
  completedQuizzes: {},
  unlockedAdvanced: true,
  earnedBadges: ["badge-first-step", "badge-a1-master", "badge-a2-master", "badge-b1-master"],
  skills: {
    grammar: 100,
    vocabulary: 100,
    speaking: 100,
    listening: 100,
    pronunciation: 100
  }
};

// Seed Student Demo Profile (Starts with 0% skills)
export const DEFAULT_STUDENT_PROFILE: UserProfile = {
  id: "student-alex-01",
  username: "alex_student",
  name: "Alex Johnson",
  email: "alex.student@school.edu",
  role: "student",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  authProvider: "username",
  level: "A1",
  xp: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split("T")[0],
  activeDays: [new Date().toISOString().split("T")[0]],
  dailyGoalMinutes: 15,
  minutesSpentToday: 0,
  completedLessons: [],
  completedQuizzes: {},
  unlockedAdvanced: false,
  earnedBadges: [],
  skills: {
    grammar: 0,
    vocabulary: 0,
    speaking: 0,
    listening: 0,
    pronunciation: 0
  }
};

// Sample Default Assignments created by the teacher
const DEFAULT_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: "asg-01",
    title: "Written Task: 5 Sentences in Present Simple (Photo Upload)",
    description: "Write 5 original sentences using Simple Present tense in your notebook (e.g. daily habits, routines, or facts). Take a clear photo of your handwriting with your phone (JPG or PNG only) and upload it here for teacher review.",
    targetLevel: "All",
    type: "photo_submission",
    allowPhotoUpload: true,
    dueDate: "2026-09-15",
    assignedBy: "Teacher Elif Cetin",
    createdAt: new Date().toISOString()
  },
  {
    id: "asg-02",
    title: "Pronunciation Lab: Past '-ed' Endings Drill",
    description: "Practice recording the 3 pronunciation sentences in the Speech Lab until you achieve at least 75% accuracy.",
    targetLevel: "A2",
    type: "pronunciation",
    dueDate: "2026-09-10",
    assignedBy: "Teacher Elif Cetin",
    createdAt: new Date().toISOString()
  }
];

/**
 * Initialize accounts & profiles map if empty
 */
function initStorageDatabase() {
  try {
    const rawAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    const rawProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);

    const accounts: Record<string, { username: string; password: string; role: "student" | "teacher"; profileId: string }> = rawAccounts ? JSON.parse(rawAccounts) : {};
    const profiles: Record<string, UserProfile> = rawProfiles ? JSON.parse(rawProfiles) : {};

    // Seed master teacher if not exists
    if (!accounts[MASTER_TEACHER_USERNAME.toLowerCase()]) {
      accounts[MASTER_TEACHER_USERNAME.toLowerCase()] = {
        username: MASTER_TEACHER_USERNAME,
        password: MASTER_TEACHER_PASSWORD,
        role: "teacher",
        profileId: DEFAULT_TEACHER_PROFILE.id
      };
      profiles[DEFAULT_TEACHER_PROFILE.id] = DEFAULT_TEACHER_PROFILE;
    }

    // Seed student sample if empty
    if (Object.keys(accounts).length <= 1) {
      accounts["alex_student"] = {
        username: "alex_student",
        password: "password123",
        role: "student",
        profileId: DEFAULT_STUDENT_PROFILE.id
      };
      profiles[DEFAULT_STUDENT_PROFILE.id] = DEFAULT_STUDENT_PROFILE;
    }

    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));

    // Seed assignments
    if (!localStorage.getItem(ASSIGNMENTS_STORAGE_KEY)) {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_ASSIGNMENTS));
    }
  } catch (e) {
    console.error("Failed to init accounts db:", e);
  }
}

/**
 * Get active user profile
 */
export function loadUserProfile(): UserProfile {
  initStorageDatabase();
  try {
    const activeUserId = localStorage.getItem(ACTIVE_USER_ID_KEY);
    const rawProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    const profiles: Record<string, UserProfile> = rawProfiles ? JSON.parse(rawProfiles) : {};

    let current = activeUserId && profiles[activeUserId] ? profiles[activeUserId] : null;

    if (!current) {
      // Default to the first student profile or default student
      current = profiles[DEFAULT_STUDENT_PROFILE.id] || DEFAULT_STUDENT_PROFILE;
      localStorage.setItem(ACTIVE_USER_ID_KEY, current.id);
    }

    // Refresh streak and daily dates
    const today = new Date().toISOString().split("T")[0];
    if (current.lastActiveDate !== today) {
      const lastDate = new Date(current.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        current.streak += 1;
      } else if (diffDays > 1) {
        current.streak = 1;
      }
      current.lastActiveDate = today;
      if (!current.activeDays.includes(today)) {
        current.activeDays.push(today);
      }
      current.minutesSpentToday = 0;
      saveUserProfile(current);
    }

    checkAndUnlockAdvanced(current);
    return current;
  } catch (e) {
    console.error("Failed to load user profile:", e);
    return DEFAULT_STUDENT_PROFILE;
  }
}

/**
 * Save user profile and sync to storage map
 */
export function saveUserProfile(profile: UserProfile): void {
  try {
    initStorageDatabase();
    const rawProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    const profiles: Record<string, UserProfile> = rawProfiles ? JSON.parse(rawProfiles) : {};

    profiles[profile.id] = profile;
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    localStorage.setItem(ACTIVE_USER_ID_KEY, profile.id);

    // Asynchronously synchronize with Supabase
    syncUserProfileToSupabase(profile).catch((err) => {
      console.warn("Supabase background sync:", err);
    });
  } catch (e) {
    console.error("Failed to save user profile:", e);
  }
}

/**
 * Register a student (Students can ONLY register as students)
 */
export function registerStudent(params: {
  username: string;
  password: string;
  name: string;
  email?: string;
}): { success: boolean; error?: string; profile?: UserProfile } {
  initStorageDatabase();
  const cleanUsername = params.username.trim().toLowerCase();
  const cleanPassword = params.password.trim();
  const cleanName = params.name.trim() || params.username.trim();

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: "Username must be at least 3 characters long." };
  }
  if (!cleanPassword || cleanPassword.length < 4) {
    return { success: false, error: "Password must be at least 4 characters long." };
  }
  if (cleanUsername.startsWith("teacher_") || cleanUsername === "admin" || cleanUsername === "teacher") {
    return {
      success: false,
      error: "This username prefix is reserved for teachers. Students cannot create teacher usernames."
    };
  }

  const rawAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  const accounts: Record<string, any> = rawAccounts ? JSON.parse(rawAccounts) : {};

  if (accounts[cleanUsername]) {
    return { success: false, error: "This username is already taken. Please pick another username." };
  }

  const newProfileId = `student-${cleanUsername}-${Date.now()}`;
  const newProfile: UserProfile = {
    id: newProfileId,
    username: cleanUsername,
    name: cleanName,
    email: params.email?.trim() || `${cleanUsername}@school.edu`,
    role: "student",
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
    authProvider: "username",
    level: "A1",
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
    activeDays: [new Date().toISOString().split("T")[0]],
    dailyGoalMinutes: 15,
    minutesSpentToday: 0,
    completedLessons: [],
    completedQuizzes: {},
    unlockedAdvanced: false,
    earnedBadges: [],
    skills: {
      grammar: 0,
      vocabulary: 0,
      speaking: 0,
      listening: 0,
      pronunciation: 0
    }
  };

  accounts[cleanUsername] = {
    username: cleanUsername,
    password: cleanPassword,
    role: "student",
    profileId: newProfileId
  };

  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  saveUserProfile(newProfile);

  return { success: true, profile: newProfile };
}

/**
 * Register a Teacher (Requires secret master passkey)
 */
export function registerTeacherWithPasskey(params: {
  username: string;
  password: string;
  name: string;
  secretPasskey: string;
}): { success: boolean; error?: string; profile?: UserProfile } {
  initStorageDatabase();
  const cleanPasskey = params.secretPasskey.trim();
  if (cleanPasskey !== MASTER_TEACHER_PASSKEY) {
    return {
      success: false,
      error: "Invalid Teacher Master Passkey. Only authorized instructors can create teacher accounts."
    };
  }

  const cleanUsername = params.username.trim().toLowerCase();
  const cleanPassword = params.password.trim();
  const cleanName = params.name.trim() || "Teacher " + cleanUsername;

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: "Teacher username must be at least 3 characters." };
  }
  if (!cleanPassword || cleanPassword.length < 4) {
    return { success: false, error: "Password must be at least 4 characters." };
  }

  const rawAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  const accounts: Record<string, any> = rawAccounts ? JSON.parse(rawAccounts) : {};

  const profileId = `teacher-${cleanUsername}-${Date.now()}`;
  const teacherProfile: UserProfile = {
    id: profileId,
    username: cleanUsername,
    name: cleanName,
    role: "teacher",
    avatarUrl: `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80`,
    authProvider: "username",
    level: "Advanced",
    xp: 5000,
    streak: 30,
    lastActiveDate: new Date().toISOString().split("T")[0],
    activeDays: [new Date().toISOString().split("T")[0]],
    dailyGoalMinutes: 30,
    minutesSpentToday: 0,
    completedLessons: [],
    completedQuizzes: {},
    unlockedAdvanced: true,
    earnedBadges: ["badge-first-step", "badge-a1-master", "badge-a2-master", "badge-b1-master"],
    skills: {
      grammar: 100,
      vocabulary: 100,
      speaking: 100,
      listening: 100,
      pronunciation: 100
    }
  };

  accounts[cleanUsername] = {
    username: cleanUsername,
    password: cleanPassword,
    role: "teacher",
    profileId: profileId
  };

  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  saveUserProfile(teacherProfile);

  return { success: true, profile: teacherProfile };
}

/**
 * Login with username and password
 */
export function loginWithUsername(
  username: string,
  password: string
): { success: boolean; error?: string; profile?: UserProfile } {
  initStorageDatabase();
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Check master teacher bypass
  if (cleanUsername === MASTER_TEACHER_USERNAME.toLowerCase() && cleanPassword === MASTER_TEACHER_PASSWORD) {
    saveUserProfile(DEFAULT_TEACHER_PROFILE);
    return { success: true, profile: DEFAULT_TEACHER_PROFILE };
  }

  const rawAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  const accounts: Record<string, any> = rawAccounts ? JSON.parse(rawAccounts) : {};

  const acc = accounts[cleanUsername];
  if (!acc) {
    return { success: false, error: "No account found with this username. Please check or sign up." };
  }

  if (acc.password !== cleanPassword) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  const rawProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
  const profiles: Record<string, UserProfile> = rawProfiles ? JSON.parse(rawProfiles) : {};

  const profile = profiles[acc.profileId];
  if (!profile) {
    return { success: false, error: "User profile could not be loaded." };
  }

  saveUserProfile(profile);
  return { success: true, profile };
}

/**
 * Get all students for Teacher Dashboard
 */
export function getAllStudents(): UserProfile[] {
  initStorageDatabase();
  try {
    const rawProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    const profiles: Record<string, UserProfile> = rawProfiles ? JSON.parse(rawProfiles) : {};

    return Object.values(profiles).filter((p) => p.role === "student");
  } catch (e) {
    console.error("Failed to get all students:", e);
    return [DEFAULT_STUDENT_PROFILE];
  }
}

/**
 * Get all teacher assignments
 */
export function getTeacherAssignments(): TeacherAssignment[] {
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (!raw) return DEFAULT_ASSIGNMENTS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ASSIGNMENTS;
  }
}

/**
 * Add a new assignment
 */
export function addTeacherAssignment(asg: Omit<TeacherAssignment, "id" | "createdAt">): TeacherAssignment {
  const all = getTeacherAssignments();
  const newAsg: TeacherAssignment = {
    ...asg,
    id: `asg-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newAsg, ...all];
  localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updated));
  return newAsg;
}

/**
 * Delete an assignment
 */
export function deleteTeacherAssignment(id: string): void {
  const all = getTeacherAssignments();
  const filtered = all.filter((a) => a.id !== id);
  localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Get all assignment submissions
 */
export function getAssignmentSubmissions(assignmentId?: string, studentId?: string): AssignmentSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    const submissions: AssignmentSubmission[] = raw ? JSON.parse(raw) : [];
    return submissions.filter((s) => {
      if (assignmentId && s.assignmentId !== assignmentId) return false;
      if (studentId && s.studentId !== studentId) return false;
      return true;
    });
  } catch (e) {
    console.error("Failed to read submissions:", e);
    return [];
  }
}

/**
 * Save / update an assignment submission (e.g. handwritten photo homework)
 */
export function saveAssignmentSubmission(submission: AssignmentSubmission): void {
  try {
    const all = getAssignmentSubmissions();
    const existingIndex = all.findIndex((s) => s.id === submission.id);
    let updated: AssignmentSubmission[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = submission;
    } else {
      updated = [submission, ...all];
    }
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(updated));

    // Also mark assignment in student's profile if applicable
    const profile = loadUserProfile();
    if (profile.id === submission.studentId) {
      if (!profile.completedAssignments) {
        profile.completedAssignments = [];
      }
      if (!profile.completedAssignments.includes(submission.assignmentId)) {
        profile.completedAssignments.push(submission.assignmentId);
      }
      profile.xp += 30; // 30 XP for submitting written homework
      saveUserProfile(profile);
    }
  } catch (e) {
    console.error("Failed to save submission:", e);
  }
}

/**
 * Teacher grades/reviews a submission
 */
export function gradeAssignmentSubmission(
  submissionId: string,
  teacherGrade: string,
  teacherFeedback: string
): AssignmentSubmission | null {
  try {
    const all = getAssignmentSubmissions();
    const target = all.find((s) => s.id === submissionId);
    if (!target) return null;

    target.status = "reviewed";
    target.teacherGrade = teacherGrade;
    target.teacherFeedback = teacherFeedback;
    target.reviewedAt = new Date().toISOString().split("T")[0];

    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(all));
    return target;
  } catch (e) {
    console.error("Failed to grade submission:", e);
    return null;
  }
}

/**
 * Delete a submission
 */
export function deleteAssignmentSubmission(submissionId: string): void {
  try {
    const all = getAssignmentSubmissions();
    const filtered = all.filter((s) => s.id !== submissionId);
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete submission:", e);
  }
}

// Seed Speaking Conversation Logs for demo / teacher review
const DEFAULT_SPEAKING_SESSIONS: SpeakingSessionLog[] = [
  {
    id: "spk-log-01",
    studentId: "student-alex-01",
    studentName: "Alex Johnson",
    studentUsername: "alex_student",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    roomId: "room-coffee-101",
    roomTitle: "☕ Daily Routines & Coffee Shop",
    roomTopic: "Everyday Habits & Ordering",
    partnerName: "Elena Rostova",
    partnerCountry: "Spain",
    level: "A1",
    startedAt: "2026-08-25 14:20",
    updatedAt: "2026-08-25 14:32",
    turnCount: 4,
    aiCritiqueSummary: "Good job using present simple verbs ('I usually drink', 'I work'). Remember to use 'doesn't' for third person.",
    teacherFeedback: "Great conversational flow, Alex! Your sentences are getting clearer. Keep practicing questions with 'Do you...?'",
    teacherReviewedAt: "2026-08-25",
    messages: [
      {
        id: "m1",
        sender: "partner",
        senderName: "Elena Rostova",
        text: "Hi Alex! Great to meet you in the coffee shop room. What do you usually do in the morning before work or school?",
        timestamp: "14:20"
      },
      {
        id: "m2",
        sender: "user",
        senderName: "Alex",
        text: "Hello Elena! In the morning, I always wake up at 7 AM. I drink a cup of black coffee and I walk my dog.",
        timestamp: "14:22"
      },
      {
        id: "m3",
        sender: "partner",
        senderName: "Elena Rostova",
        text: "That sounds very relaxing! Do you make your breakfast at home or buy something on your way?",
        timestamp: "14:24"
      },
      {
        id: "m4",
        sender: "user",
        senderName: "Alex",
        text: "I usually make toast with eggs at home because it is healthy and fast.",
        timestamp: "14:26"
      }
    ]
  },
  {
    id: "spk-log-02",
    studentId: "student-alex-01",
    studentName: "Alex Johnson",
    studentUsername: "alex_student",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    roomId: "bot-coach-david",
    roomTitle: "🤖 Coach David - IELTS & Fluency Examiner",
    roomTopic: "IELTS & Fluency Examiner",
    partnerName: "Coach David",
    partnerCountry: "United Kingdom",
    level: "B1",
    startedAt: "2026-08-26 08:15",
    updatedAt: "2026-08-26 08:24",
    turnCount: 3,
    aiCritiqueSummary: "Fluent response with good connector words. Try using more varied descriptive adjectives.",
    messages: [
      {
        id: "m10",
        sender: "partner",
        senderName: "Coach David",
        text: "Hello Alex! What are your main language learning goals this semester?",
        timestamp: "08:15"
      },
      {
        id: "m11",
        sender: "user",
        senderName: "Alex",
        text: "I want to improve my speaking confidence and pass the CEFR exam with high scores.",
        timestamp: "08:18"
      },
      {
        id: "m12",
        sender: "partner",
        senderName: "Coach David",
        text: "Excellent ambition! Structured daily practice with pronunciation drills will help you achieve that. Tell me about your current study routine.",
        timestamp: "08:20"
      }
    ]
  }
];

/**
 * Get all peer speaking room session logs
 */
export function getSpeakingSessions(studentId?: string): SpeakingSessionLog[] {
  try {
    const raw = localStorage.getItem(SPEAKING_SESSIONS_STORAGE_KEY);
    let sessions: SpeakingSessionLog[] = raw ? JSON.parse(raw) : [];
    if (!raw || sessions.length === 0) {
      sessions = DEFAULT_SPEAKING_SESSIONS;
      localStorage.setItem(SPEAKING_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    }
    return sessions.filter((s) => {
      if (studentId && s.studentId !== studentId) return false;
      return true;
    });
  } catch (e) {
    console.error("Failed to read speaking sessions:", e);
    return DEFAULT_SPEAKING_SESSIONS;
  }
}

/**
 * Save or update a peer speaking session log
 */
export function saveSpeakingSession(session: SpeakingSessionLog): void {
  try {
    const all = getSpeakingSessions();
    const existingIndex = all.findIndex((s) => s.id === session.id);
    let updated: SpeakingSessionLog[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = session;
    } else {
      updated = [session, ...all];
    }
    localStorage.setItem(SPEAKING_SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save speaking session:", e);
  }
}

/**
 * Teacher reviews/feedback on a speaking session
 */
export function gradeSpeakingSession(sessionId: string, teacherGrade: string, teacherFeedback: string): SpeakingSessionLog | null {
  try {
    const all = getSpeakingSessions();
    const target = all.find((s) => s.id === sessionId);
    if (!target) return null;

    target.teacherGrade = teacherGrade;
    target.teacherFeedback = teacherFeedback;
    target.teacherReviewedAt = new Date().toISOString().split("T")[0];
    localStorage.setItem(SPEAKING_SESSIONS_STORAGE_KEY, JSON.stringify(all));
    return target;
  } catch (e) {
    console.error("Failed to grade speaking session:", e);
    return null;
  }
}

/**
 * Delete a speaking session log
 */
export function deleteSpeakingSession(sessionId: string): void {
  try {
    const all = getSpeakingSessions();
    const filtered = all.filter((s) => s.id !== sessionId);
    localStorage.setItem(SPEAKING_SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete speaking session:", e);
  }
}

/**
 * Record Quiz Completion
 */
export function recordQuizCompletion(
  quizId: string,
  score: number,
  totalQuestions: number,
  correctCount: number,
  level: CEFRLevel
): { profile: UserProfile; newlyUnlockedAdvanced: boolean; newBadges: string[] } {
  const profile = loadUserProfile();
  const today = new Date().toISOString().split("T")[0];

  const earnedXp = Math.round((score / 100) * 50) + 20;
  profile.xp += earnedXp;

  if (!profile.completedLessons.includes(quizId)) {
    profile.completedLessons.push(quizId);
  }

  profile.completedQuizzes[quizId] = {
    score,
    totalQuestions,
    correctCount,
    completedAt: today,
    level
  };

  // Adjust skills based on score
  profile.skills.grammar = Math.min(100, Math.round(profile.skills.grammar * 0.8 + score * 0.2));
  profile.skills.vocabulary = Math.min(100, Math.round(profile.skills.vocabulary * 0.85 + (score * 0.9) * 0.15));

  // Check advanced unlock condition
  const newlyUnlockedAdvanced = checkAndUnlockAdvanced(profile);

  // Check badges
  const newBadges = checkBadgesEarned(profile);

  saveUserProfile(profile);

  if (newlyUnlockedAdvanced) {
    triggerCelebrationConfetti();
  }

  return { profile, newlyUnlockedAdvanced, newBadges };
}

export function checkAndUnlockAdvanced(profile: UserProfile): boolean {
  if (profile.role === "teacher") return true;

  const mandatoryTopics = LESSONS_DATA.filter((l) => l.isMandatoryForAdvance);
  const allMandatoryCompleted = mandatoryTopics.every((topic) => {
    const quizResult = profile.completedQuizzes[topic.id];
    return quizResult && quizResult.score >= 70;
  });

  if (allMandatoryCompleted && !profile.unlockedAdvanced) {
    profile.unlockedAdvanced = true;
    profile.xp += 250;
    return true;
  }
  return false;
}

export function checkBadgesEarned(profile: UserProfile): string[] {
  const newBadges: string[] = [];

  if (Object.keys(profile.completedQuizzes).length >= 1 && !profile.earnedBadges.includes("badge-first-step")) {
    profile.earnedBadges.push("badge-first-step");
    newBadges.push("badge-first-step");
  }

  if (profile.streak >= 3 && !profile.earnedBadges.includes("badge-streak-3")) {
    profile.earnedBadges.push("badge-streak-3");
    newBadges.push("badge-streak-3");
  }

  if (profile.streak >= 7 && !profile.earnedBadges.includes("badge-streak-7")) {
    profile.earnedBadges.push("badge-streak-7");
    newBadges.push("badge-streak-7");
  }

  const a1Count = Object.values(profile.completedQuizzes).filter((q) => q.level === "A1" && q.score >= 80).length;
  if (a1Count >= 2 && !profile.earnedBadges.includes("badge-a1-master")) {
    profile.earnedBadges.push("badge-a1-master");
    newBadges.push("badge-a1-master");
  }

  const a2Count = Object.values(profile.completedQuizzes).filter((q) => q.level === "A2" && q.score >= 70).length;
  if (a2Count >= 2 && !profile.earnedBadges.includes("badge-a2-master")) {
    profile.earnedBadges.push("badge-a2-master");
    newBadges.push("badge-a2-master");
  }

  const b1Count = Object.values(profile.completedQuizzes).filter((q) => q.level === "B1" && q.score >= 70).length;
  if (b1Count >= 4 && !profile.earnedBadges.includes("badge-b1-master")) {
    profile.earnedBadges.push("badge-b1-master");
    newBadges.push("badge-b1-master");
  }

  return newBadges;
}

export function triggerCelebrationConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch {
    // ignore
  }
}
