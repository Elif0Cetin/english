import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { UserProfile, QuizScoreRecord, TeacherAssignment } from "../types";

// Default project configuration from user
export const SUPABASE_PROJECT_ID = "sovoqkxtbzeumvdklzdo";
export const SUPABASE_DEFAULT_ANON_KEY = "sb_publishable_UZ7H7U_H7AQftL3qGLJugA_F9gThoIl";

export const SUPABASE_URL =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY =
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||
  SUPABASE_DEFAULT_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    return supabaseInstance;
  } catch (error) {
    console.warn("Could not initialize Supabase client:", error);
    return null;
  }
}

export function isSupabaseConnected(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20);
}

/**
 * Sync user profile to Supabase 'profiles' and 'user_skills' tables
 */
export async function syncUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    // 1. Upsert Profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: profile.id,
        username: profile.username || profile.id,
        name: profile.name,
        email: profile.email || null,
        role: profile.role || "student",
        avatar_url: profile.avatarUrl,
        level: profile.level,
        xp: profile.xp,
        streak: profile.streak,
        last_active_date: profile.lastActiveDate,
        active_days: profile.activeDays,
        daily_goal_minutes: profile.dailyGoalMinutes,
        minutes_spent_today: profile.minutesSpentToday,
        completed_lessons: profile.completedLessons,
        unlocked_advanced: profile.unlockedAdvanced,
        earned_badges: profile.earnedBadges,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

    if (profileError) {
      console.warn("Supabase profiles sync error:", profileError.message);
      return false;
    }

    // 2. Upsert Skills
    if (profile.skills) {
      const { error: skillsError } = await supabase
        .from("user_skills")
        .upsert({
          user_id: profile.id,
          grammar: profile.skills.grammar || 0,
          vocabulary: profile.skills.vocabulary || 0,
          speaking: profile.skills.speaking || 0,
          listening: profile.skills.listening || 0,
          pronunciation: profile.skills.pronunciation || 0,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });

      if (skillsError) {
        console.warn("Supabase skills sync error:", skillsError.message);
      }
    }

    return true;
  } catch (err) {
    console.warn("Error during Supabase profile sync:", err);
    return false;
  }
}

/**
 * Fetch all students from Supabase (For Teacher Dashboard)
 */
export async function fetchAllStudentsFromSupabase(): Promise<UserProfile[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student");

    if (error || !profiles) return [];

    const { data: allSkills } = await supabase
      .from("user_skills")
      .select("*");

    const skillsMap = new Map<string, any>();
    if (allSkills) {
      allSkills.forEach((s) => skillsMap.set(s.user_id, s));
    }

    return profiles.map((p) => {
      const s = skillsMap.get(p.id);
      return {
        id: p.id,
        username: p.username || p.id,
        name: p.name || "Student",
        email: p.email || "",
        role: "student" as const,
        avatarUrl: p.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        authProvider: (p.auth_provider as any) || "username",
        level: p.level || "A1",
        xp: p.xp || 0,
        streak: p.streak || 1,
        lastActiveDate: p.last_active_date || new Date().toISOString().split("T")[0],
        activeDays: p.active_days || [new Date().toISOString().split("T")[0]],
        dailyGoalMinutes: p.daily_goal_minutes || 15,
        minutesSpentToday: p.minutes_spent_today || 0,
        completedLessons: p.completed_lessons || [],
        completedQuizzes: {},
        unlockedAdvanced: p.unlocked_advanced || false,
        earnedBadges: p.earned_badges || [],
        skills: {
          grammar: s?.grammar || 0,
          vocabulary: s?.vocabulary || 0,
          speaking: s?.speaking || 0,
          listening: s?.listening || 0,
          pronunciation: s?.pronunciation || 0
        }
      };
    });
  } catch (e) {
    console.warn("Could not fetch all students from Supabase:", e);
    return [];
  }
}

/**
 * Fetch profile from Supabase
 */
export async function fetchUserProfileFromSupabase(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: profileData, error: pErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (pErr || !profileData) return null;

    const { data: skillsData } = await supabase
      .from("user_skills")
      .select("*")
      .eq("user_id", userId)
      .single();

    const result: UserProfile = {
      id: profileData.id,
      username: profileData.username || profileData.id,
      name: profileData.name || "Learner",
      email: profileData.email || "",
      role: profileData.role || "student",
      avatarUrl: profileData.avatar_url || "",
      authProvider: profileData.auth_provider || "username",
      level: profileData.level || "A1",
      xp: profileData.xp || 0,
      streak: profileData.streak || 1,
      lastActiveDate: profileData.last_active_date || new Date().toISOString().split("T")[0],
      activeDays: profileData.active_days || [new Date().toISOString().split("T")[0]],
      dailyGoalMinutes: profileData.daily_goal_minutes || 15,
      minutesSpentToday: profileData.minutes_spent_today || 0,
      completedLessons: profileData.completed_lessons || [],
      completedQuizzes: {},
      unlockedAdvanced: profileData.unlocked_advanced || false,
      earnedBadges: profileData.earned_badges || [],
      skills: {
        grammar: skillsData?.grammar || 0,
        vocabulary: skillsData?.vocabulary || 0,
        speaking: skillsData?.speaking || 0,
        listening: skillsData?.listening || 0,
        pronunciation: skillsData?.pronunciation || 0
      }
    };

    return result;
  } catch (err) {
    console.warn("Error fetching Supabase profile:", err);
    return null;
  }
}

/**
 * Log Quiz Attempt
 */
export async function recordQuizAttemptToSupabase(
  userId: string,
  lessonId: string,
  record: QuizScoreRecord
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("quiz_attempts").insert({
      user_id: userId,
      lesson_id: lessonId,
      score: record.score,
      total_questions: record.totalQuestions,
      correct_count: record.correctCount,
      cefr_level: record.level,
      completed_at: record.completedAt || new Date().toISOString()
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Log Speaking Lounge Session
 */
export async function recordSpeakingSessionToSupabase(
  userId: string,
  partnerName: string,
  topic: string,
  turnsCount: number,
  feedback: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("speaking_sessions").insert({
      user_id: userId,
      partner_name: partnerName,
      topic: topic,
      turns_count: turnsCount,
      feedback: feedback,
      created_at: new Date().toISOString()
    });

    return !error;
  } catch {
    return false;
  }
}
