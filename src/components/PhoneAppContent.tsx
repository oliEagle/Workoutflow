import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Minus, Dumbbell, Award, Flame, Compass, 
  MessageSquare, History, Sparkles, Trophy, Play, 
  CheckCircle2, Search, ArrowRight, RefreshCw, 
  Trash2, HelpCircle, Heart, Droplet, Clock, ArrowLeft,
  ChevronRight, Calendar, User, Zap, Settings2
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { 
  UserProfile, WorkoutPlan, LoggedWorkout, 
  CoachMessage, LibraryExercise, FitnessGoal, 
  FitnessLevel, EquipmentAccess, WorkoutExercise
} from "../types";
import { 
  GOAL_LABELS, LEVEL_LABELS, EQUIPMENT_LABELS, 
  INSTALLED_EXERCISED_DATABASE, INITIAL_LOGGED_WORKOUTS, MOCK_PROGRESS_DATA 
} from "../constants";
import TrophiesView from "./TrophiesView";
import MealPlannerView from "./MealPlannerView";

const BADGE_MAP: Record<string, { label: string; emoji: string }> = {
  "neon-theme": { label: "Neon Cyber", emoji: "🌌" },
  "emerald-theme": { label: "Eco Atleet", emoji: "🌿" },
  "amber-theme": { label: "Amber Pro", emoji: "🌅" },
  "crimson-theme": { label: "Fury Beast", emoji: "🩸" },
  "ai-diet": { label: "Voeding Meester", emoji: "🥑" },
  "pt-scann": { label: "Body Scann", emoji: "🤖" },
  "motivational-audio": { label: "Audio Focus", emoji: "🔊" }
};

interface PhoneAppContentProps {
  os: "ios" | "android";
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  loggedWorkouts: LoggedWorkout[];
  setLoggedWorkouts: React.Dispatch<React.SetStateAction<LoggedWorkout[]>>;
  activeWorkout: WorkoutPlan | null;
  setActiveWorkout: React.Dispatch<React.SetStateAction<WorkoutPlan | null>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chatMessages: CoachMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<CoachMessage[]>>;
  chartData: any[];
  setChartData: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function PhoneAppContent({
  os,
  profile,
  setProfile,
  loggedWorkouts,
  setLoggedWorkouts,
  activeWorkout,
  setActiveWorkout,
  activeTab,
  setActiveTab,
  chatMessages,
  setChatMessages,
  chartData,
  setChartData
}: PhoneAppContentProps) {
  // Onboarding local states
  const [obName, setObName] = useState(profile.name || "");
  const [obAge, setObAge] = useState(profile.age || 25);
  const [obWeight, setObWeight] = useState(profile.weightKg || 75);
  const [obHeight, setObHeight] = useState(profile.heightCm || 180);
  const [obBodyType, setObBodyType] = useState<string>(profile.bodyType || "");
  const [obGoal, setObGoal] = useState<FitnessGoal>(profile.goal || "overall-health");
  const [obError, setObError] = useState<string | null>(null);

  // Sync states on reset
  useEffect(() => {
    if (!profile.onboarded) {
      setObName(profile.name || "");
      setObAge(profile.age || 25);
      setObWeight(profile.weightKg || 75);
      setObHeight(profile.heightCm || 180);
      setObBodyType(profile.bodyType || "");
      setObGoal(profile.goal || "overall-health");
      setObError(null);
    }
  }, [profile.onboarded, profile.name, profile.age, profile.weightKg, profile.heightCm, profile.bodyType, profile.goal]);

  const handleCompleteOnboarding = () => {
    if (!obName.trim()) {
      setObError("Typ a.u.b. je naam in.");
      return;
    }
    if (!obBodyType) {
      setObError("Kies a.u.b. je lichaamstype.");
      return;
    }

    setProfile(prev => ({
      ...prev,
      name: obName,
      age: obAge,
      weightKg: obWeight,
      heightCm: obHeight,
      bodyType: obBodyType,
      goal: obGoal,
      onboarded: true,
      points: 0
    }));

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
  };

  // Page search search fields
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");

  // AI Planner States
  const [aiSubTab, setAiSubTab] = useState<"workout" | "meals">("workout");
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [level, setLevel] = useState<FitnessLevel>(profile.level);
  const [equipment, setEquipment] = useState<EquipmentAccess>(profile.equipment);
  const [duration, setDuration] = useState<number>(45);
  const [targetFocus, setTargetFocus] = useState<string>("Full Body");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [plannerError, setPlannerError] = useState<string | null>(null);

  // Active workout states
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [confettiComplete, setConfettiComplete] = useState(false);

  // Sound cue on set complete using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      oscillator.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5

      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log("Web Audio API not yet fully unlocked or active in browser viewport.");
    }
  };

  // Rest Timer State
  const [restRemaining, setRestRemaining] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active Workout Duration Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeWorkout && isTimerRunning) {
      timer = setInterval(() => {
        setWorkoutDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeWorkout, isTimerRunning]);

  // Rest timer countdown
  useEffect(() => {
    let rTimer: NodeJS.Timeout;
    if (restRemaining > 0) {
      rTimer = setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(rTimer);
  }, [restRemaining]);

  // Initializing activeWorkout details when starting
  const handleStartWorkout = (plan: WorkoutPlan) => {
    const initializedExercises = plan.exercises.map((ex) => {
      const setsCount = typeof ex.sets === 'number' && ex.sets > 0 ? ex.sets : 3;
      return {
        ...ex,
        completedSets: Array(setsCount).fill(false)
      };
    });
    setWorkoutExercises(initializedExercises);
    setActiveWorkout(plan);
    setWorkoutDuration(0);
    setActiveExerciseIndex(0);
    setIsTimerRunning(true);
    setRestRemaining(0);
    setActiveTab("active");
  };

  // Complete a specific set
  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    const updated = [...workoutExercises];
    if (!updated[exIdx].completedSets) {
      updated[exIdx].completedSets = Array(updated[exIdx].sets).fill(false);
    }
    
    const isNowComplete = !updated[exIdx].completedSets![setIdx];
    updated[exIdx].completedSets![setIdx] = isNowComplete;
    setWorkoutExercises(updated);

    if (isNowComplete) {
      playBeep();
      // Start rest timer
      const restSec = updated[exIdx].restSeconds || 45;
      setRestRemaining(restSec);
    }
  };

  // Complete and Log Workout session
  const handleFinishAndSave = () => {
    if (!activeWorkout) return;
    
    setIsTimerRunning(false);
    setRestRemaining(0);

    const logged: LoggedWorkout = {
      id: `log-${Date.now()}`,
      title: activeWorkout.title,
      targetFocus: activeWorkout.targetFocus,
      durationMinutes: Math.max(1, Math.round(workoutDuration / 60)),
      caloriesBurned: activeWorkout.estimatedCaloriesBurned,
      dateTime: new Date().toISOString(),
      exerciseCount: workoutExercises.length
    };

    // Update state lists
    setLoggedWorkouts([logged, ...loggedWorkouts]);
    
    // Update Profile Streaks and achievements along with points! (+200 for completed workout session)
    const newStreak = profile.dailyStreak + 1;
    setProfile(prev => ({
      ...prev,
      dailyStreak: newStreak,
      points: prev.points + 200
    }));

    // Add to chart data
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = dayNames[new Date().getDay()];

    const updatedChartData = chartData.map(d => {
      if (d.day === currentDay) {
        return {
          ...d,
          duration: d.duration + logged.durationMinutes,
          calories: d.calories + logged.caloriesBurned,
          workouts: d.workouts + 1
        };
      }
      return d;
    });
    setChartData(updatedChartData);

    setConfettiComplete(true);
    setActiveWorkout(null);

    setTimeout(() => {
      setConfettiComplete(false);
      setActiveTab("history");
    }, 4000);
  };

  // Coach Chat States
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendChatMessage = async (textToSend?: string) => {
    const rawText = textToSend || chatInput;
    if (!rawText.trim()) return;

    const userMsg: CoachMessage = {
      id: `msg-${Date.now()}`,
      text: rawText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, userMsg] })
      });

      const data = await response.json();
      if (data.success) {
        const coachMsg: CoachMessage = {
          id: `msg-coach-${Date.now()}`,
          text: data.text,
          sender: "coach",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, coachMsg]);
      } else {
        throw new Error(data.error || "Coaching API returned failure status.");
      }
    } catch (e: any) {
      console.error(e);
      const errorMsg: CoachMessage = {
        id: `msg-err-${Date.now()}`,
        text: "I am experiencing brief technical difficulties with connectivity. Make sure your server is online, or try checking your form cues in the exercise manual!",
        sender: "coach",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // AI workout request function
  const handleAIGenerateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiGenerating(true);
    setPlannerError(null);
    setGeneratedPlan(null);

    try {
      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          level,
          equipment,
          duration,
          target: targetFocus
        })
      });

      const data = await response.json();
      if (data.success && data.workoutPlan) {
        setGeneratedPlan(data.workoutPlan);
      } else {
        throw new Error(data.error || "Generation endpoint did not return valid workout plan.");
      }
    } catch (e: any) {
      console.error(e);
      setPlannerError(e.message || "Failed to contact WorkoutFlow AI. Resorting to a local custom protocol.");
      // Fallback local schema so the user has functional data even if developer key is cold/missing
      setGeneratedPlan({
        title: `Eenvoudige Thuis Circuit`,
        targetFocus: targetFocus,
        estimatedDuration: duration,
        estimatedCaloriesBurned: duration * 7.5,
        exercises: [
          {
            name: "Lichte Warming-Up (Opwarmen)",
            sets: 1,
            reps: "5 minuten",
            restSeconds: 20,
            instructions: "Beweeg je armen, schouders en loop rustig op de plaats om warm te worden."
          },
          {
            name: "Klassieke Push-Ups (Opdrukken)",
            sets: 3,
            reps: "10-12 herhalingen",
            restSeconds: 45,
            instructions: "Plaats je handen breder dan je schouders en druk gecontroleerd op."
          },
          ...INSTALLED_EXERCISED_DATABASE.slice(0, 3).map(ex => ({
            name: ex.name,
            sets: 3,
            reps: "10 herhalingen",
            restSeconds: 60,
            instructions: ex.instructions[0] || "Houd je rug goed recht tijdens de oefening."
          })),
          {
            name: "Rustige Stretching (Afkoelen)",
            sets: 1,
            reps: "5 minuten",
            restSeconds: 0,
            instructions: "Rek rustig je benen, armen en borst om de hartslag omlaag te brengen."
          }
        ]
      });
    } finally {
      setAiGenerating(false);
    }
  };

  // Water Intake Increment
  const handleWaterDrink = (amount: number) => {
    // Award 15 points per 250ml water hydration cup
    const pointsAwarded = amount > 0 ? Math.round((amount / 250) * 15) : Math.round((amount / 250) * 15);
    setProfile(prev => ({
      ...prev,
      waterIntakeMl: Math.max(0, prev.waterIntakeMl + amount),
      points: Math.max(0, prev.points + pointsAwarded)
    }));

    // Log to current day's progress data
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = dayNames[new Date().getDay()];
    setChartData(prev => prev.map(d => {
      if (d.day === currentDay) {
        return { ...d, water: d.water + amount };
      }
      return d;
    }));
  };

  // Filter exercises
  const filteredExercises = INSTALLED_EXERCISED_DATABASE.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = muscleFilter === "All" || ex.category.includes(muscleFilter);
    return matchesSearch && matchesMuscle;
  });

  const muscleCategories = ["All", "Legs", "Chest", "Core", "Back", "Arms", "Shoulders"];

  const formatSecToTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

   return (
    <div className={`h-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden relative ${
      os === "ios" ? "md:rounded-[40px]" : "md:rounded-[24px]"
    }`}>
      
      {/* FIRST-TIME PROFILE ONBOARDING ROUTE */}
      {!profile.onboarded && (
        <div className="absolute inset-0 bg-slate-950 z-55 flex flex-col justify-between p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Elegant Header with Active badge symbol */}
            <div className="text-center space-y-1.5 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/35">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-base font-black text-white tracking-tight">Activeer Je Sportprofiel</h2>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-normal">
                Vul je lichaamstype en biologische gegevens in om calorieverbruik-tracking en trainingsplannen te kalibreren.
              </p>
            </div>

            {/* Input Form Fields */}
            <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-900">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[8px] font-mono text-indigo-400 font-bold mb-1 uppercase tracking-tight">VOORNAAM</label>
                  <input 
                    type="text" 
                    value={obName}
                    onChange={(e) => {
                      setObName(e.target.value);
                      setObError(null);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2 py-1.5 text-xs text-white uppercase font-mono tracking-tight outline-none"
                    placeholder="Sporter"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-indigo-400 font-bold mb-1 uppercase tracking-tight">LEEFTIJD</label>
                  <input 
                    type="number" 
                    value={obAge}
                    onChange={(e) => setObAge(Math.max(1, parseInt(e.target.value) || 25))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2 py-1.5 text-xs text-white font-mono outline-none"
                    min="10"
                    max="120"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[8px] font-mono text-indigo-400 font-bold mb-1 uppercase tracking-tight">GEWICHT (KG)</label>
                  <input 
                    type="number" 
                    value={obWeight}
                    onChange={(e) => setObWeight(Math.max(1, parseInt(e.target.value) || 75))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2 py-1.5 text-xs text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-indigo-400 font-bold mb-1 uppercase tracking-tight">LENGTE (CM)</label>
                  <input 
                    type="number" 
                    value={obHeight}
                    onChange={(e) => setObHeight(Math.max(1, parseInt(e.target.value) || 180))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2 py-1.5 text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Body Type Select Section (critical user request part!) */}
              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-indigo-400 font-black uppercase tracking-wider">
                  🧬 LICHAAMSTYPE <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { id: "Ectomorf", emoji: "⚡", title: "Ectomorf", desc: "Slank / Turbo" },
                    { id: "Mesomorf", emoji: "💪", title: "Mesomorf", desc: "Atletisch / Elite" },
                    { id: "Endomorf", emoji: "🔋", title: "Endomorf", desc: "Vol / Kracht" }
                  ].map((bt) => (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => {
                        setObBodyType(bt.id);
                        setObError(null);
                      }}
                      className={`p-2 rounded-xl text-left border flex flex-col justify-between h-14 transition-all cursor-pointer ${
                        obBodyType === bt.id 
                          ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/40" 
                          : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <span className="text-xs">{bt.emoji}</span>
                      <div className="leading-tight mt-1">
                        <span className="text-[9px] font-black block">{bt.title}</span>
                        <span className="text-[6.5px] text-slate-500 block truncate">{bt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Training Goal Selector */}
              <div>
                <label className="block text-[8px] font-mono text-indigo-400 font-bold mb-1 uppercase tracking-tight">TRAININGSDOEL</label>
                <select
                  value={obGoal}
                  onChange={(e) => setObGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
                >
                  <option value="overall-health">Fit & Gezondheid</option>
                  <option value="clean-bulk">Spiermassa Opbouwen</option>
                  <option value="fat-loss">Vetmassa Verliezen</option>
                  <option value="strength">Maximale Kracht</option>
                  <option value="endurance">Conditie & Endurance</option>
                </select>
              </div>
            </div>

            {/* Calories starts at 0 info card */}
            <div className="bg-emerald-950/20 border border-emerald-900/20 p-3 rounded-2xl flex gap-2 text-left">
              <span className="text-sm">⚖️</span>
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">CALORIEËN METEN: START OP 0 KCAL</span>
                <p className="text-[9.5px] text-slate-350 leading-relaxed font-sans">
                  Volledig schoon begin. Je verbruikte calorieën van vandaag staan op **0 kcal** en zullen opgeteld worden zodra je trainingen start.
                </p>
              </div>
            </div>

            {obError && (
              <p className="text-[10px] font-mono font-bold text-red-400 text-center">{obError}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleCompleteOnboarding}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white rounded-xl shadow-md tracking-tight uppercase active:scale-95 transition-all text-center cursor-pointer font-sans mt-3"
          >
            Mijn Profiel Opslaan & Beginnen 🚀
          </button>
        </div>
      )}
      
      {/* 1. Confetti Overlays for Completed Session! */}
      <AnimatePresence>
        {confettiComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.3, y: 50 }}
              animate={{ scale: [1, 1.1, 1], y: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/10 mb-6"
            >
              <Trophy className="w-12 h-12 text-slate-950" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-amber-400 leading-tight"
            >
              Workout Completed!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-sm mt-2 max-w-sm"
            >
              Incredible work pushing through the active set intervals. Your bio-stats have been compiled and updated successfully.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4 mt-8 w-full max-w-xs bg-slate-900 border border-slate-800 p-4 rounded-xl"
            >
              <div className="text-center">
                <span className="block text-xs text-slate-500 font-mono">STREAK</span>
                <span className="text-xl font-extrabold text-white flex items-center justify-center gap-1 mt-1">
                  <Flame className="w-5 h-5 text-red-500 fill-red-500" />
                  {profile.dailyStreak} Days
                </span>
              </div>
              <div className="text-center border-l border-slate-800">
                <span className="block text-xs text-slate-500 font-mono">EST. BURN</span>
                <span className="text-xl font-extrabold text-amber-500 mt-1 block">
                  ~{activeWorkout?.estimatedCaloriesBurned || 350} kcal
                </span>
              </div>
            </motion.div>

            <span className="text-xs text-emerald-400 font-mono mt-8 animate-pulse">
              SYNCING WITH WORKOUTFLOW CLOUD...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Physical Device Top Margin Cutout Mock */}
      <div className={`shrink-0 z-30 flex justify-between items-center bg-slate-950 px-6 ${
        os === "ios" ? "h-12 pt-4 pb-1" : "h-10 pt-2 pb-1"
      }`}>
        <span className="text-xs font-semibold tracking-tight text-slate-200">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        
        {/* Dynamic Island cut/Bezel highlights */}
        {os === "ios" ? (
          <div className="h-4 w-28 bg-slate-900 border border-slate-800/80 rounded-full flex items-center justify-between px-3 relative shadow-inner overflow-hidden">
            {/* Show tiny active indicators in dynamic island */}
            {activeWorkout ? (
              <div className="flex items-center gap-1.5 w-full justify-center">
                <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500 animate-pulse" />
                <span className="text-[9px] font-mono font-medium text-emerald-400">
                  {formatSecToTime(workoutDuration)}
                </span>
              </div>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950 absolute left-2" />
            )}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950 absolute right-2" />
          </div>
        ) : (
          <div className="h-3 w-3 rounded-full bg-slate-900 border border-slate-800 absolute left-1/2 -translate-x-1/2 mt-0.5" />
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Droplet className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[10px] font-mono mr-1">
            {profile.waterIntakeMl}/{profile.waterGoalMl}ml
          </span>
          <span className="text-[10px] font-mono">100%</span>
          <div className="w-6 h-3 border border-slate-700 rounded-sm p-0.5 flex">
            <div className="w-full h-full bg-slate-300 rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* 3. On-Device Top Header */}
      <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-900 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              WorkoutFlow
              <span className={`text-[9px] px-1 pb-0.5 rounded border ${
                os === "ios" ? "bg-slate-900 border-indigo-500/30 text-indigo-400" : "bg-indigo-950/40 border-indigo-600/40 text-indigo-300"
              }`}>
                {os.toUpperCase()}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 leading-tight">AI Kinetic Tracker</p>
          </div>
        </div>

        {/* Streak active badge */}
        <div className="flex items-center gap-1 bg-slate-900 py-1 px-2.5 rounded-full border border-slate-800">
          <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span className="text-xs font-mono font-bold text-slate-200">{profile.dailyStreak}d</span>
        </div>
      </div>

      {/* 4. Active Rest Timer Toast Indicator */}
      <AnimatePresence>
        {restRemaining > 0 && (
          <motion.div 
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="absolute top-14 left-4 right-4 bg-indigo-900 border border-indigo-500/30 text-white rounded-xl py-2 px-4 shadow-lg shadow-indigo-950/40 flex items-center justify-between z-40"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-300 animate-spin" />
              <div className="text-left">
                <span className="block text-[10px] text-indigo-300 font-mono tracking-wider upper">REST INTERVAL ACTIVE</span>
                <span className="text-sm font-bold block leading-none">Breathe & recover muscle energy</span>
              </div>
            </div>
            <span className="text-xl font-bold font-mono text-emerald-400">{restRemaining}s</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Main App Content View Hub */}
      <div className="flex-1 overflow-y-auto px-4 py-3 relative bg-slate-950/40 z-0">
        
        {/* TAB 1: HOME (DASHBOARD) */}
        {activeTab === "home" && (
          <div className="space-y-4">
            
            {/* Quick Greeting */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center flex-wrap gap-1.5">
                  Hi, {profile.name || "Sporter"}
                  {profile.selectedBadge && BADGE_MAP[profile.selectedBadge] && (
                    <span 
                      title={BADGE_MAP[profile.selectedBadge].label}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono tracking-tight cursor-default"
                    >
                      <span className="text-[10px]">{BADGE_MAP[profile.selectedBadge].emoji}</span>
                      <span>{BADGE_MAP[profile.selectedBadge].label.toUpperCase()}</span>
                    </span>
                  )}
                  <Compass className="w-4 h-4 text-indigo-400" />
                </h3>
                <p className="text-xs text-slate-400">Let's dominate today's targets</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="block text-[10px] text-slate-500 font-mono">LEVEL</span>
                <span className="text-xs font-bold text-indigo-400">{profile.level.toUpperCase()}</span>
                <button 
                  onClick={() => setProfile(p => ({ ...p, onboarded: false }))}
                  className="mt-1 flex items-center gap-1 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-505/10 border border-indigo-500/25 px-1.5 py-0.5 rounded cursor-pointer active:scale-95 transition-all"
                  title="Profile settings"
                >
                  <Settings2 className="w-2.5 h-2.5" /> Profiel
                </button>
              </div>
            </div>

            {/* Quick Stats Grid Summary */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-900/80 border border-slate-900 p-2.5 rounded-xl text-center flex flex-col justify-between h-20 shadow-sm">
                <span className="text-[10px] text-slate-400 font-medium">Daily Water</span>
                <Droplet className="w-4 h-4 text-sky-400 mx-auto my-1" />
                <span className="text-xs font-mono font-bold text-white leading-none">
                  {profile.waterIntakeMl} ml
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-900 p-2.5 rounded-xl text-center flex flex-col justify-between h-20 shadow-sm">
                <span className="text-[10px] text-slate-400 font-medium">Goal Focus</span>
                <Dumbbell className="w-4 h-4 text-indigo-500 mx-auto my-1" />
                <span className="text-[9px] font-bold text-slate-300 leading-tight">
                  {profile.goal === 'fat-loss' ? 'Fat Loss' : profile.goal === 'clean-bulk' ? 'Bulk Up' : 'Strength'}
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-900 p-2.5 rounded-xl text-center flex flex-col justify-between h-20 shadow-sm">
                <span className="text-[10px] text-slate-400 font-medium">Equipment</span>
                <Compass className="w-4 h-4 text-emerald-400 mx-auto my-1" />
                <span className="text-[9px] font-bold text-slate-300 leading-tight truncate">
                  {profile.equipment === 'full-gym' ? 'Full Gym' : profile.equipment === 'dumbbells' ? 'Dumbbells' : profile.equipment === 'bands' ? 'Banden' : 'Thuis (Home)'}
                </span>
              </div>
            </div>

            {/* Daily Targets Widgets */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-4 rounded-xl border border-indigo-950/50 space-y-3 relative overflow-hidden">
              <div className="absolute top-12 right-2 opacity-5 pointer-events-none">
                <Flame className="w-32 h-32 text-indigo-505" />
              </div>

              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold font-mono tracking-wider text-indigo-300">ACTIVE LOGS THIS WEEK</h4>
                <div className="text-[10px] text-indigo-400 font-bold flex items-center gap-1 uppercase">
                  ACTIVE GOAL MET <Award className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-sky-400" /> Hydration Level
                    </span>
                    <span className="text-white font-mono font-bold">
                      {Math.round((profile.waterIntakeMl / profile.waterGoalMl) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (profile.waterIntakeMl / profile.waterGoalMl) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Est. Calories Burned
                    </span>
                    <span className="text-white font-mono font-bold">710 kcal / 1.5k Target</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full" 
                      style={{ width: `47%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Water logging triggers */}
              <div className="pt-2 border-t border-slate-900 flex justify-between items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono">LOG HYDRATION</span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleWaterDrink(250)}
                    className="py-1 px-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 text-[10px] font-bold text-sky-400 flex items-center gap-1 active:scale-95"
                  >
                    +250ml
                  </button>
                  <button 
                    onClick={() => handleWaterDrink(500)}
                    className="py-1 px-3 bg-indigo-950/40 border border-indigo-800/40 rounded-lg hover:border-indigo-700 text-[10px] font-bold text-sky-400 flex items-center gap-1 active:scale-95"
                  >
                    +500ml
                  </button>
                  <button 
                    onClick={() => handleWaterDrink(-250)}
                    className="p-1 px-2.5 bg-slate-950 border border-slate-900 rounded-lg text-[10px] text-slate-400 hover:text-slate-200 active:scale-95"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Call to Action banner */}
            <div className="bg-indigo-600/95 text-white p-4 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between h-36">
              {/* background vector highlights */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-transparent to-indigo-800 opacity-20 pointer-events-none" />
              <div className="absolute top-2 right-2">
                <Sparkles className="w-8 h-8 text-indigo-200 opacity-30 animate-pulse" />
              </div>

              <div className="z-10">
                <span className="text-[9px] font-mono tracking-widest bg-indigo-500/40 rounded px-1.5 py-0.5 text-indigo-100 font-bold">
                  GEMINI ACTIVE ENGINE
                </span>
                <h4 className="text-sm font-extrabold tracking-tight mt-1">Need a Custom AI Gym Routine?</h4>
                <p className="text-[10px] text-indigo-100 mt-1 max-w-[210px] leading-snug">
                  WorkoutFlow matches your local parameters, level, and apparatus to compile biological progressions.
                </p>
              </div>

              <button 
                onClick={() => setActiveTab("ai")}
                className="z-10 bg-white text-indigo-950 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 select-none hover:bg-slate-100 hover:translate-x-0.5 transition-all active:scale-95 text-center mt-2.5"
              >
                Launch AI Planner <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rapid suggestions */}
            <div>
              <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 mb-2">QUICK FITNESS TRIVIA</h4>
              <div className="bg-slate-900 border border-slate-900 p-3 rounded-xl text-xs text-slate-300 leading-relaxed">
                <HelpCircle className="w-4 h-4 text-indigo-400 inline mr-2 align-middle" />
                Hydration increases metabolic efficacy by as much as 30%! Drink 500ml before workout to maximize cell volume and combat fatigue on high intensity intervals.
              </div>
            </div>

            {/* COLLAPSIBLE KINETIC EXERCISE INDEX */}
            <div id="collapsible_exercise_atlas" className="bg-slate-900/40 border border-slate-900 p-3.5 rounded-xl">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer select-none outline-none">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Compass className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold font-mono tracking-wide">BIOMECHANICAL GUIDE ATLAS</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                </summary>

                <div className="pt-3.5 space-y-3.5 border-t border-slate-950 mt-3.5 text-left">
                  {/* Search Input bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Search squats, row, plank..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Muscle Filter horizontal tabs */}
                  <div className="flex gap-1 overflow-x-auto pb-1 invisible-scrollbar">
                    {muscleCategories.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMuscleFilter(m)}
                        className={`text-[9px] font-bold py-0.5 px-2 rounded-full shrink-0 border transition-all ${
                          muscleFilter === m 
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" 
                            : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* List scroll */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {filteredExercises.map((ex, idx) => (
                      <details 
                        key={idx} 
                        className="group bg-slate-950 border border-slate-900/50 rounded-lg overflow-hidden text-left"
                      >
                        <summary className="flex justify-between items-center p-2 cursor-pointer select-none outline-none hover:bg-slate-900/60">
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="text-[10px] font-bold text-slate-200 group-open:text-emerald-400 leading-snug break-words">
                              {ex.name}
                            </h4>
                            <span className="text-[8px] text-slate-405 font-mono block mt-0.5">
                              {ex.category} • {ex.equipment}
                            </span>
                          </div>
                          <span className="text-[8px] font-mono text-slate-500 group-open:rotate-90 transition-transform">
                            ▶
                          </span>
                        </summary>
                        
                        <div className="p-2.5 border-t border-slate-950 bg-slate-950/20 space-y-1.5">
                          <span className="text-[8px] text-slate-500 font-mono block uppercase">TECHNIQUE STEPS</span>
                          <ol className="list-decimal list-inside text-[10px] text-slate-300 space-y-0.5 pl-1 leading-relaxed">
                            {ex.instructions.map((ins, iIdx) => (
                              <li key={iIdx} className="align-middle pl-0.5">{ins}</li>
                            ))}
                          </ol>
                          <div className="mt-1 bg-indigo-950/10 border border-indigo-950/30 p-2 rounded text-[9px] text-indigo-300">
                            <strong>Coach Pro-Tip:</strong> {ex.tips}
                          </div>
                        </div>
                      </details>
                    ))}

                    {filteredExercises.length === 0 && (
                      <div className="py-4 text-center text-[10px] text-slate-500">
                        No matches found for criteria.
                      </div>
                    )}
                  </div>
                </div>
              </details>
            </div>

          </div>
        )}

        {/* TAB 2: AI WORKOUT PLANNER */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Gym Protocol
              </h3>
              <span className="text-[10px] text-indigo-400 font-mono font-bold text-right uppercase">Gemini Active</span>
            </div>

            {/* AI Toggle Subtabs */}
            <div className="flex p-0.5 bg-slate-950/45 rounded-xl border border-slate-900">
              <button
                type="button"
                onClick={() => setAiSubTab("workout")}
                className={`flex-1 py-1.5 text-[9px] uppercase font-mono font-extrabold text-center rounded-lg transition-all ${
                  aiSubTab === "workout"
                    ? "bg-indigo-600 text-white shadow shadow-indigo-600/15"
                    : "text-slate-500 hover:text-slate-350 cursor-pointer"
                }`}
              >
                🏋️ Workout Builder
              </button>
              <button
                type="button"
                onClick={() => setAiSubTab("meals")}
                className={`flex-1 py-1.5 text-[9px] uppercase font-mono font-extrabold text-center rounded-lg transition-all ${
                  aiSubTab === "meals"
                    ? "bg-emerald-600/90 text-white shadow shadow-emerald-500/15"
                    : "text-slate-500 hover:text-slate-355 cursor-pointer"
                }`}
              >
                🥗 Meal Planner
              </button>
            </div>

            {aiSubTab === "workout" ? (
              <div className="space-y-4">
                {!generatedPlan && !aiGenerating && (
                  <form onSubmit={handleAIGenerateWorkout} className="space-y-4">
                    
                    {/* 1. Target Focus Group */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 font-mono">TARGET MUSCLES</label>
                      <select 
                        value={targetFocus}
                        onChange={(e) => setTargetFocus(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Full Body Primary">Full Body Primary</option>
                        <option value="Push Day (Chest, Shoulders, Triceps)">Push Day (Chest, Shoulders, Triceps)</option>
                        <option value="Pull Day (Back, Biceps, Rear Delts)">Pull Day (Back, Biceps, Rear Delts)</option>
                        <option value="Glutes & Hamstrings Focus">Glutes & Hamstrings Focus</option>
                        <option value="Quads & Calves Focus">Quads & Calves Focus</option>
                        <option value="Heavy Core Strength">Heavy Core Strength & Posture</option>
                      </select>
                    </div>

                    {/* 2. Fitness Level */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 font-mono">YOUR RE-EVALUATED LEVEL</label>
                      <div className="grid grid-cols-3 gap-1 px-0.5">
                        {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setLevel(l)}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                              level === l 
                                ? "bg-indigo-600 border-indigo-500 text-white shadow" 
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {l.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Goal Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 font-mono">SESSION GOAL FOCUS</label>
                      <select 
                        value={goal}
                        onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-505"
                      >
                        {Object.entries(GOAL_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>

                    {/* 4. Equipment */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 font-mono">APPARATUS ACCESS (MATERIAAL / HOME / THUIS)</label>
                      <select 
                        value={equipment}
                        onChange={(e) => setEquipment(e.target.value as EquipmentAccess)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-505"
                      >
                        {Object.entries(EQUIPMENT_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>

                    {/* 5. Target Duration */}
                    <div>
                      <label className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 font-mono">
                        <span>TARGET TIME LIMIT</span>
                        <span className="text-indigo-400 font-extrabold">{duration} Minutes</span>
                      </label>
                      <input 
                        type="range" 
                        min="15" 
                        max="90" 
                        step="5"
                        value={duration} 
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                        <span>15m Circuit</span>
                        <span>45m Steady</span>
                        <span>90m Heavy Lift</span>
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 active:scale-95 transition-all mt-4"
                    >
                      <Sparkles className="w-4 h-4" /> Assemble Custom AI Protocol
                    </button>
                  </form>
                )}

                {/* AI GENERATING MOCK STATE */}
                {aiGenerating && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-indigo-900/30 border-t-2 border-t-indigo-500 animate-spin" />
                      <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">AI Kinetic Synthesizer Running</h4>
                      <p className="text-[10px] text-slate-400 max-w-[220px] mx-auto mt-2 leading-relaxed">
                        Analyzing biomechanics data, filtering available apparatus, adjusting set ratios, and crafting caloric curves...
                      </p>
                    </div>
                    <div className="w-40 bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-lg text-[9px] text-slate-500 font-mono leading-tight">
                      USING GEMINI FLASH 3.5
                    </div>
                  </div>
                )}

                {/* AI PLAN READY VIEW */}
                {generatedPlan && !aiGenerating && (
                  <div className="space-y-4">
                    
                    {/* Header overview card */}
                    <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 p-4 rounded-xl border border-indigo-950/30">
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded">
                        {generatedPlan.targetFocus.toUpperCase()}
                      </span>
                      
                      <h4 className="text-base font-extrabold text-white mt-1.5">{generatedPlan.title}</h4>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-900">
                        <div className="text-left">
                          <span className="block text-[10px] text-slate-500 font-mono leading-none">EST. TIMEFRAME</span>
                          <span className="text-xs font-bold text-white mt-1 block flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {generatedPlan.estimatedDuration} minutes
                          </span>
                        </div>
                        <div className="text-left border-l border-slate-900 pl-3">
                          <span className="block text-[10px] text-slate-500 font-mono leading-none">ENERGY METRICS</span>
                          <span className="text-xs font-bold text-amber-500 mt-1 block flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            ~{generatedPlan.estimatedCaloriesBurned} kcal
                          </span>
                        </div>
                      </div>
                    </div>

                    {plannerError && (
                      <div className="text-[10px] bg-amber-950/40 border border-amber-900/30 text-amber-300 p-2.5 rounded-lg">
                        ⚠️ API Key missing/slow status. Activated local safety generator protocol.
                      </div>
                    )}

                    {/* Exercises Stack List */}
                    <h5 className="text-xs font-bold font-mono text-slate-400">EXERCISE PROGRESSION SCHEDULE</h5>
                    
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {generatedPlan.exercises.map((ex, idx) => (
                        <div key={idx} className="bg-slate-900/80 border border-slate-900 p-2.5 rounded-lg flex justify-between gap-3">
                          <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-mono text-indigo-400 font-bold">
                                {(idx + 1).toString().padStart(2, '0')}.
                              </span>
                              <h6 className="text-[11px] font-bold text-slate-200 leading-snug break-words">{ex.name}</h6>
                            </div>
                            <p className="text-[9px] text-slate-400 leading-relaxed mt-1">{ex.instructions}</p>
                          </div>

                          <div className="shrink-0 text-right min-w-[70px]">
                            <span className="block text-[10px] text-white font-bold font-mono">
                              {ex.sets}s × {ex.reps}
                            </span>
                            <span className="block text-[9px] text-slate-500 font-mono mt-1">
                              Rest: {ex.restSeconds}s
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action build buttons */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <button
                        onClick={() => setGeneratedPlan(null)}
                        className="py-2.5 bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-400 rounded-lg active:scale-95 transition-all text-center"
                      >
                        Adjust Settings
                      </button>
                      <button
                        onClick={() => handleStartWorkout(generatedPlan)}
                        className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-[11px] font-extrabold text-white rounded-lg flex items-center justify-center gap-1 shadow shadow-indigo-600/10 active:scale-95 transition-all text-center"
                      >
                        <Play className="w-3.5 h-3.5 text-white fill-white" /> Start This Workout
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <MealPlannerView 
                profile={profile}
                setProfile={setProfile}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab);
                  setRestRemaining(0);
                }}
              />
            )}

          </div>
        )}

        {/* TAB 3: ACTIVE WORKOUT TRACKER */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {!activeWorkout ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <Dumbbell className="w-12 h-12 text-slate-600 stroke-[1.5]" />
                <div>
                  <h4 className="text-sm font-bold text-slate-300">No Active Workout Session</h4>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mt-1.5 mx-auto leading-relaxed">
                    Head to the AI Builder tab to generate a highly customized metabolic routine.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab("ai")}
                  className="py-2 px-4 bg-indigo-600 text-xs font-bold text-white rounded-lg hover:bg-indigo-500 active:scale-95"
                >
                  Configure AI Routine
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Timer details panel */}
                <div className="bg-slate-900 border border-slate-900 p-3 rounded-xl flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase">CURRENT DRILL TIME</span>
                    <span className="text-2xl font-extrabold font-mono text-emerald-400 tracking-tight leading-none mt-1 inline-block">
                      {formatSecToTime(workoutDuration)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 ${
                        isTimerRunning 
                          ? "bg-amber-950/40 border border-amber-805/40 text-amber-400" 
                          : "bg-emerald-950/40 border border-emerald-805/40 text-emerald-400"
                      }`}
                    >
                      {isTimerRunning ? "PAUSE" : "RESUME"}
                    </button>
                    <button
                      onClick={handleFinishAndSave}
                      className="bg-indigo-600 text-[11px] font-extrabold text-white px-3 py-1.5 rounded-lg shadow-sm active:scale-95 hover:bg-indigo-500"
                    >
                      AFRONDEN (FINISH)
                    </button>
                  </div>
                </div>

                {/* Mini tracker indicators */}
                <div className="flex justify-between items-center gap-2">
                  <h5 className="text-[10px] font-bold font-mono text-slate-500">EXERCISES CHRONOLOGY</h5>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">
                    Exercise {activeExerciseIndex + 1} of {workoutExercises.length}
                  </span>
                </div>

                {/* Left/Right active slide helper */}
                <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 rounded-xl border border-indigo-950/20 p-4 space-y-3">
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="text-left min-w-0 flex-1">
                      <span className="text-[9px] bg-indigo-600/20 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded">
                        Active Drill Focus
                      </span>
                      <h4 className="text-base font-extrabold text-white mt-1.5 leading-snug break-words">
                        {workoutExercises[activeExerciseIndex]?.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                        💡 {workoutExercises[activeExerciseIndex]?.instructions}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-black text-indigo-400 bg-slate-950/50 py-1 px-2 rounded-lg border border-slate-900 block">
                        {workoutExercises[activeExerciseIndex]?.sets} Sets
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block mt-1">
                        {workoutExercises[activeExerciseIndex]?.reps} / set
                      </span>
                    </div>
                  </div>

                  {/* Rest indicator override visual within active card */}
                  <div className="pt-3 border-t border-slate-900 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">INTERVAL DEMAND</span>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-950/90 py-0.5 px-2 rounded border border-slate-800">
                      Rest Limit: {workoutExercises[activeExerciseIndex]?.restSeconds}s
                    </span>
                  </div>

                  {/* SET CONSOLE BOXES */}
                  <div className="space-y-1.5 pt-1">
                    {Array.from({ length: workoutExercises[activeExerciseIndex]?.sets || 3 }).map((_, setIdx) => {
                      const completed = workoutExercises[activeExerciseIndex]?.completedSets?.[setIdx] || false;
                      return (
                        <div 
                          key={setIdx} 
                          onClick={() => toggleSetComplete(activeExerciseIndex, setIdx)}
                          className={`flex justify-between items-center py-2 px-3 rounded-lg border cursor-pointer active:scale-[0.99] transition-all select-none ${
                            completed 
                              ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300 line-through decoration-slate-600" 
                              : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200"
                          }`}
                        >
                          <span className="text-[11px] font-bold font-mono tracking-wide">
                            SET {(setIdx+1).toString().padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">
                              {workoutExercises[activeExerciseIndex]?.reps}
                            </span>
                            {completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950/10" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-700" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Progress back / forward buttons */}
                <div className="flex gap-2 justify-between items-center pt-1">
                  <button
                    disabled={activeExerciseIndex === 0}
                    onClick={() => {
                      setActiveExerciseIndex(prev => prev - 1);
                      setRestRemaining(0);
                    }}
                    className="py-2 px-4 bg-slate-900 text-[10px] font-bold rounded-lg text-slate-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                  >
                    VORIGE OEFENING (PREV)
                  </button>

                  {activeExerciseIndex === workoutExercises.length - 1 ? (
                    <button
                      onClick={handleFinishAndSave}
                      className="py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-[10px] font-extrabold rounded-lg text-white shadow shadow-emerald-500/20 active:scale-95 animate-pulse"
                    >
                      FINISHED! TRAINING AFRONDEN 🎉
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveExerciseIndex(prev => prev + 1);
                        setRestRemaining(0);
                      }}
                      className="py-2 px-4 bg-slate-900 text-[10px] font-bold rounded-lg text-slate-300 hover:bg-slate-800 active:scale-95"
                    >
                      VOLGENDE OEFENING (NEXT)
                    </button>
                  )}
                </div>

                {/* Quick instruction notice */}
                <div className="rounded-xl border border-yellow-950/40 bg-yellow-950/10 p-3 text-left">
                  <p className="text-[10px] leading-relaxed text-yellow-300 font-medium">
                    ⚠️ Rest guidelines help replenish muscular adenosine triphosphate (ATP) stores. Checking off any set activates your rest cycle.
                  </p>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 4: AI PT COACH CHAT */}
        {activeTab === "coach" && (
          <div className="h-[390px] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400 animate-pulse" /> WorkoutFlow PT Coach
              </h3>
              <span className="text-[9px] text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/30 animate-pulse">
                ONLINE
              </span>
            </div>

            {/* Quick Helper Floating Prompts */}
            {chatMessages.length <= 1 && (
              <div className="py-2 shrink-0">
                <p className="text-[10px] font-semibold text-slate-500 mb-1.5 text-left font-mono">RECOMMENDED AGENT INQUIRIES</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "How do I fix my squat depth?",
                    "Give me a high protein post lift meal",
                    "Should I rest 60s or 90s for strength?",
                    "What limits lower back fatigue in RDLs?"
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendChatMessage(chip)}
                      className="text-[9px] bg-indigo-950/20 hover:bg-indigo-950/45 text-indigo-300 border border-indigo-900/40 rounded-full py-1 px-2.5 text-left active:scale-[0.98] select-none"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chats Container Space */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
                >
                  {msg.sender === "coach" && (
                    <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shrink-0 shadow shadow-indigo-600/10 text-white text-[10px] font-bold">
                      WF
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-xl p-2.5 text-[11px] leading-relaxed text-left ${
                    msg.sender === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-slate-900 border border-slate-900 text-slate-300 rounded-tl-none whitespace-pre-wrap"
                  }`}>
                    {msg.text}
                    <span className="block text-[8px] text-slate-500 font-mono text-right mt-1.5">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shrink-0 text-white text-[10px] font-bold animate-bounce">
                    WF
                  </div>
                  <div className="bg-slate-900 border border-slate-900 rounded-xl rounded-tl-none p-3 max-w-[85%] text-left flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-medium">Coach is thinking...</span>
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom Keyboard text input */}
            <div className="pt-2 border-t border-slate-900 flex gap-2 shrink-0 bg-slate-950">
              <input
                type="text"
                placeholder="Ask Coach about workouts, meals, form..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />
              <button 
                onClick={() => handleSendChatMessage()}
                disabled={!chatInput.trim()}
                className="bg-indigo-600 disabled:opacity-40 disabled:pointer-events-none hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center select-none active:scale-95"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: KINETIC TROPHIES MASTERBOARD */}
        {activeTab === "trophies" && (
          <div className="space-y-4">
            <TrophiesView 
              profile={profile}
              setProfile={setProfile}
              loggedWorkouts={loggedWorkouts}
              chartData={chartData}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                setRestRemaining(0);
              }}
            />
          </div>
        )}

        {/* TAB 6: HISTORY & ANALYTICS SECTION */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-400" /> Bio-Analytics
              </h3>
              <span className="text-[9px] text-slate-400 font-mono">REALTIME PROGRESSION</span>
            </div>

            {/* High fidelity Recharts Bar Chart mapping active duration and water */}
            <div className="bg-slate-900 border border-slate-900 p-3 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider text-left">
                CALORIC EXERTION BY WEEKDAY
              </span>
              
              {/* Chart container */}
              <div className="h-32 w-full mt-1.5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff', fontSize: '10px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#818cf8', fontSize: '10px' }}
                    />
                    <Bar dataKey="calories" fill="#4f46e5" radius={[4, 4, 0, 0]} name="kcal" />
                    <Bar dataKey="duration" fill="#10b981" radius={[4, 4, 0, 0]} name="mins" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center gap-4 text-[9px] font-mono text-slate-500 border-t border-slate-950/80 pt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
                  <span>Calories Expelled (kcal)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span>Drill Duration (mins)</span>
                </div>
              </div>
            </div>

            {/* Historic Workout Logged Card */}
            <h4 className="text-xs font-bold font-mono text-slate-400">HISTORY OF SESSIONS</h4>
            
            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              {loggedWorkouts.map((wl) => (
                <div 
                  key={wl.id} 
                  className="bg-slate-900 border border-slate-900/50 p-3 rounded-xl flex justify-between items-center text-left"
                >
                  <div className="min-w-0 flex-1">
                    <h5 className="text-[11px] font-bold text-slate-200 leading-tight break-words">{wl.title}</h5>
                    <span className="text-[9px] text-slate-500 font-mono mt-1 block">
                      {wl.targetFocus} • {wl.exerciseCount} segments
                    </span>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <span className="text-xs font-bold font-mono text-white block">
                      {wl.durationMinutes} mins
                    </span>
                    <span className="text-[9px] text-amber-500 font-mono font-bold mt-1 block">
                      ~{wl.caloriesBurned} kcal
                    </span>
                  </div>
                </div>
              ))}

              {loggedWorkouts.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No exercises completed yet! Hit a drill and complete sets to compile metrics.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* 6. On-Device Native App Bottom Navigation Bar */}
      <div className="shrink-0 bg-slate-950 border-t border-slate-900 px-3 py-1 flex justify-around items-center z-10">
        {[
          { key: "home", icon: Compass, label: "Home" },
          { key: "ai", icon: Sparkles, label: "AI Planner" },
          { key: "active", icon: Dumbbell, label: "Tracker" },
          { key: "coach", icon: MessageSquare, label: "Coach Chat" },
          { key: "trophies", icon: Trophy, label: "Trophies" },
          { key: "history", icon: History, label: "Stats" }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isSelected = activeTab === tab.key;
          
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setRestRemaining(0);
              }}
              className="flex flex-col items-center py-1.5 px-2 bg-transparent select-none cursor-pointer focus:outline-none focus:ring-0 active:scale-90 transition-transform relative"
            >
              <IconComponent className={`w-4 h-4 transition-colors ${
                isSelected ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
              }`} />
              <span className={`text-[9px] mt-1 font-semibold tracking-tight transition-colors ${
                isSelected ? "text-indigo-400" : "text-slate-500"
              }`}>
                {tab.label}
              </span>
              
              {/* Highlight dash */}
              {isSelected && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 h-0.5 w-6 bg-indigo-500 rounded-full" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 7. physical phone system swipe bars */}
      <div className="h-4 shrink-0 bg-slate-950 flex justify-center items-center pb-1">
        {os === "ios" ? (
          <div className="w-24 h-1 bg-slate-700 rounded-full" />
        ) : (
          <div className="flex gap-4 items-center">
            <div className="w-2.5 h-2.5 border border-slate-700 rotate-45 rounded-[1px]" />
            <div className="w-2.5 h-2.5 rounded-full border border-slate-700" />
            <div className="w-2.5 h-2 text-slate-700 flex items-center justify-center font-bold text-xs select-none">◀</div>
          </div>
        )}
      </div>

    </div>
  );
}
