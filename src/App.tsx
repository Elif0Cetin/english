import React, { useState, useEffect } from "react";
import { UserProfile, GrammarTopic } from "./types";
import { loadUserProfile, saveUserProfile, triggerCelebrationConfetti } from "./utils/storage";
import { LESSONS_DATA } from "./data/lessonsData";
import { Navbar } from "./components/Navbar";
import { MobileNav } from "./components/MobileNav";
import { Dashboard } from "./components/Dashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { CurriculumView } from "./components/CurriculumView";
import { QuizModal } from "./components/QuizModal";
import { PronunciationLab } from "./components/PronunciationLab";
import { PeerSpeakingLounge } from "./components/PeerSpeakingLounge";
import { GameCenter } from "./components/GameCenter";
import { AuthModal } from "./components/AuthModal";
import { ProfileModal } from "./components/ProfileModal";
import { Sparkles } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<UserProfile>(loadUserProfile());
  const [currentTab, setCurrentTab] = useState<string>(
    user.role === "teacher" ? "teacher_dashboard" : "dashboard"
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);
  const [activeQuizTopic, setActiveQuizTopic] = useState<GrammarTopic | null>(null);
  const [labInitialSentence, setLabInitialSentence] = useState<string | undefined>(undefined);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Toast / Milestone Banner
  const [milestoneNotification, setMilestoneNotification] = useState<string | null>(null);

  // Synchronize initial tab if role changes
  useEffect(() => {
    if (user.role === "teacher" && currentTab === "dashboard") {
      setCurrentTab("teacher_dashboard");
    } else if (user.role === "student" && currentTab === "teacher_dashboard") {
      setCurrentTab("dashboard");
    }
  }, [user.role]);

  // Timer for minutes spent today
  useEffect(() => {
    const timer = setInterval(() => {
      setUser((prev) => {
        const updated = {
          ...prev,
          minutesSpentToday: prev.minutesSpentToday + 1
        };
        saveUserProfile(updated);
        return updated;
      });
    }, 60000); // every minute

    return () => clearInterval(timer);
  }, []);

  const handleNavigate = (tab: string, topicId?: string) => {
    setCurrentTab(tab);
    if (topicId) {
      setSelectedTopicId(topicId);
    }
  };

  const handleOpenQuiz = (topicId: string) => {
    const topic = LESSONS_DATA.find((t) => t.id === topicId);
    if (topic) {
      setActiveQuizTopic(topic);
    }
  };

  const handleOpenPronunciation = (sentenceText?: string) => {
    setLabInitialSentence(sentenceText);
    setCurrentTab("pronunciation");
  };

  const handleQuizCompleted = (
    updatedProfile: UserProfile,
    newlyUnlockedAdvanced: boolean,
    newBadges: string[]
  ) => {
    setUser(updatedProfile);
    if (newlyUnlockedAdvanced) {
      setMilestoneNotification("👑 Major Milestone: Advanced C1 Level Unlocked!");
      triggerCelebrationConfetti();
    } else if (newBadges.length > 0) {
      setMilestoneNotification(`🏆 Badge Earned: ${newBadges[0]}!`);
    }
  };

  const handleAddXp = (amount: number) => {
    setUser((prev) => {
      const updated = { ...prev, xp: prev.xp + amount };
      saveUserProfile(updated);
      return updated;
    });
  };

  const handleLoginSuccess = (newUserProfile: UserProfile) => {
    setUser(newUserProfile);
    if (newUserProfile.role === "teacher") {
      setCurrentTab("teacher_dashboard");
    } else {
      setCurrentTab("dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Milestone Toast */}
      {milestoneNotification && (
        <div className="sticky top-16 z-30 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-md animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{milestoneNotification}</span>
          <button
            onClick={() => setMilestoneNotification(null)}
            className="ml-3 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[10px] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {/* Teacher View */}
        {currentTab === "teacher_dashboard" && (
          <TeacherDashboard
            teacher={user}
            onNavigateToCurriculum={() => setCurrentTab("curriculum")}
          />
        )}

        {/* Student View */}
        {currentTab === "dashboard" && (
          <Dashboard
            user={user}
            onNavigate={handleNavigate}
            onOpenQuiz={handleOpenQuiz}
          />
        )}

        {currentTab === "curriculum" && (
          <CurriculumView
            user={user}
            selectedTopicId={selectedTopicId}
            onOpenQuiz={handleOpenQuiz}
            onOpenPronunciation={handleOpenPronunciation}
          />
        )}

        {currentTab === "pronunciation" && (
          <PronunciationLab
            user={user}
            initialSentence={labInitialSentence}
          />
        )}

        {currentTab === "lounge" && (
          <PeerSpeakingLounge user={user} />
        )}

        {currentTab === "games" && (
          <GameCenter user={user} onAddXp={handleAddXp} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={user.role}
      />

      {/* Modals */}
      {activeQuizTopic && (
        <QuizModal
          topic={activeQuizTopic}
          user={user}
          onClose={() => setActiveQuizTopic(null)}
          onQuizCompleted={handleQuizCompleted}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {isProfileOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileOpen(false)}
          onUpdateUser={setUser}
          onLogout={() => {
            setIsProfileOpen(false);
            setIsAuthOpen(true);
          }}
        />
      )}
    </div>
  );
}
