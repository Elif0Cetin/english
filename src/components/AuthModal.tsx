import React, { useState } from "react";
import { UserProfile } from "../types";
import {
  registerStudent,
  loginWithUsername,
  registerTeacherWithPasskey
} from "../utils/storage";
import {
  X,
  User,
  Lock,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Key,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen
} from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  // Tabs: "student_login" | "student_signup" | "teacher_portal"
  const [authMode, setAuthMode] = useState<"student_login" | "student_signup" | "teacher_portal">(
    "student_login"
  );

  // Student Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Teacher Portal Form state
  const [teacherMode, setTeacherMode] = useState<"login" | "create">("login");
  const [teacherUsername, setTeacherUsername] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherPasskey, setTeacherPasskey] = useState("");

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Handle Student Login
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();

    const res = loginWithUsername(username, password);
    if (res.success && res.profile) {
      onLoginSuccess(res.profile);
      onClose();
    } else {
      setErrorMsg(res.error || "Login failed. Please check username and password.");
    }
  };

  // Handle Student Registration (STRICTLY role: student)
  const handleStudentSignup = (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();

    const res = registerStudent({
      username,
      password,
      name: fullName
    });

    if (res.success && res.profile) {
      onLoginSuccess(res.profile);
      onClose();
    } else {
      setErrorMsg(res.error || "Failed to create account.");
    }
  };

  // Handle Teacher Login / Registration (Strictly gated)
  const handleTeacherAuth = (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();

    if (teacherMode === "login") {
      const res = loginWithUsername(teacherUsername, teacherPassword);
      if (res.success && res.profile) {
        if (res.profile.role !== "teacher") {
          setErrorMsg("This account is not registered with Instructor permissions.");
          return;
        }
        onLoginSuccess(res.profile);
        onClose();
      } else {
        setErrorMsg(res.error || "Teacher credentials incorrect.");
      }
    } else {
      // Create new Teacher Account using Secret Passkey
      const res = registerTeacherWithPasskey({
        username: teacherUsername,
        password: teacherPassword,
        name: teacherName,
        secretPasskey: teacherPasskey
      });

      if (res.success && res.profile) {
        onLoginSuccess(res.profile);
        onClose();
      } else {
        setErrorMsg(res.error || "Could not authorize teacher account.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              L
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {authMode === "teacher_portal"
                  ? "Instructor Portal Access"
                  : authMode === "student_signup"
                  ? "Create Student Account"
                  : "Student Sign In"}
              </h3>
              <p className="text-[11px] text-slate-500">LinguaStep English Learning Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Role Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => {
              setAuthMode("student_login");
              resetForm();
            }}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMode !== "teacher_portal"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student Access</span>
          </button>

          <button
            onClick={() => {
              setAuthMode("teacher_portal");
              resetForm();
            }}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMode === "teacher_portal"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher Portal</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="text-xs bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-start space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-start space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. STUDENT LOGIN FORM */}
        {authMode === "student_login" && (
          <form onSubmit={handleStudentLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex_student"
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Sign In to Student Dashboard
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("student_signup");
                  resetForm();
                }}
                className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
              >
                New student? Create an account here
              </button>
            </div>
          </form>
        )}

        {/* 2. STUDENT SIGN UP FORM (Guaranteed role = student) */}
        {authMode === "student_signup" && (
          <form onSubmit={handleStudentSignup} className="space-y-3.5 text-xs">
            <div className="bg-blue-50/70 border border-blue-200/80 p-2.5 rounded-xl text-[11px] text-blue-900 font-medium">
              ✨ Sign up with a username and password to track your progress, quizzes, and CEFR level.
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Username (for login)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex2026"
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Create Account & Start Learning
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("student_login");
                  resetForm();
                }}
                className="text-xs text-slate-600 hover:underline font-semibold cursor-pointer"
              >
                Already registered? Sign in with your username
              </button>
            </div>
          </form>
        )}

        {/* 3. TEACHER ACCESS PORTAL (Special credentials / Master key) */}
        {authMode === "teacher_portal" && (
          <form onSubmit={handleTeacherAuth} className="space-y-3.5 text-xs">
            <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl space-y-1 text-indigo-950">
              <div className="flex items-center space-x-1.5 font-bold text-[11px] text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Instructor Protected Zone</span>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                Only the instructor can access this dashboard using their special username & password.
              </p>
            </div>

            {teacherMode === "login" ? (
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teacher Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={teacherUsername}
                      onChange={(e) => setTeacherUsername(e.target.value)}
                      placeholder="e.g. teacher_elif"
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teacher Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  Sign In to Teacher Dashboard
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setTeacherMode("create");
                      resetForm();
                    }}
                    className="text-xs text-indigo-600 hover:underline font-bold cursor-pointer"
                  >
                    Authorize New Teacher Key
                  </button>
                </div>
              </>
            ) : (
              /* Create Teacher Account with Master Passkey */
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Master Teacher Passkey</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={teacherPasskey}
                      onChange={(e) => setTeacherPasskey(e.target.value)}
                      placeholder="Enter Master Passkey"
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Teacher Elif"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">New Username</label>
                    <input
                      type="text"
                      required
                      value={teacherUsername}
                      onChange={(e) => setTeacherUsername(e.target.value)}
                      placeholder="e.g. teacher_elif"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md cursor-pointer"
                >
                  Verify Key & Register Teacher
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setTeacherMode("login");
                      resetForm();
                    }}
                    className="text-xs text-slate-600 hover:underline cursor-pointer"
                  >
                    Back to Teacher Login
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
