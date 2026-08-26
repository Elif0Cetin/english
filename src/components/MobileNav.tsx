import React from "react";
import { LayoutDashboard, BookOpen, Mic, Users, Gamepad2, GraduationCap } from "lucide-react";

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole?: "student" | "teacher";
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab, userRole = "student" }) => {
  const isTeacher = userRole === "teacher";

  const studentNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "curriculum", label: "Learn", icon: BookOpen },
    { id: "pronunciation", label: "Speech AI", icon: Mic },
    { id: "lounge", label: "Speaking", icon: Users },
    { id: "games", label: "Games", icon: Gamepad2 }
  ];

  const teacherNavItems = [
    { id: "teacher_dashboard", label: "Classroom", icon: GraduationCap },
    { id: "curriculum", label: "Curriculum", icon: BookOpen },
    { id: "pronunciation", label: "Speech AI", icon: Mic },
    { id: "lounge", label: "Speaking", icon: Users },
    { id: "games", label: "Games", icon: Gamepad2 }
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-tab-${item.id}`}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              isActive
                ? isTeacher
                  ? "text-indigo-600 font-bold"
                  : "text-blue-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                isActive ? (isTeacher ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700") : ""
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
