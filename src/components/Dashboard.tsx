import React, { useState } from "react";
import { UserProfile, CEFRLevel, TeacherAssignment } from "../types";
import { LESSONS_DATA, CEFR_LEVEL_METRICS } from "../data/lessonsData";
import { BADGES_DATA } from "../data/badgesData";
import { getTeacherAssignments, getAssignmentSubmissions } from "../utils/storage";
import { AssignmentUploadModal } from "./AssignmentUploadModal";
import {
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
  Lock,
  Unlock,
  Play,
  ArrowRight,
  Clock,
  Mic,
  Users,
  Compass,
  BarChart3,
  GraduationCap,
  Calendar,
  Camera,
  FileCheck,
  Upload
} from "lucide-react";

interface DashboardProps {
  user: UserProfile;
  onNavigate: (tab: string, topicId?: string) => void;
  onOpenQuiz: (topicId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onOpenQuiz }) => {
  const [activeUploadAssignment, setActiveUploadAssignment] = useState<TeacherAssignment | null>(null);
  const [submissionVersion, setSubmissionVersion] = useState(0);

  const assignments = getTeacherAssignments().filter(
    (a) => a.targetLevel === "All" || a.targetLevel === user.level
  );
  const mandatoryTopics = LESSONS_DATA.filter((l) => l.isMandatoryForAdvance);
  const completedMandatoryCount = mandatoryTopics.filter((t) => {
    const res = user.completedQuizzes[t.id];
    return res && res.score >= 70;
  }).length;
  const advanceProgressPercent = Math.round((completedMandatoryCount / mandatoryTopics.length) * 100);

  // Next recommended lesson
  const nextLesson = LESSONS_DATA.find((l) => !user.completedLessons.includes(l.id)) || LESSONS_DATA[0];

  // Calculate recent 14 days activity list
  const recentDays = Array.from({ length: 14 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - idx));
    const dateStr = d.toISOString().split("T")[0];
    const isToday = idx === 13;
    const isActive = user.activeDays.includes(dateStr);
    const weekdayShort = d.toLocaleDateString("en-US", { weekday: "short" }); // e.g. "Mon", "Tue"
    const weekdayInitial = d.toLocaleDateString("en-US", { weekday: "narrow" }); // e.g. "M", "T"
    const dayNumber = d.getDate();
    const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });
    return { dateStr, weekdayShort, weekdayInitial, dayNumber, formattedDate, isActive, isToday };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome & CEFR Goal */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
              <Compass className="w-3.5 h-3.5" />
              <span>Target Proficiency: B1 Independent User</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              You are currently on a <strong className="text-orange-400 font-bold">{user.streak}-day streak</strong>! Continue your structured progression to unlock the Advanced C1 Grammar Vault.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="resume-learning-btn"
              onClick={() => onNavigate("curriculum", nextLesson.id)}
              className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 active:scale-98 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue Lesson</span>
            </button>
            <button
              id="quick-speech-btn"
              onClick={() => onNavigate("pronunciation")}
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-98 border border-white/20 text-white px-4 py-3 rounded-xl font-semibold text-sm transition cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Speech Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{user.streak} Days</div>
            <div className="text-xs font-semibold text-slate-500">Current Study Streak</div>
          </div>
        </div>

        {/* Completed Quizzes */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {Object.keys(user.completedQuizzes).length} / {LESSONS_DATA.length}
            </div>
            <div className="text-xs font-semibold text-slate-500">Completed Quizzes</div>
          </div>
        </div>

        {/* Experience Points */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{user.xp} XP</div>
            <div className="text-xs font-semibold text-slate-500">Total Experience</div>
          </div>
        </div>

        {/* Advanced Unlock Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${user.unlockedAdvanced ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-500"}`}>
            {user.unlockedAdvanced ? <Unlock className="w-6 h-6 text-purple-600" /> : <Lock className="w-6 h-6 text-slate-500" />}
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">
              {user.unlockedAdvanced ? "Unlocked!" : `${advanceProgressPercent}% Ready`}
            </div>
            <div className="text-xs font-semibold text-slate-500">Advanced C1 Vault</div>
          </div>
        </div>
      </div>

      {/* Gamified Progression & Locked Advanced Tracker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>Structured CEFR Pathway (A1 → A2 → B1 → Advanced)</span>
              {user.unlockedAdvanced ? (
                <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  👑 Advanced Mastery Unlocked
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  🔒 Complete A1-B1 to Unlock Advanced
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pass all mandatory quizzes with 70%+ score to unlock native-level nuanced grammar & formal discourse.
            </p>
          </div>
          <span className="text-sm font-bold text-blue-700">
            {completedMandatoryCount} of {mandatoryTopics.length} Mandatory Topics Mastered
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              user.unlockedAdvanced
                ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
                : "bg-gradient-to-r from-emerald-500 to-blue-600"
            }`}
            style={{ width: `${Math.max(5, advanceProgressPercent)}%` }}
          />
        </div>

        {/* Level Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {(["A1", "A2", "B1", "Advanced"] as CEFRLevel[]).map((lvl) => {
            const isUnlocked = lvl !== "Advanced" || user.unlockedAdvanced;
            const levelTopics = LESSONS_DATA.filter((l) => l.level === lvl);
            const completedInLvl = levelTopics.filter((t) => user.completedQuizzes[t.id]?.score >= 70).length;
            const isDone = completedInLvl === levelTopics.length && levelTopics.length > 0;

            return (
              <div
                key={lvl}
                className={`p-3.5 rounded-xl border transition ${
                  isDone
                    ? "bg-emerald-50/70 border-emerald-200"
                    : isUnlocked
                    ? "bg-slate-50/70 border-slate-200"
                    : "bg-slate-100/60 border-dashed border-slate-300 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{CEFR_LEVEL_METRICS[lvl]?.label}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isUnlocked ? (
                    <span className="text-[11px] font-bold text-blue-600">
                      {completedInLvl}/{levelTopics.length}
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{CEFR_LEVEL_METRICS[lvl]?.tag}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher Assigned Homework & Goals Banner */}
      {assignments.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/70 border border-indigo-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-950">Assigned by Your Teacher</h3>
                <p className="text-xs text-indigo-800">Homework and practice objectives set by your instructor</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-indigo-200/70 text-indigo-900 px-2.5 py-1 rounded-lg">
              {assignments.length} Active Task{assignments.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {assignments.map((asg) => {
              const subs = getAssignmentSubmissions(asg.id, user.id);
              const submission = subs.length > 0 ? subs[0] : null;
              const isPhotoTask = asg.type === "photo_submission" || asg.allowPhotoUpload;

              return (
                <div
                  key={asg.id}
                  className="bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl p-4 transition space-y-2.5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{asg.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        isPhotoTask
                          ? "bg-purple-100 text-purple-900 border border-purple-200"
                          : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {isPhotoTask ? "PHOTO (JPG/PNG)" : asg.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>

                    {/* Submission status tag if submitted */}
                    {submission && (
                      <div className="pt-1">
                        {submission.status === "reviewed" ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[11px] text-emerald-900 space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Graded by Teacher</span>
                              </span>
                              {submission.teacherGrade && (
                                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                                  {submission.teacherGrade}
                                </span>
                              )}
                            </div>
                            {submission.teacherFeedback && (
                              <p className="text-[10px] text-emerald-800 italic line-clamp-2">
                                "{submission.teacherFeedback}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 text-[11px] text-amber-800 flex items-center justify-between">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Photo Uploaded • Awaiting Teacher Review</span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {asg.dueDate || "Open"}</span>
                    </span>

                    {isPhotoTask ? (
                      <button
                        onClick={() => setActiveUploadAssignment(asg)}
                        className="text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition cursor-pointer border border-indigo-200"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{submission ? (submission.status === "reviewed" ? "View Photo & Note" : "View / Re-upload") : "Upload Photo"}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (asg.type === "quiz" && asg.topicId) {
                            onOpenQuiz(asg.topicId);
                          } else if (asg.type === "pronunciation") {
                            onNavigate("pronunciation");
                          } else if (asg.type === "speaking") {
                            onNavigate("lounge");
                          } else {
                            onNavigate("curriculum");
                          }
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Start Task</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Skills Radar/Breakdown & Streak Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Analytics Breakdown */}
        <div id="core-skill-analytics-card" className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Core English Skill Analytics</h3>
                  <p className="text-xs text-slate-500">Evaluated in real-time as you complete quizzes, pronunciation tests, and speaking sessions.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                {Object.values(user.skills).every((v) => v === 0) ? "Starting Baseline (0%)" : "Active Assessment"}
              </span>
            </div>
          </div>

          {/* If completely uncalibrated (all 0%), show informative onboarding helper */}
          {Object.values(user.skills).every((v) => v === 0) && (
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/70 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <span><strong>Skills start at 0%</strong>: Complete a grammar lesson quiz or pronunciation drill to calibrate your scores.</span>
              </div>
              <button
                onClick={() => onOpenQuiz(LESSONS_DATA[0].id)}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition shadow-xs cursor-pointer"
              >
                Start First Quiz
              </button>
            </div>
          )}

          <div className="space-y-4">
            {[
              {
                id: "grammar",
                name: "Grammar Accuracy",
                score: user.skills.grammar,
                desc: "Tenses, conditionals, passive voice, word order",
                color: "bg-blue-600",
                trackColor: "bg-blue-100/60",
                actionTab: "curriculum",
                hint: "Grammar quizzes"
              },
              {
                id: "vocabulary",
                name: "Vocabulary & Idioms",
                score: user.skills.vocabulary,
                desc: "Phrasal verbs, collocations, context usage",
                color: "bg-emerald-600",
                trackColor: "bg-emerald-100/60",
                actionTab: "arcade",
                hint: "Arcade word match"
              },
              {
                id: "pronunciation",
                name: "Pronunciation & Phonetics",
                score: user.skills.pronunciation,
                desc: "Syllable stress, vowel clarity, connected speech",
                color: "bg-purple-600",
                trackColor: "bg-purple-100/60",
                actionTab: "pronunciation",
                hint: "Pronunciation Lab"
              },
              {
                id: "speaking",
                name: "Speaking Fluency",
                score: user.skills.speaking,
                desc: "Turn-taking, hesitation reduction, response time",
                color: "bg-orange-600",
                trackColor: "bg-orange-100/60",
                actionTab: "lounge",
                hint: "Peer Speaking Lounge"
              },
              {
                id: "listening",
                name: "Listening Comprehension",
                score: user.skills.listening,
                desc: "Auditory recognition and intonation awareness",
                color: "bg-cyan-600",
                trackColor: "bg-cyan-100/60",
                actionTab: "curriculum",
                hint: "Interactive audio drills"
              }
            ].map((skill) => {
              const isZero = skill.score === 0;
              return (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-800">{skill.name}</span>
                      {isZero ? (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          Uncalibrated
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600">
                          {skill.score >= 80 ? "Proficient" : skill.score >= 60 ? "Intermediate" : "Developing"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono text-xs font-bold ${isZero ? "text-slate-400" : "text-slate-800"}`}>
                        {skill.score}%
                      </span>
                      {isZero && (
                        <button
                          onClick={() => onNavigate(skill.actionTab)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer hidden sm:inline"
                        >
                          Practice in {skill.hint} →
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isZero ? "bg-slate-200" : skill.color} transition-all duration-700`}
                      style={{ width: isZero ? "0%" : `${Math.max(4, skill.score)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{skill.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Activity Heatmap */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>14-Day Consistency Habit Tracker</span>
              </h4>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" />
                  <span>Studied</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 inline-block" />
                  <span>Rest</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-sm border-2 border-blue-500 bg-white inline-block" />
                  <span>Today</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
              {recentDays.map((day, i) => (
                <div
                  key={i}
                  id={`habit-day-${day.dateStr}`}
                  aria-label={`${day.formattedDate}: ${day.isActive ? "Studied" : "No study logged"}${day.isToday ? " (Today)" : ""}`}
                  title={`${day.formattedDate}: ${day.isActive ? "Studied (Streak Active)" : "No study logged"}${day.isToday ? " • Today" : ""}`}
                  className={`flex flex-col items-center justify-between p-1.5 rounded-xl border transition-all cursor-default ${
                    day.isToday
                      ? "border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-400"
                      : day.isActive
                      ? "border-orange-200 bg-orange-50/40"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  {/* Weekday Name */}
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    <span className="hidden sm:inline">{day.weekdayShort}</span>
                    <span className="sm:hidden">{day.weekdayInitial}</span>
                  </span>

                  {/* Activity Check / Flame Marker */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center my-1 text-xs font-black transition-transform ${
                      day.isActive
                        ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-xs scale-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {day.isActive ? "✓" : "·"}
                  </div>

                  {/* Day of Month */}
                  <span
                    className={`text-[10px] font-semibold ${
                      day.isToday ? "text-blue-700 font-bold" : "text-slate-500"
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges & Milestone Achievements */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Earned Milestones</span>
              </h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {user.earnedBadges.length} / {BADGES_DATA.length} Unlocked
              </span>
            </div>

            <div className="space-y-3">
              {BADGES_DATA.slice(0, 4).map((badge) => {
                const isUnlocked = user.earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex items-start space-x-3 transition ${
                      isUnlocked
                        ? "bg-amber-50/50 border-amber-200"
                        : "bg-slate-50/50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${
                        isUnlocked ? "bg-amber-400 text-white shadow-xs" : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      🏆
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <span className="truncate">{badge.title}</span>
                        {isUnlocked && <span className="text-amber-600 text-[10px]">✨</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate("games")}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Play Mini-Games to Earn XP & Streaks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recommended Next Lesson Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
              {nextLesson.level} Level
            </span>
            <span className="text-xs text-blue-900 font-semibold">{nextLesson.category}</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">{nextLesson.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{nextLesson.description}</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="study-topic-btn"
            onClick={() => onNavigate("curriculum", nextLesson.id)}
            className="bg-white hover:bg-slate-50 border border-blue-300 text-blue-800 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            Review Theory
          </button>
          <button
            id="start-quiz-btn"
            onClick={() => onOpenQuiz(nextLesson.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Take Quiz</span>
          </button>
        </div>
      </div>

      {/* Assignment Photo Upload Modal */}
      {activeUploadAssignment && (
        <AssignmentUploadModal
          assignment={activeUploadAssignment}
          user={user}
          onClose={() => setActiveUploadAssignment(null)}
          onSubmitted={() => {
            setSubmissionVersion((v) => v + 1);
          }}
        />
      )}
    </div>
  );
};
