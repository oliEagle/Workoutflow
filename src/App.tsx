import React, { useState } from "react";
import { UserProfile, WorkoutPlan, LoggedWorkout, CoachMessage } from "./types";
import PhoneAppContent from "./components/PhoneAppContent";

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

  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center overflow-hidden antialiased relative">
      {/* Dynamic Ambient Blur Highlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Viewport Container:
          On mobile screen sizes, it expands to 100% full bleed.
          On desktop viewports, it sets a professional iOS physical wrapper frame. */}
      <main className="w-full h-full md:h-[860px] md:max-w-[400px] md:rounded-[48.5px] md:border-[10px] md:border-slate-800/90 md:shadow-2xl md:relative md:overflow-hidden bg-slate-950 flex flex-col transition-all duration-300">
        <PhoneAppContent
          os="ios"
          profile={profile}
          setProfile={setProfile}
          loggedWorkouts={loggedWorkouts}
          setLoggedWorkouts={setLoggedWorkouts}
          activeWorkout={activeWorkout}
          setActiveWorkout={setActiveWorkout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chartData={chartData}
          setChartData={setChartData}
        />
      </main>
    </div>
  );
}
