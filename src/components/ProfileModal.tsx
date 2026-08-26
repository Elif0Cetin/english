import React, { useState } from "react";
import { UserProfile, CEFRLevel } from "../types";
import { saveUserProfile } from "../utils/storage";
import { syncUserProfileToSupabase, isSupabaseConnected, SUPABASE_PROJECT_ID, SUPABASE_URL } from "../lib/supabase";
import {
  X,
  User,
  LogOut,
  CheckCircle2,
  RotateCcw,
  Database,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";

interface ProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  onUpdateUser,
  onLogout
}) => {
  const [name, setName] = useState(user.name);
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoalMinutes);
  const [targetLevel, setTargetLevel] = useState<CEFRLevel>(user.level);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus("idle");
    try {
      const ok = await syncUserProfileToSupabase(user);
      setSyncStatus(ok ? "success" : "error");
    } catch {
      setSyncStatus("error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = () => {
    const updated: UserProfile = {
      ...user,
      name,
      dailyGoalMinutes: dailyGoal,
      level: targetLevel
    };
    saveUserProfile(updated);
    onUpdateUser(updated);
    onClose();
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all learning progress? This will reset all your stats, level, and quizzes to 0.")) {
      const resetUser: UserProfile = {
        ...user,
        xp: 0,
        streak: 1,
        level: "A1",
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
      saveUserProfile(resetUser);
      onUpdateUser(resetUser);
      onClose();
    }
  };

  const sqlSchemaCode = `-- ==========================================
-- SUPABASE DATABASE SETUP FOR LINGUASTEP APP
-- Project ID: ${SUPABASE_PROJECT_ID}
-- ==========================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'guest',
  level TEXT DEFAULT 'A1',
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  active_days TEXT[] DEFAULT ARRAY[CURRENT_DATE::TEXT],
  daily_goal_minutes INTEGER DEFAULT 15,
  minutes_spent_today INTEGER DEFAULT 0,
  completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[],
  unlocked_advanced BOOLEAN DEFAULT false,
  earned_badges TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create User Skills Analytics Table (Starts from 0%)
CREATE TABLE IF NOT EXISTS public.user_skills (
  user_id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  grammar INTEGER DEFAULT 0,
  vocabulary INTEGER DEFAULT 0,
  speaking INTEGER DEFAULT 0,
  listening INTEGER DEFAULT 0,
  pronunciation INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Quiz Attempts History Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  cefr_level TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Peer Speaking Sessions History Table
CREATE TABLE IF NOT EXISTS public.speaking_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  turns_count INTEGER NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;

-- 6. Setup Permissive Policies for Web Application
CREATE POLICY "Public profiles can be read and upserted"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "User skills can be read and upserted"
  ON public.user_skills FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Quiz attempts can be logged and read"
  ON public.quiz_attempts FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Speaking sessions can be logged and read"
  ON public.speaking_sessions FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Grant Permissions to anon & authenticated roles
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_skills TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.quiz_attempts TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.speaking_sessions TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>{user.role === "teacher" ? "Teacher Profile & Cloud Database" : "Learner Profile & Settings"}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-xs bg-white"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  user.role === "teacher"
                    ? "bg-purple-100 text-purple-900 border border-purple-200"
                    : "bg-blue-100 text-blue-900 border border-blue-200"
                }`}
              >
                {user.role === "teacher" ? "Teacher / Instructor" : "Student"}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">@{user.username || user.id}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                Level: {user.level}
              </span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {user.xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Supabase Database Connection Card - TEACHER ONLY */}
        {user.role === "teacher" && (
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Supabase Cloud Database (Instructor Admin)</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Target: {SUPABASE_PROJECT_ID}</span>
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">API Endpoint:</span>
                <span className="font-mono text-slate-700 truncate max-w-[240px]">{SUPABASE_URL}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Sync Pipeline:</span>
                <span className="font-semibold text-emerald-700">Classroom Profiles, Skills & Quizzes</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-100">
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync to Supabase"}</span>
              </button>

              <button
                onClick={() => setShowSqlGuide(!showSqlGuide)}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline underline-offset-2 cursor-pointer"
              >
                {showSqlGuide ? "Hide SQL Schema" : "View / Copy SQL Code"}
              </button>
            </div>

            {syncStatus === "success" && (
              <div className="text-[11px] text-emerald-800 bg-emerald-100/90 p-2 rounded-lg font-medium flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Synchronized successfully with your Supabase database!</span>
              </div>
            )}

            {syncStatus === "error" && (
              <div className="text-[11px] text-amber-900 bg-amber-100/90 p-2 rounded-lg font-medium">
                Run the SQL script in your Supabase SQL Editor and ensure the <code>VITE_SUPABASE_ANON_KEY</code> is set.
              </div>
            )}
          </div>
        )}

        {/* Expandable SQL Schema Box - TEACHER ONLY */}
        {user.role === "teacher" && showSqlGuide && (
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 text-xs space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-emerald-400 font-bold">schema.sql for Supabase SQL Editor</span>
              <button
                onClick={handleCopySql}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg transition flex items-center space-x-1 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? "Copied!" : "Copy SQL"}</span>
              </button>
            </div>
            <pre className="text-[10px] font-mono bg-slate-950 p-3 rounded-xl overflow-x-auto max-h-48 text-slate-300">
              {sqlSchemaCode}
            </pre>
          </div>
        )}

        {/* Form Settings */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Daily Study Target</label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyGoal(mins)}
                  className={`py-2 rounded-xl border font-bold transition cursor-pointer ${
                    dailyGoal === mins
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Target CEFR Benchmark</label>
            <div className="grid grid-cols-4 gap-2">
              {(["A1", "A2", "B1", "Advanced"] as CEFRLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setTargetLevel(lvl)}
                  className={`py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    targetLevel === lvl
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Save Changes
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleResetProgress}
              className="text-xs text-rose-600 hover:underline flex items-center space-x-1 cursor-pointer font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Progress</span>
            </button>

            <button
              onClick={onLogout}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
