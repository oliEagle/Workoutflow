import React, { useState } from "react";
import { 
  Sparkles, Flame, Apple, Chrome, Dumbbell, 
  MessageSquare, History, Compass, Info, Trophy, 
  Settings2, Smartphone, HelpCircle, Layout
} from "lucide-react";
import { UserProfile, WorkoutPlan, LoggedWorkout, CoachMessage } from "./types";
import { INITIAL_LOGGED_WORKOUTS, MOCK_PROGRESS_DATA } from "./constants";
import PhoneSimulator from "./components/PhoneSimulator";

export default function App() {
  // 1. Core Synchronized React States
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sporter",
    age: 25,
    weightKg: 75,
    heightCm: 180,
    goal: "overall-health",
    level: "beginner",
    equipment: "bodyweight",
    dailyStreak: 0,
    waterIntakeMl: 0,
    waterGoalMl: 2500,
    points: 0,
    unlockedItems: [],
    bodyType: "",
    onboarded: false,
    selectedTheme: "indigo"
  });

  const [loggedWorkouts, setLoggedWorkouts] = useState<LoggedWorkout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(null);
  
  const [chatMessages, setChatMessages] = useState<CoachMessage[]>([
    {
      id: "welcome-1",
      text: "Welkom bij WorkoutFlow! Ik ben jouw gecertificeerde AI-sportcoach. Typ hieronder een sport-, fitness- of voedingsvraag of kies een van de snelle opties in de tabs!",
      sender: "coach",
      timestamp: "09:00 AM"
    }
  ]);

  const [chartData, setChartData] = useState<any[]>([
    { day: "Ma", duration: 0, calories: 0, workouts: 0, water: 0 },
    { day: "Di", duration: 0, calories: 0, workouts: 0, water: 0 },
    { day: "Wo", duration: 0, calories: 0, workouts: 0, water: 0 },
    { day: "Do", duration: 0, calories: 0, workouts: 0, water: 0 },
    { day: "Vr", duration: 0, calories: 0, workouts: 0, water: 0 },
    { day: "Za", duration: 0, calories: 0, workouts: 0, water: 0 },
    { day: "Zo", duration: 0, calories: 0, workouts: 0, water: 0 }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden antialiased">
      
      {/* Dynamic Background visual glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top dashboard navigation */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow shadow-indigo-600/35">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black tracking-tight text-white uppercase sm:text-base">
                  WorkoutFlow Workspace
                </h1>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-600/20 text-indigo-400">
                  DEVELOPER PROTO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Interactive Mobile Sandbox Environment</p>
            </div>
          </div>

          {/* Quick Active Metrics indicator */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>LOGS: <strong className="text-white">{loggedWorkouts.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>STREAK: <strong className="text-white">{profile.dailyStreak}d</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Sandbox Interactive Playground */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col justify-center items-center">
        
        {/* Welcome information segment */}
        <div className="text-center max-w-2xl mb-8 space-y-2">
          <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-extrabold px-3 py-1 bg-indigo-950/50 border border-indigo-500/20 rounded-full text-indigo-400 font-mono">
            <Sparkles className="w-3 h-3 animate-pulse" /> Advanced AI Kinetic Sequencing
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            The Smart Training Flow for Android & iOS
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Welcome to WorkoutFlow. This is a real-time, interactive environment allowing you to test both OS experiences. Build custom fitness routines via the server-side Gemini 3.5-Flash integration, track workouts, study biomechanics, and talk with our AI Coach.
          </p>
        </div>

        {/* The Central Mobile Chassis Simulator Wrapper */}
        <PhoneSimulator
          profile={profile}
          setProfile={setProfile}
          loggedWorkouts={loggedWorkouts}
          setLoggedWorkouts={setLoggedWorkouts}
          activeWorkout={activeWorkout}
          setActiveWorkout={setActiveWorkout}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chartData={chartData}
          setChartData={setChartData}
        />

        {/* Developer Sandbox Guide Map */}
        <div className="w-full mt-12 bg-slate-900/60 border border-slate-900 rounded-2xl p-5 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-550/30 font-bold font-mono text-[10px] text-indigo-400 flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">CHASSIS INTERACTION</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use the physical button rails on either side of the mock mobile phone frames to command active functions: Tap the right side lock keys to lock screen states, or click left volume rockers to query device audio HUD toasts.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-550/30 font-bold font-mono text-[10px] text-indigo-400 flex items-center justify-center">2</span>
              <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">AI PROTOCOL SCHEDULING</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Navigate to the <strong>AI Planner</strong> tab. Configure your target muscles, equipment availability, and training timeframe. WorkoutFlow routes these specs to Gemini server-side to compile structured, custom workouts.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-550/30 font-bold font-mono text-[10px] text-indigo-400 flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">SECURE CHAT AGENT</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Access <strong>Coach Chat</strong> to chat with an athletic trainer. Ask dynamic queries on physical therapy, nutritional timing, or form correction. Conversations are processed and protected securely on the back-end node proxier.
            </p>
          </div>
        </div>

      </main>

      {/* Workspace Footer details */}
      <footer className="border-t border-slate-900 bg-slate-950/80 p-4 shrink-0 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500 font-mono">
          <span>WorkoutFlow Smart Tracker Dashboard • Built using TypeScript, React, and Gemini-3.5-flash</span>
          <div className="flex gap-4">
            <span className="text-emerald-400 animate-pulse">● STABLE PLATFORM SERVER ONLINE</span>
            <span>PROD ID: WORKOUTFLOW_v1.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
