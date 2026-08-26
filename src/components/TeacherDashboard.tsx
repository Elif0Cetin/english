import React, { useState, useEffect } from "react";
import { UserProfile, TeacherAssignment, AssignmentSubmission, SpeakingSessionLog, CEFRLevel } from "../types";
import {
  getAllStudents,
  getTeacherAssignments,
  addTeacherAssignment,
  deleteTeacherAssignment,
  getAssignmentSubmissions,
  getSpeakingSessions,
  deleteSpeakingSession
} from "../utils/storage";
import {
  fetchAllStudentsFromSupabase,
  syncUserProfileToSupabase,
  isSupabaseConnected,
  SUPABASE_PROJECT_ID
} from "../lib/supabase";
import { SubmissionReviewModal } from "./SubmissionReviewModal";
import { SpeakingSessionReviewModal } from "./SpeakingSessionReviewModal";
import { LESSONS_DATA } from "../data/lessonsData";
import {
  GraduationCap,
  Users,
  Search,
  BookOpen,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  Eye,
  X,
  Target,
  BarChart3,
  Calendar,
  AlertCircle,
  Lock,
  Sparkles,
  Key,
  Camera,
  Image as ImageIcon,
  FileCheck,
  CheckCircle,
  MessageSquare,
  Volume2,
  Headphones,
  User,
  Bot
} from "lucide-react";

interface TeacherDashboardProps {
  teacher: UserProfile;
  onNavigateToCurriculum: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  onNavigateToCurriculum
}) => {
  const [students, setStudents] = useState<UserProfile[]>(getAllStudents());
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(getTeacherAssignments());
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(getAssignmentSubmissions());
  const [speakingSessions, setSpeakingSessions] = useState<SpeakingSessionLog[]>(getSpeakingSessions());
  const [submissionFilter, setSubmissionFilter] = useState<"all" | "pending" | "reviewed">("all");
  const [speakingFilter, setSpeakingFilter] = useState<"all" | "pending" | "reviewed">("all");
  const [activeReviewSubmission, setActiveReviewSubmission] = useState<AssignmentSubmission | null>(null);
  const [activeSpeakingSession, setActiveSpeakingSession] = useState<SpeakingSessionLog | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  
  // Assignment Creation Form State
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState("");
  const [asgDesc, setAsgDesc] = useState("");
  const [asgLevel, setAsgLevel] = useState<CEFRLevel | "All">("All");
  const [asgType, setAsgType] = useState<"photo_submission" | "quiz" | "pronunciation" | "speaking" | "general">("photo_submission");
  const [asgDueDate, setAsgDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const refreshData = async () => {
    setIsSyncing(true);
    try {
      setSubmissions(getAssignmentSubmissions());
      setSpeakingSessions(getSpeakingSessions());
      if (isSupabaseConnected()) {
        const cloudStudents = await fetchAllStudentsFromSupabase();
        if (cloudStudents && cloudStudents.length > 0) {
          setStudents(cloudStudents);
        } else {
          setStudents(getAllStudents());
        }
      } else {
        setStudents(getAllStudents());
      }
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    } catch {
      setStudents(getAllStudents());
      setSubmissions(getAssignmentSubmissions());
      setSpeakingSessions(getSpeakingSessions());
    } finally {
      setIsSyncing(false);
    }
  };

  const refreshStudents = refreshData;

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;

    const newAsg = addTeacherAssignment({
      title: asgTitle.trim(),
      description: asgDesc.trim() || "Complete the assigned task to earn XP and level up.",
      targetLevel: asgLevel,
      type: asgType,
      allowPhotoUpload: asgType === "photo_submission",
      dueDate: asgDueDate,
      assignedBy: teacher.name
    });

    setAssignments(getTeacherAssignments());
    setShowNewAssignmentModal(false);
    setAsgTitle("");
    setAsgDesc("");
  };

  const handleDeleteAssignment = (id: string) => {
    deleteTeacherAssignment(id);
    setAssignments(getTeacherAssignments());
  };

  // Export Student Grades as CSV
  const handleExportCSV = () => {
    const headers = [
      "Student ID",
      "Username",
      "Full Name",
      "CEFR Level",
      "Total XP",
      "Study Streak (Days)",
      "Minutes Today",
      "Grammar (%)",
      "Vocabulary (%)",
      "Speaking (%)",
      "Listening (%)",
      "Pronunciation (%)",
      "Quizzes Completed",
      "Last Active Date"
    ];

    const rows = students.map((s) => [
      `"${s.id}"`,
      `"${s.username}"`,
      `"${s.name}"`,
      `"${s.level}"`,
      s.xp,
      s.streak,
      s.minutesSpentToday,
      s.skills?.grammar || 0,
      s.skills?.vocabulary || 0,
      s.skills?.speaking || 0,
      s.skills?.listening || 0,
      s.skills?.pronunciation || 0,
      Object.keys(s.completedQuizzes || {}).length,
      `"${s.lastActiveDate}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `linguastep_students_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || s.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  // Classroom stats calculations
  const totalStudentsCount = students.length;
  const avgXp = totalStudentsCount > 0 ? Math.round(students.reduce((acc, s) => acc + s.xp, 0) / totalStudentsCount) : 0;
  const activeTodayCount = students.filter(
    (s) => s.lastActiveDate === new Date().toISOString().split("T")[0]
  ).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <span>Instructor Portal & Classroom Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {teacher.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Track student diagnostic benchmarks, manage assignments, review 5-skill mastery breakdowns, and monitor quiz outcomes in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshStudents}
              disabled={isSyncing}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : syncSuccess ? "Synced!" : "Refresh & Sync"}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Grades (CSV)</span>
            </button>
          </div>
        </div>

        {/* Quick Instructor Account Info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px] text-indigo-200">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 font-mono bg-black/30 px-2.5 py-1 rounded-lg">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Signed In As: <strong>@{teacher.username}</strong></span>
            </span>
            {teacher.email && (
              <span className="hidden sm:inline bg-indigo-500/20 px-2.5 py-1 rounded-lg">
                {teacher.email}
              </span>
            )}
          </div>
          <span className="text-emerald-300 font-medium">
            🔒 Student access strictly restricted to Student Accounts
          </span>
        </div>
      </div>

      {/* Classroom Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalStudentsCount}</div>
          <p className="text-[11px] text-slate-400">Total registered learners</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Today</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeTodayCount}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Studied in the last 24 hours</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Class Average XP</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{avgXp} XP</div>
          <p className="text-[11px] text-slate-400">Earned through quizzes & speech</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Photo Submissions</span>
            <Camera className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{submissions.length}</div>
          <p className="text-[11px] text-purple-700 font-medium">
            {submissions.filter(s => s.status === "pending").length} pending review
          </p>
        </div>
      </div>

      {/* Classroom Assignments Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Teacher Assignments & Tasks</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create homework tasks, photo sentence upload prompts, and quizzes for student dashboards.
            </p>
          </div>

          <button
            onClick={() => setShowNewAssignmentModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl p-4 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{asg.title}</h3>
                  <div className="flex items-center space-x-1 shrink-0">
                    {asg.allowPhotoUpload && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md flex items-center space-x-1">
                        <Camera className="w-3 h-3" />
                        <span>JPG/PNG</span>
                      </span>
                    )}
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md uppercase">
                      {asg.targetLevel}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80 text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {asg.dueDate || "No deadline"}</span>
                </div>

                <button
                  onClick={() => handleDeleteAssignment(asg.id)}
                  className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer"
                  title="Remove Assignment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Photo Submissions (JPG & PNG Homework Review) Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Student Photo Homework & Submissions (JPG & PNG)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect handwritten notebooks, written sentences, and grade student photo uploads.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSubmissionFilter("all")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                submissionFilter === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setSubmissionFilter("pending")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1 ${
                submissionFilter === "pending"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Needs Review</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {submissions.filter((s) => s.status === "pending").length}
              </span>
            </button>
            <button
              onClick={() => setSubmissionFilter("reviewed")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                submissionFilter === "reviewed"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Reviewed ({submissions.filter((s) => s.status === "reviewed").length})
            </button>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Photo Submissions Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When students take a picture of their handwritten homework (e.g. 5 Present Simple sentences) and upload it, their JPG/PNG photos will appear here for you to zoom, inspect, and evaluate.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions
              .filter((sub) => {
                if (submissionFilter === "pending") return sub.status === "pending";
                if (submissionFilter === "reviewed") return sub.status === "reviewed";
                return true;
              })
              .map((sub) => (
                <div
                  key={sub.id}
                  className="bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition space-y-3 flex flex-col justify-between shadow-xs group"
                >
                  <div className="space-y-2.5">
                    {/* Student Info & Status Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={sub.studentAvatar}
                          alt={sub.studentName}
                          className="w-8 h-8 rounded-full border border-indigo-200 object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {sub.studentName}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            @{sub.studentUsername}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          sub.status === "reviewed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {sub.status === "reviewed" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{sub.teacherGrade || "Graded"}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Needs Review</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Task Title */}
                    <div className="text-xs font-bold text-indigo-950 truncate">
                      {sub.assignmentTitle}
                    </div>

                    {/* Photo Thumbnail */}
                    <div
                      onClick={() => setActiveReviewSubmission(sub)}
                      className="relative h-36 bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-slate-200 flex items-center justify-center group-hover:ring-2 group-hover:ring-indigo-400 transition"
                    >
                      <img
                        src={sub.photoDataUrl}
                        alt="Handwriting homework"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Click to Inspect & Grade</span>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        {sub.fileType.replace("image/", "").toUpperCase()}
                      </span>
                    </div>

                    {/* Student note or feedback snippet */}
                    {sub.studentNote && (
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/70 italic line-clamp-1">
                        "{sub.studentNote}"
                      </p>
                    )}

                    {sub.teacherFeedback && (
                      <div className="text-[11px] text-emerald-900 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                        <span className="font-bold">Your Feedback: </span>
                        <span className="italic line-clamp-1">{sub.teacherFeedback}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{sub.submittedAt.split(" ")[0]}</span>
                    </span>

                    <button
                      onClick={() => setActiveReviewSubmission(sub)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                        sub.status === "reviewed"
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{sub.status === "reviewed" ? "Edit Feedback" : "Inspect & Grade"}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Peer Speaking Lounge Conversations & Transcripts Review Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Student Peer Speaking Rooms & Conversation Logs</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Read and listen to live student speaking room dialogues, inspect AI turn feedback, and give spoken feedback.
            </p>
          </div>

          {/* Speaking Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSpeakingFilter("all")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                speakingFilter === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Logs ({speakingSessions.length})
            </button>
            <button
              onClick={() => setSpeakingFilter("pending")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1 ${
                speakingFilter === "pending"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Needs Review</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {speakingSessions.filter((s) => !s.teacherReviewedAt).length}
              </span>
            </button>
            <button
              onClick={() => setSpeakingFilter("reviewed")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                speakingFilter === "reviewed"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Evaluated ({speakingSessions.filter((s) => !!s.teacherReviewedAt).length})
            </button>
          </div>
        </div>

        {speakingSessions.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Speaking Room Logs Recorded</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When students enter the Peer Speaking Lounge or practice with AI native conversation partners, their dialogue transcripts will be archived here for your inspection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {speakingSessions
              .filter((sess) => {
                if (speakingFilter === "pending") return !sess.teacherReviewedAt;
                if (speakingFilter === "reviewed") return !!sess.teacherReviewedAt;
                return true;
              })
              .map((sess) => (
                <div
                  key={sess.id}
                  className="bg-slate-50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 transition space-y-3 flex flex-col justify-between shadow-xs group"
                >
                  <div className="space-y-2.5">
                    {/* Header: Student & Level */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={sess.studentAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                          alt={sess.studentName}
                          className="w-8 h-8 rounded-full border border-emerald-200 object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {sess.studentName}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            @{sess.studentUsername}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          sess.teacherReviewedAt
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {sess.teacherReviewedAt ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Grade: {sess.teacherGrade || "Evaluated"}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Needs Evaluation</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Room & Scenario Information */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200/90 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{sess.roomTitle}</span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded-md uppercase">
                          {sess.level}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                        <Bot className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>Partner: <strong>{sess.partnerName}</strong> ({sess.partnerCountry})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Recorded: <strong>{sess.turnCount} turns</strong> • {sess.messages.length} lines of dialogue
                      </div>
                    </div>

                    {/* AI Speaking Critique snippet */}
                    {sess.aiCritiqueSummary && (
                      <div className="text-[11px] text-purple-900 bg-purple-50 p-2 rounded-lg border border-purple-200 space-y-0.5">
                        <div className="font-bold flex items-center space-x-1 text-purple-800 text-[10px]">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>AI Real-time Feedback:</span>
                        </div>
                        <p className="italic line-clamp-2 text-[10px] text-purple-950">
                          "{sess.aiCritiqueSummary}"
                        </p>
                      </div>
                    )}

                    {/* Teacher Feedback snippet if available */}
                    {sess.teacherFeedback && (
                      <div className="text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <span className="font-bold text-[10px]">Your Comments: </span>
                        <span className="italic line-clamp-1 text-[10px]">{sess.teacherFeedback}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{sess.updatedAt || sess.startedAt}</span>
                    </span>

                    <button
                      onClick={() => setActiveSpeakingSession(sess)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                        sess.teacherReviewedAt
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{sess.teacherReviewedAt ? "Review Transcript" : "Read & Grade"}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Student Roster & Skill Tracking */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Student Roster & 5-Skill Mastery</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any student to view detailed diagnostic quiz history, test records, and performance charts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or @username..."
                className="text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden w-48 sm:w-56"
              />
            </div>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-hidden"
            >
              <option value="all">All Levels</option>
              <option value="A1">A1 Beginner</option>
              <option value="A2">A2 Elementary</option>
              <option value="B1">B1 Intermediate</option>
              <option value="B2">B2 Upper Int.</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 transition space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {student.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">@{student.username}</p>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {student.level}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {student.xp} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5-Skill Mini Mastery Bars */}
                <div className="space-y-1.5 text-[11px] pt-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Grammar</span>
                    <span className="font-semibold text-slate-800">{student.skills?.grammar || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${student.skills?.grammar || 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-slate-500 pt-0.5">
                    <span>Speaking & Pronunciation</span>
                    <span className="font-semibold text-slate-800">
                      {Math.round(((student.skills?.speaking || 0) + (student.skills?.pronunciation || 0)) / 2)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.round(((student.skills?.speaking || 0) + (student.skills?.pronunciation || 0)) / 2)}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <span className="text-[11px] text-slate-500">
                  Active: {student.lastActiveDate}
                </span>

                <button
                  onClick={() => setSelectedStudent(student)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold">No students match your filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Student Detail Breakdown Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">@{selectedStudent.username} • {selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">CEFR Level</div>
                <div className="text-sm font-bold text-blue-700">{selectedStudent.level}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Total XP</div>
                <div className="text-sm font-bold text-amber-700">{selectedStudent.xp}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Streak</div>
                <div className="text-sm font-bold text-orange-600">{selectedStudent.streak} Days</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Studied Today</div>
                <div className="text-sm font-bold text-emerald-700">{selectedStudent.minutesSpentToday} Mins</div>
              </div>
            </div>

            {/* 5 Skills Breakdown */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>5-Core Skill Mastery Metrics</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Grammar</span>
                    <span className="font-bold">{selectedStudent.skills?.grammar || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${selectedStudent.skills?.grammar || 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Vocabulary</span>
                    <span className="font-bold">{selectedStudent.skills?.vocabulary || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${selectedStudent.skills?.vocabulary || 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Speaking</span>
                    <span className="font-bold">{selectedStudent.skills?.speaking || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: `${selectedStudent.skills?.speaking || 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Pronunciation</span>
                    <span className="font-bold">{selectedStudent.skills?.pronunciation || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600" style={{ width: `${selectedStudent.skills?.pronunciation || 0}%` }} />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Listening</span>
                    <span className="font-bold">{selectedStudent.skills?.listening || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${selectedStudent.skills?.listening || 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Student Photo Homework Submissions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-purple-600" />
                <span>Handwritten & Photo Homework Submissions</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {submissions
                  .filter((s) => s.studentId === selectedStudent.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={sub.photoDataUrl}
                          alt="Homework thumbnail"
                          className="w-10 h-10 object-cover rounded-lg border border-slate-300 cursor-pointer"
                          onClick={() => setActiveReviewSubmission(sub)}
                        />
                        <div>
                          <span className="font-bold text-slate-900">{sub.assignmentTitle}</span>
                          <div className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Uploaded {sub.submittedAt}</span>
                          </div>
                          {sub.studentNote && (
                            <p className="text-[10px] text-slate-600 italic line-clamp-1 mt-0.5">
                              "{sub.studentNote}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {sub.status === "reviewed" ? (
                          <span className="font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[11px]">
                            {sub.teacherGrade || "Graded"}
                          </span>
                        ) : (
                          <span className="font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[11px]">
                            Needs Review
                          </span>
                        )}
                        <button
                          onClick={() => setActiveReviewSubmission(sub)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
                        >
                          {sub.status === "reviewed" ? "Review" : "Grade"}
                        </button>
                      </div>
                    </div>
                  ))}

                {submissions.filter((s) => s.studentId === selectedStudent.id).length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">
                    No photo homework submitted yet by this student.
                  </p>
                )}
              </div>
            </div>

            {/* Student Peer Speaking Lounge Sessions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Peer Speaking Lounge Transcripts</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {speakingSessions
                  .filter((s) => s.studentId === selectedStudent.id || s.studentUsername === selectedStudent.username)
                  .map((sess) => (
                    <div
                      key={sess.id}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{sess.roomTitle}</span>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md uppercase">
                            {sess.level}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Partner: {sess.partnerName} • {sess.turnCount} turns • {sess.updatedAt || sess.startedAt}
                        </div>
                        {sess.teacherGrade && (
                          <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                            Grade: {sess.teacherGrade}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveSpeakingSession(sess)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer shrink-0 ml-2"
                      >
                        Read Dialogue
                      </button>
                    </div>
                  ))}

                {speakingSessions.filter((s) => s.studentId === selectedStudent.id || s.studentUsername === selectedStudent.username).length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">
                    No speaking room sessions logged for this student yet.
                  </p>
                )}
              </div>
            </div>

            {/* Quizzes Completed Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Quiz & Assessment History</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(selectedStudent.completedQuizzes || {}).map(([topicId, rec]) => {
                  const record = rec as any;
                  return (
                    <div
                      key={topicId}
                      className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">Quiz: {topicId}</span>
                        <div className="text-[10px] text-slate-400">
                          {record.correctCount}/{record.totalQuestions} questions correct • Completed {record.completedAt}
                        </div>
                      </div>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                          record.score >= 80
                            ? "bg-emerald-100 text-emerald-800"
                            : record.score >= 60
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {record.score}%
                      </span>
                    </div>
                  );
                })}

                {Object.keys(selectedStudent.completedQuizzes || {}).length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">
                    No quizzes completed yet by this student.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <span>Create New Assignment for Students</span>
              </h3>
              <button
                onClick={() => setShowNewAssignmentModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets for Teacher */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5 text-xs">
                Quick Template Presets:
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setAsgTitle("5 Present Simple Sentences (Handwritten Photo)");
                    setAsgDesc("Write 5 complete sentences in your notebook using Simple Present Tense (e.g. your daily routine or hobbies). Take a photo with your phone (JPG or PNG) and upload it here for teacher correction.");
                    setAsgLevel("A1");
                    setAsgType("photo_submission");
                  }}
                  className="text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center space-x-1"
                >
                  <Camera className="w-3 h-3 text-purple-600" />
                  <span>5 Present Simple Sentences (Photo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAsgTitle("Past Simple Weekend Story (Handwritten Photo)");
                    setAsgDesc("Write a short 5-7 sentence paragraph about what you did last weekend using Past Simple verbs. Take a clear photo (JPG or PNG) and upload it for grammar feedback.");
                    setAsgLevel("A2");
                    setAsgType("photo_submission");
                  }}
                  className="text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center space-x-1"
                >
                  <Camera className="w-3 h-3 text-purple-600" />
                  <span>Past Weekend Story (Photo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAsgTitle("Intermediate Modal Verbs Assessment");
                    setAsgDesc("Complete the B1 modal verbs quiz topic and score at least 80% to demonstrate proficiency.");
                    setAsgLevel("B1");
                    setAsgType("quiz");
                  }}
                  className="text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  B1 Modal Verbs Quiz
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Write 5 sentences in Simple Present Tense"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target CEFR Level</label>
                  <select
                    value={asgLevel}
                    onChange={(e) => setAsgLevel(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                  >
                    <option value="All">All Students</option>
                    <option value="A1">A1 Beginner</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate</option>
                    <option value="B2">B2 Upper Int.</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Activity Type</label>
                  <select
                    value={asgType}
                    onChange={(e) => setAsgType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden font-medium"
                  >
                    <option value="photo_submission">📸 Photo Upload (JPG / PNG)</option>
                    <option value="quiz">Grammar & Vocab Quiz</option>
                    <option value="pronunciation">Pronunciation Lab Drill</option>
                    <option value="speaking">Speaking Lounge Practice</option>
                    <option value="general">General Study Task</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={asgDueDate}
                  onChange={(e) => setAsgDueDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Instructions / Goal</label>
                <textarea
                  rows={3}
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  placeholder="Instructions for students to read on their dashboard..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  Publish Assignment to Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Inspection & Grading Modal */}
      {activeReviewSubmission && (
        <SubmissionReviewModal
          submission={activeReviewSubmission}
          onClose={() => setActiveReviewSubmission(null)}
          onGraded={() => {
            setSubmissions(getAssignmentSubmissions());
            setActiveReviewSubmission(null);
          }}
        />
      )}

      {/* Speaking Room Conversation Review Modal */}
      {activeSpeakingSession && (
        <SpeakingSessionReviewModal
          session={activeSpeakingSession}
          onClose={() => setActiveSpeakingSession(null)}
          onGraded={() => {
            setSpeakingSessions(getSpeakingSessions());
            setActiveSpeakingSession(null);
          }}
        />
      )}
    </div>
  );
};
