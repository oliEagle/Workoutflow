import React, { useState } from "react";
import { 
  Smartphone, Apple, Chrome, Settings2, Sparkles, 
  HelpCircle, Volume2, Power, RotateCcw, Flame, 
  Compass, Laptop, Moon, Sun, Info, Check, Edit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, WorkoutPlan, LoggedWorkout, CoachMessage } from "../types";
import { GOAL_LABELS, LEVEL_LABELS, EQUIPMENT_LABELS } from "../constants";
import PhoneAppContent from "./PhoneAppContent";

interface PhoneSimulatorProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  loggedWorkouts: LoggedWorkout[];
  setLoggedWorkouts: React.Dispatch<React.SetStateAction<LoggedWorkout[]>>;
  activeWorkout: WorkoutPlan | null;
  setActiveWorkout: React.Dispatch<React.SetStateAction<WorkoutPlan | null>>;
  chatMessages: CoachMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<CoachMessage[]>>;
  chartData: any[];
  setChartData: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function PhoneSimulator({
  profile,
  setProfile,
  loggedWorkouts,
  setLoggedWorkouts,
  activeWorkout,
  setActiveWorkout,
  chatMessages,
  setChatMessages,
  chartData,
  setChartData
}: PhoneSimulatorProps) {
  // Mobile frame settings
  const [simulatorView, setSimulatorView] = useState<"both" | "ios" | "android">("both");
  const [iphoneLocked, setIphoneLocked] = useState(false);
  const [pixelLocked, setPixelLocked] = useState(false);
  
  // Interactive HUD volume states
  const [iphoneVolume, setIphoneVolume] = useState(70);
  const [pixelVolume, setPixelVolume] = useState(65);
  const [showIphoneVolHud, setShowIphoneVolHud] = useState(false);
  const [showPixelVolHud, setShowPixelVolHud] = useState(false);
  const [volumeTimeout, setVolumeTimeout] = useState<any>(null);

  // Tab selections inside the phone (synchronized by default so the user feels consistency, but independent is also fine)
  // Let's keep them unified so standard clicks change pages across both!
  const [activeTab, setActiveTab] = useState("home");

  // Profile Customizer Overlay Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>({ ...profile });

  const triggerVolumeHud = (device: "ios" | "android", direction: "up" | "down") => {
    if (device === "ios") {
      setIphoneVolume(prev => {
        const newVal = direction === "up" ? Math.min(100, prev + 10) : Math.max(0, prev - 10);
        return newVal;
      });
      setShowIphoneVolHud(true);
      if (volumeTimeout) clearTimeout(volumeTimeout);
      const t = setTimeout(() => setShowIphoneVolHud(false), 2000);
      setVolumeTimeout(t);
    } else {
      setPixelVolume(prev => {
        const newVal = direction === "up" ? Math.min(100, prev + 10) : Math.max(0, prev - 10);
        return newVal;
      });
      setShowPixelVolHud(true);
      if (volumeTimeout) clearTimeout(volumeTimeout);
      const t = setTimeout(() => setShowPixelVolHud(false), 2000);
      setVolumeTimeout(t);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(tempProfile);
    setShowProfileModal(false);
  };

  const resetAllSimulatorData = () => {
    if (confirm("Reset WorkoutFlow profile, stream streaks, and workout analytics history?")) {
      setProfile({
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
        selectedTheme: "indigo",
        selectedBadge: ""
      });
      setLoggedWorkouts([]);
      setActiveWorkout(null);
      setChatMessages([
        {
          id: "welcome-1",
          text: "Welkom bij WorkoutFlow! Ik ben jouw gecertificeerde AI-sportcoach. Vul eerst je lichaamstype in de app simulator in om je calorieënberekening te activeren!",
          sender: "coach",
          timestamp: "09:00 AM"
        }
      ]);
      setChartData([
        { day: "Ma", duration: 0, calories: 0, workouts: 0, water: 0 },
        { day: "Di", duration: 0, calories: 0, workouts: 0, water: 0 },
        { day: "Wo", duration: 0, calories: 0, workouts: 0, water: 0 },
        { day: "Do", duration: 0, calories: 0, workouts: 0, water: 0 },
        { day: "Vr", duration: 0, calories: 0, workouts: 0, water: 0 },
        { day: "Za", duration: 0, calories: 0, workouts: 0, water: 0 },
        { day: "Zo", duration: 0, calories: 0, workouts: 0, water: 0 }
      ]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
      
      {/* Simulation Controllers Toolbar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-600/10">
            WF
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              WorkoutFlow Simulator Console
              <span className="text-[10px] py-0.5 px-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono rounded">
                SIMULATING 2 OS CHASSIS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized athletic calibrations synchronizing Android Material Design & Apple iOS 17
            </p>
          </div>
        </div>

        {/* View togglers & action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => {
              setTempProfile({ ...profile });
              setShowProfileModal(true);
            }}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            id="btn_edit_profile"
          >
            <Settings2 className="w-4 h-4 text-slate-400" /> Adjust Profile
          </button>

          <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          {/* Toggle Screen sizes */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setSimulatorView("both")}
              className={`py-1 px-2.5 rounded text-[10px] font-bold tracking-tight transition-all flex items-center gap-1 cursor-pointer ${
                simulatorView === "both" 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Dual View
            </button>
            <button
              onClick={() => setSimulatorView("ios")}
              className={`py-1 px-2.5 rounded text-[10px] font-bold tracking-tight transition-all flex items-center gap-1 cursor-pointer ${
                simulatorView === "ios" 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Apple className="w-3.5 h-3.5" /> iOS 17
            </button>
            <button
              onClick={() => setSimulatorView("android")}
              className={`py-1 px-2.5 rounded text-[10px] font-bold tracking-tight transition-all flex items-center gap-1 cursor-pointer ${
                simulatorView === "android" 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Chrome className="w-3.5 h-3.5" /> Android 14
            </button>
          </div>

          <button
            onClick={resetAllSimulatorData}
            className="p-1.5 bg-slate-800/40 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-lg hover:border-red-900/30 transition-all border border-slate-850"
            title="Reset Simulator Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Parameters Setup Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/20 text-left"
          >
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <dt className="text-sm font-bold text-white">Athletic Calibrations</dt>
                <dd className="text-xs text-slate-400">Fine-tune individual profile parameters</dd>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-slate-500 hover:text-slate-350 bg-slate-900 p-1.5 rounded-lg text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 font-bold mb-1">USER NAME</label>
                  <input 
                    type="text" 
                    required
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 font-bold mb-1">AGE (YRS)</label>
                  <input 
                    type="number" 
                    required min="10" max="100"
                    value={tempProfile.age}
                    onChange={(e) => setTempProfile({ ...tempProfile, age: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 font-bold mb-1">BODY WEIGHT (KG)</label>
                  <input 
                    type="number" 
                    required min="30" max="250"
                    value={tempProfile.weightKg}
                    onChange={(e) => setTempProfile({ ...tempProfile, weightKg: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 font-bold mb-1">HEIGHT (CM)</label>
                  <input 
                    type="number" 
                    required min="100" max="250"
                    value={tempProfile.heightCm}
                    onChange={(e) => setTempProfile({ ...tempProfile, heightCm: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 font-bold mb-1">PRIMARY MACRO GOAL</label>
                <select
                  value={tempProfile.goal}
                  onChange={(e) => setTempProfile({ ...tempProfile, goal: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                >
                  {Object.entries(GOAL_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 font-bold mb-1">TRAINING LEVEL MODE</label>
                <select
                  value={tempProfile.level}
                  onChange={(e) => setTempProfile({ ...tempProfile, level: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                >
                  {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-405 font-bold mb-1">EQUIPMENT (MATERIAAL / HOME / THUIS)</label>
                <select
                  value={tempProfile.equipment}
                  onChange={(e) => setTempProfile({ ...tempProfile, equipment: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                >
                  {Object.entries(EQUIPMENT_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="py-1.5 px-3 bg-transparent border border-slate-800 text-slate-400 text-xs font-bold rounded-lg hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg"
                >
                  Save Calibrations
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* Main Container displaying Devices side-by-side or individually */}
      <div className="w-full flex flex-wrap justify-center items-start gap-12 py-4">
        
        {/* ----------------- IPHONE 15 PRO CHASSIS ----------------- */}
        {(simulatorView === "both" || simulatorView === "ios") && (
          <div className="flex flex-col items-center">
            
            <span className="text-xs font-bold font-mono text-slate-500 mb-2 flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-slate-400" /> iPhone 15 Pro Max Mock (iOS 17)
            </span>

            {/* iOS Physical Frame Wrapper */}
            <div className="relative flex select-none">
              
              {/* BUTTONS LEFT: Action and Volume */}
              <div className="absolute left-[-4px] top-28 flex flex-col gap-6 items-center">
                {/* Action button */}
                <button 
                  onClick={() => {
                    alert("Action button pressed: Quick-adding 250ml water!");
                    setProfile(p => ({ ...p, waterIntakeMl: p.waterIntakeMl + 250 }));
                  }}
                  className="w-[4px] h-6 bg-slate-700/85 hover:bg-indigo-600 rounded-l active:scale-95 transition-all outline-none border-none"
                  title="iOS Action Button"
                />
                
                {/* Volume Up */}
                <button 
                  onClick={() => triggerVolumeHud("ios", "up")}
                  className="w-[4px] h-10 bg-slate-700/85 hover:bg-indigo-500 rounded-l active:scale-95 transition-all outline-none border-none"
                  title="Volume Up"
                />
                
                {/* Volume Down */}
                <button 
                  onClick={() => triggerVolumeHud("ios", "down")}
                  className="w-[4px] h-10 bg-slate-700/85 hover:bg-indigo-500 rounded-l active:scale-95 transition-all outline-none border-none"
                  title="Volume Down"
                />
              </div>

              {/* BUTTON RIGHT: Power/Lock button */}
              <div className="absolute right-[-4px] top-36">
                <button 
                  onClick={() => setIphoneLocked(!iphoneLocked)}
                  className={`w-[4px] h-14 rounded-r active:scale-95 transition-all outline-none border-none ${
                    iphoneLocked ? "bg-indigo-500" : "bg-slate-700 hover:bg-indigo-600"
                  }`}
                  title="Lock/Unlock iOS"
                />
              </div>

              {/* Outer physical titanium border */}
              <div className="w-[360px] h-[720px] bg-slate-800 rounded-[44px] p-[10px] border-[3px] border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative">
                
                {/* Inner Screen Bezel */}
                <div className="w-full h-full bg-slate-950 rounded-[35px] border-2 border-slate-900 overflow-hidden relative flex flex-col justify-between">
                  
                  {/* Inside iOS Volume Indicator HUD Toast Overlay */}
                  <AnimatePresence>
                    {showIphoneVolHud && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute left-3 top-24 bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl z-50 flex flex-col items-center gap-1.5"
                      >
                        <Volume2 className="w-4 h-4 text-slate-300" />
                        <div className="w-1.5 h-16 bg-slate-800 rounded-full overflow-hidden relative">
                          <div 
                            className="w-full bg-indigo-500 absolute bottom-0" 
                            style={{ height: `${iphoneVolume}%` }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* SCREEN STATE: Locked vs Functional App */}
                  <AnimatePresence mode="wait">
                    {iphoneLocked ? (
                      <motion.div 
                        key="locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIphoneLocked(false)}
                        className="absolute inset-0 bg-slate-950/95 z-40 flex flex-col justify-between p-6 cursor-pointer"
                      >
                        {/* Lock screen top */}
                        <div className="text-center pt-8 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase">LOCK SCREEN INACTIVE</span>
                          <h3 className="text-3xl font-light text-slate-200">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </h3>
                          <p className="text-xs text-indigo-400 font-medium">Swipe Up to Unlock</p>
                        </div>
                        {/* Lock screen middle */}
                        <div className="my-auto flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
                            <Power className="w-7 h-7 text-indigo-400" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-300 block">WorkoutFlow Secure State</span>
                            <span className="text-[10px] text-slate-500 font-mono mt-1 block">STREAK SAFE: {profile.dailyStreak} DAYS ACTIVE</span>
                          </div>
                        </div>
                        <div className="text-center pb-6">
                          <p className="text-[10px] text-slate-600 font-mono">TAP SCREEN OR CLICK PHYSICAL LOCK BUTTON</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="app"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex flex-col justify-between"
                      >
                        {/* Native App Viewports inside iPhone */}
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ----------------- GOOGLE PIXEL 8 PRO CHASSIS ----------------- */}
        {(simulatorView === "both" || simulatorView === "android") && (
          <div className="flex flex-col items-center">
            
            <span className="text-xs font-bold font-mono text-slate-500 mb-2 flex items-center gap-1.5">
              <Chrome className="w-3.5 h-3.5 text-indigo-400" /> Google Pixel 8 Pro Max Mock (Android 14)
            </span>

            {/* Android Physical Frame Wrapper */}
            <div className="relative flex select-none">
              
              {/* BUTTONS RIGHT: Volume control & Lock key */}
              <div className="absolute right-[-4px] top-32 flex flex-col gap-6 items-center">
                {/* Power key */}
                <button 
                  onClick={() => setPixelLocked(!pixelLocked)}
                  className={`w-[4px] h-10 rounded-r active:scale-95 transition-all outline-none border-none ${
                    pixelLocked ? "bg-indigo-500" : "bg-slate-700 hover:bg-indigo-600"
                  }`}
                  title="Lock/Unlock Pixel"
                />

                {/* Volume Rocker Up */}
                <button 
                  onClick={() => triggerVolumeHud("android", "up")}
                  className="w-[4px] h-8 bg-slate-700 hover:bg-slate-500 rounded-r active:scale-95 transition-all outline-none border-none"
                  title="Volume Up"
                />

                {/* Volume Rocker Down */}
                <button 
                  onClick={() => triggerVolumeHud("android", "down")}
                  className="w-[4px] h-8 bg-slate-700 hover:bg-slate-500 rounded-r active:scale-95 transition-all outline-none border-none"
                  title="Volume Down"
                />
              </div>

              {/* Outer aluminum curved chassis frame */}
              <div className="w-[360px] h-[720px] bg-slate-900 rounded-[28px] p-[10px] border-[3px] border-slate-750/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative">
                
                {/* Inner Screen Bezel with sharp/medium corners */}
                <div className="w-full h-full bg-slate-950 rounded-[20px] border-2 border-slate-950 overflow-hidden relative flex flex-col justify-between">
                  
                  {/* Inside Android Volume Toast overlay */}
                  <AnimatePresence>
                    {showPixelVolHud && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute right-3 top-28 bg-slate-900/95 border border-slate-800 p-2 text-center rounded-xl z-50 flex items-center justify-between gap-2.5 shadow-lg w-28"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                        <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${pixelVolume}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-350">{pixelVolume}%</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* SCREEN STATE: Locked (Android Material screen) vs Functional App */}
                  <AnimatePresence mode="wait">
                    {pixelLocked ? (
                      <motion.div 
                        key="locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPixelLocked(false)}
                        className="absolute inset-0 bg-slate-900/95 z-40 flex flex-col justify-between p-6 cursor-pointer"
                      >
                        <div className="pt-10 text-left pl-2">
                          <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider block uppercase">MATERIAL SECURITY LOCK</span>
                          <h3 className="text-4xl font-extralight text-slate-100 mt-1">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">Thursday, June 4</p>
                        </div>

                        <div className="my-auto flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 rounded-3xl bg-indigo-950/50 border border-indigo-900/30 flex items-center justify-center animate-pulse">
                            <Smartphone className="w-8 h-8 text-indigo-400" />
                          </div>
                          <div>
                            <span className="text-xs text-slate-300 font-medium block">Unlock WorkoutFlow</span>
                            <span className="text-[9px] text-slate-500 font-mono block mt-1">HYDRATION STATUS: GOOD</span>
                          </div>
                        </div>

                        <div className="text-center pb-4">
                          <span className="text-[10px] text-slate-700 font-mono">TAP TO ACTIVATE DISCOVERY MATRIX</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="app"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex flex-col justify-between"
                      >
                        {/* Native App Viewports inside Pixel */}
                        <PhoneAppContent
                          os="android"
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
