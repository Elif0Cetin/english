import React from "react";
import { UserProfile } from "../types";
import {
  Flame,
  Award,
  BookOpen,
  Mic,
  Users,
  Gamepad2,
  LayoutDashboard,
  GraduationCap,
  LogIn,
  User,
  ShieldCheck
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
  onOpenProfile
}) => {
  const isTeacher = user.role === "teacher";

  const studentNavItems = [
    { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { id: "curriculum", label: "Learn & Quizzes", icon: BookOpen },
    { id: "pronunciation", label: "Pronunciation AI", icon: Mic },
    { id: "lounge", label: "Peer Speaking", icon: Users },
    { id: "games", label: "Games & Streaks", icon: Gamepad2 }
  ];

  const teacherNavItems = [
    { id: "teacher_dashboard", label: "Teacher Dashboard", icon: GraduationCap },
    { id: "curriculum", label: "Curriculum Content", icon: BookOpen },
    { id: "pronunciation", label: "Pronunciation Lab", icon: Mic },
    { id: "lounge", label: "Speaking Lounge", icon: Users },
    { id: "games", label: "Learning Games", icon: Gamepad2 }
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onSelectTab(isTeacher ? "teacher_dashboard" : "dashboard")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <span className="text-xl">L</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">LinguaStep</span>
                {isTeacher ? (
                  <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-purple-200">
                    <GraduationCap className="w-3 h-3" />
                    <span>Teacher Mode</span>
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {user.level} Level
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {isTeacher ? "Classroom & Student Analytics" : "Structured English & Speech Lab"}
              </p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? isTeacher
                        ? "bg-indigo-50 text-indigo-700 shadow-xs"
                        : "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? (isTeacher ? "text-indigo-600" : "text-blue-600") : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2.5">
            {!isTeacher && (
              <>
                {/* Streak Counter */}
                <div
                  className="flex items-center space-x-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full text-orange-700 text-xs font-bold shadow-xs cursor-pointer hover:bg-orange-100 transition"
                  title={`${user.streak} Day Study Streak!`}
                  onClick={() => onSelectTab("dashboard")}
                >
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  <span>{user.streak}d</span>
                </div>

                {/* XP Points */}
                <div className="hidden sm:flex items-center space-x-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-amber-800 text-xs font-bold shadow-xs">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{user.xp} XP</span>
                </div>
              </>
            )}

            {/* Switch / Sign In button */}
            <button
              onClick={onOpenAuth}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl transition flex items-center space-x-1 cursor-pointer border border-slate-200"
              title="Switch Account / Sign In"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Switch Account</span>
            </button>

            {/* User Profile Button */}
            <button
              id="user-profile-button"
              onClick={onOpenProfile}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
              title="View Profile & Settings"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-blue-400 bg-white"
              />
              <span className="hidden lg:block text-xs font-semibold text-slate-700 pr-1 max-w-[90px] truncate">
                {user.name.split(" ")[0]}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
