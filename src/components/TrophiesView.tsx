import React, { useState } from "react";
import { 
  Trophy, Award, Flame, CheckCircle2, Droplet, 
  Sparkles, Clock, Dumbbell, Zap, Lock, Unlock, 
  ShieldCheck, TrendingUp, X, Info, ChevronRight, Share2,
  Coins, ShoppingBag, Utensils, Volume2, Activity, Check, BookOpen, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, LoggedWorkout } from "../types";

interface TrophiesViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  loggedWorkouts: LoggedWorkout[];
  chartData: any[];
  onNavigateToTab: (tab: string) => void;
}

interface BadgeDef {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coachProTip: string;
  metricType: "streak" | "workouts" | "calories" | "water" | "duration";
  targetValue: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Cosmic";
  accentColor: string;
  borderClass: string;
  bgClass: string;
  textColor: string;
  glowClass: string;
}

interface ShopItem {
  id: string;
  name: string;
  dutchName: string;
  description: string;
  dutchDescription: string;
  price: number;
  icon: string;
  category: string;
}

const BADGES_DATABASE: BadgeDef[] = [
  {
    id: "streak-1",
    title: "Atomic Spark",
    tagline: "Unleash kinetic momentum",
    description: "Achieve a 1-day daily streak to initialize metabolic memory.",
    coachProTip: "The hardest step is always physical startup. Day 1 fires up baseline nervous system readiness.",
    metricType: "streak",
    targetValue: 1,
    tier: "Bronze",
    accentColor: "text-amber-500",
    borderClass: "border-amber-900/30 group-hover:border-amber-600/40",
    bgClass: "bg-amber-950/10",
    textColor: "text-amber-400",
    glowClass: "shadow-amber-500/10"
  },
  {
    id: "streak-3",
    title: "Hydraulic Loop",
    tagline: "Build neural routine maps",
    description: "Secure a 3-day workout streak to solidify physiological consistency.",
    coachProTip: "Three days creates athletic rhythm. Your body's biological clock actively pre-allocates cortisol for workouts.",
    metricType: "streak",
    targetValue: 3,
    tier: "Silver",
    accentColor: "text-slate-400",
    borderClass: "border-slate-800 group-hover:border-slate-500/40",
    bgClass: "bg-slate-900/40",
    textColor: "text-slate-300",
    glowClass: "shadow-slate-400/10"
  },
  {
    id: "streak-7",
    title: "Hypertrophy Inferno",
    tagline: "Overcomplicate failure thresholds",
    description: "Maintain a 7-day daily streak to elevate resting metabolism.",
    coachProTip: "A full week of movement completely re-calibrates muscular insulin sensitivity. Glycogen replenishment becomes hyper-efficient.",
    metricType: "streak",
    targetValue: 7,
    tier: "Gold",
    accentColor: "text-yellow-500",
    borderClass: "border-yellow-900/30 group-hover:border-yellow-500/40",
    bgClass: "bg-yellow-950/10",
    textColor: "text-yellow-400",
    glowClass: "shadow-yellow-500/15"
  },
  {
    id: "streak-15",
    title: "Ascendant Titan",
    tagline: "Permanent cellular reconfiguration",
    description: "Reach an incredible 15-day daily streak to lock in elite endurance.",
    coachProTip: "At 15 days, training shifts from conscious discipline to default autonomic habit. Cellular structures are heavily adapted.",
    metricType: "streak",
    targetValue: 15,
    tier: "Platinum",
    accentColor: "text-cyan-400",
    borderClass: "border-cyan-950 bg-cyan-950/10 group-hover:border-cyan-500/40",
    bgClass: "bg-cyan-950/10",
    textColor: "text-cyan-400",
    glowClass: "shadow-cyan-400/20"
  },
  {
    id: "workout-1",
    title: "Sovereign Plunge",
    tagline: "Log the first sequence",
    description: "Complete and save your first customized training protocol.",
    coachProTip: "Your first logged workout establishes your baseline cardiovascular envelope. Study form indicators closely.",
    metricType: "workouts",
    targetValue: 1,
    tier: "Bronze",
    accentColor: "text-amber-500",
    borderClass: "border-amber-900/30 group-hover:border-amber-600/40",
    bgClass: "bg-amber-950/10",
    textColor: "text-amber-400",
    glowClass: "shadow-amber-500/10"
  },
  {
    id: "workout-3",
    title: "Steel Pioneer",
    tagline: "Consolidate training blocks",
    description: "Complete 3 full workout logs to establish bio-mechanical data.",
    coachProTip: "Three completed plans prove cellular stamina adaptations. Keep logging and drinking water directly after sets.",
    metricType: "workouts",
    targetValue: 3,
    tier: "Silver",
    accentColor: "text-slate-400",
    borderClass: "border-slate-800 group-hover:border-slate-500/40",
    bgClass: "bg-slate-900/40",
    textColor: "text-slate-300",
    glowClass: "shadow-slate-400/10"
  },
  {
    id: "workout-5",
    title: "Colossus Caliber",
    tagline: "Absolute muscle activation",
    description: "Successfully log 5 training drills to unlock custom lift statuses.",
    coachProTip: "Five full circuits trigger myofibres density multiplication (hypertrophy). Your core postural stability is heavily optimized.",
    metricType: "workouts",
    targetValue: 5,
    tier: "Gold",
    accentColor: "text-yellow-500",
    borderClass: "border-yellow-905 group-hover:border-yellow-500/40",
    bgClass: "bg-yellow-950/10",
    textColor: "text-yellow-400",
    glowClass: "shadow-yellow-500/15"
  },
  {
    id: "calories-1000",
    title: "Caloric Annihilator",
    tagline: "Blaze through glycogen stores",
    description: "Expel over 1,000 active kilocalories to stimulate metabolic rate.",
    coachProTip: "1,000 active kcal represents significant chemical energy expenditure. This ensures persistent fat oxidation post-workout.",
    metricType: "calories",
    targetValue: 1000,
    tier: "Gold",
    accentColor: "text-orange-500",
    borderClass: "border-orange-955 group-hover:border-orange-500/40",
    bgClass: "bg-orange-950/10",
    textColor: "text-orange-400",
    glowClass: "shadow-orange-500/15"
  },
  {
    id: "water-5000",
    title: "Deuterium Cell Hydrator",
    tagline: "Volumize myofibril recovery",
    description: "Register 5,000 ml of accumulated daily hydration.",
    coachProTip: "Sufficient cellular hydration directly influences protein synthesis rates. Dehydrated cells stunt load progressions by up to 20%.",
    metricType: "water",
    targetValue: 5000,
    tier: "Silver",
    accentColor: "text-sky-400",
    borderClass: "border-sky-950 group-hover:border-sky-505/40",
    bgClass: "bg-sky-950/10",
    textColor: "text-sky-400",
    glowClass: "shadow-sky-500/15"
  },
  {
    id: "duration-180",
    title: "Apex Olympian",
    tagline: "Championship endurance limits",
    description: "Register over 180 total active minutes of tracked workout load.",
    coachProTip: "180 minutes of load stimulates heart-lung adaptation loops, creating highly conditioned ATP (energy) cellular machines.",
    metricType: "duration",
    targetValue: 180,
    tier: "Cosmic",
    accentColor: "text-purple-400",
    borderClass: "border-purple-950 group-hover:border-purple-500/40",
    bgClass: "bg-purple-950/10",
    textColor: "text-purple-400",
    glowClass: "shadow-purple-500/20"
  }
];

const REWARDS_SHOP_DATABASE: ShopItem[] = [
  {
    id: "cheat-pass",
    name: "AI Cheat Meal Absolution Pass",
    dutchName: "Schuldvrije Cheat maaltijd",
    description: "A digital voucher signed by your AI Coach granting you one completely guilt-free cheat meal of choosing.",
    dutchDescription: "Recht van de AI Coach op één heerlijke cheat-maaltijd zonder schuldgevoel! Geniet ervan.",
    price: 150,
    icon: "Utensils",
    category: "Nutrition"
  },
  {
    id: "golden-shaker",
    name: "Golden Motivator Shaker Skin",
    dutchName: "Gouden Shaker Badge",
    description: "Unlocks an elite gold styling shroud for your profile hydration trackers to fuel your dynamic training loops.",
    dutchDescription: "Ontgrendelt een glimmend gouden icoontje bij je hydratatiemeters om stijlvol water te drinken.",
    price: 100,
    icon: "Flame",
    category: "Cosmetics"
  },
  {
    id: "arnold-voice",
    name: "AI Trainer: Arnold Schwarzenegger Voice pack",
    dutchName: "Arnold Stem AI Coach",
    description: "Instructs the AI chat system, prompts, and kinetic coaches to reply using high-motivation body builder slogans.",
    dutchDescription: "Activeert legendarische power-quotes in de Coach Chat zoals: 'Get to the chopper!' en 'No pain, no gain!'",
    price: 250,
    icon: "Volume2",
    category: "AI Upgrades"
  },
  {
    id: "scan-voucher",
    name: "Biomechanical Motion Scanning Voucher",
    dutchName: "Houding Biomechanica Scan",
    description: "Enables simulated camera alignment telemetry. The AI Coach analyzes your posture, leverage angles, and joint strains.",
    dutchDescription: "Laat de AI Coach jouw hefbomen en trainingshouding scannen om blessures vakkundig te voorkomen.",
    price: 300,
    icon: "Activity",
    category: "Performance"
  },
  {
    id: "neon-theme",
    name: "Cyberpunk Neon Interface Override",
    dutchName: "Cyberpunk Neon Thema",
    description: "Overrides the standard UI slate borders with vibrant ultraviolet, teal glow edges, and synthwave kinetic aesthetics.",
    dutchDescription: "Past een retro cyberpunk violet & neon-groene gloed toe op de omlijstingen van deze app simulator!",
    price: 200,
    icon: "Sparkles",
    category: "Cosmetics"
  },
  {
    id: "emerald-theme",
    name: "Emerald Forest Organic Calm",
    dutchName: "Smaragdgroen Bos Thema",
    description: "Soothes the visual path with high-contrast forest green accents, eco-calm widgets, and botanical recovery loops.",
    dutchDescription: "Brengt rust in je trainingen met organische groene randen en frisse bio-kleuraccenten!",
    price: 100,
    icon: "Heart",
    category: "Cosmetics"
  },
  {
    id: "amber-theme",
    name: "Sunset Amber Energy Calibrator",
    dutchName: "Zonsondergang Amber Thema",
    description: "Triggers solar energy flows using warm amber glow indicators, gold borders, and desert fire status gauges.",
    dutchDescription: "Activeert zachte goudgele en dieporanje gloed om vermoeidheid tegen te gaan!",
    price: 120,
    icon: "Flame",
    category: "Cosmetics"
  },
  {
    id: "crimson-theme",
    name: "Crimson Rage Beast Mode Active",
    dutchName: "Vurige Crimson Thema",
    description: "Powers up intensive weight training lifting with blood-red indicators, danger status frames, and high-heartrate feedback.",
    dutchDescription: "Zet de app op brute Beast Mode met agressief rode omlijstingen, perfect voor zware lifts!",
    price: 150,
    icon: "Zap",
    category: "Cosmetics"
  }
];

interface RankDef {
  roman: string;
  title: string;
  minPoints: number;
  maxPoints: number;
  badgeColor: string;
  bgGlow: string;
}

const RANKS_DATABASE: RankDef[] = [
  { roman: "Rang I", title: "Sport Novice", minPoints: 0, maxPoints: 199, badgeColor: "from-zinc-500 to-zinc-400 text-zinc-100", bgGlow: "shadow-zinc-500/10" },
  { roman: "Rang II", title: "Actieve Atleet", minPoints: 200, maxPoints: 499, badgeColor: "from-emerald-500 to-teal-400 text-emerald-50", bgGlow: "shadow-emerald-500/15" },
  { roman: "Rang III", title: "IJzeren Heffer", minPoints: 500, maxPoints: 899, badgeColor: "from-indigo-500 to-cyan-400 text-indigo-50", bgGlow: "shadow-indigo-500/15" },
  { roman: "Rang IV", title: "Discipline Sloper", minPoints: 900, maxPoints: 1499, badgeColor: "from-amber-500 to-orange-500 text-text-amber-50", bgGlow: "shadow-amber-500/20" },
  { roman: "Rang V", title: "Gym Legende 👑", minPoints: 1500, maxPoints: 999999, badgeColor: "from-purple-500 to-fuchsia-500 text-fuchsia-550", bgGlow: "shadow-purple-500/30" }
];

interface CupDef {
  id: string;
  title: string;
  dutchTitle: string;
  requirement: string;
  dutchRequirement: string;
  isUnlocked: (stats: { workoutsCount: number; waterAmountMl: number; streak: number; totalCalories: number }) => boolean;
  colorClass: string;
  bgGradient: string;
  iconColor: string;
  description: string;
  dutchDescription: string;
}

const CUPS_DATABASE: CupDef[] = [
  {
    id: "pioneer-cup",
    title: "The Pioneer Copper Cup",
    dutchTitle: "Koperen Starter Beker",
    requirement: "Log at least 1 completed workout to claim.",
    dutchRequirement: "Begin met trainen! Voltooi minimaal 1 workout.",
    isUnlocked: (stats) => stats.workoutsCount >= 1,
    colorClass: "border-orange-800/50 bg-orange-950/10",
    bgGradient: "from-orange-950/20 to-stone-900/40",
    iconColor: "text-orange-500",
    description: "Witnessed by your AI Coach, you logged your first physical custom set of muscle reps.",
    dutchDescription: "Gefeliciteerd met je eerste geregistreerde workout! De eerste stap naar een fittere versie van jezelf is gezet."
  },
  {
    id: "hydration-cup",
    title: "The Silver Hydration Cup",
    dutchTitle: "Zilveren Hydro-Koning",
    requirement: "Hydrate with a total of 1,000ml or more daily.",
    dutchRequirement: "Drink actieve liters water! Behaald door 1.000ml of meer te drinken.",
    isUnlocked: (stats) => stats.waterAmountMl >= 1000,
    colorClass: "border-slate-750 bg-slate-900/40",
    bgGradient: "from-slate-900/30 to-blue-950/20",
    iconColor: "text-slate-350",
    description: "Sufficient cell hydration triggers cellular metabolism rate increases and maintains lifting form.",
    dutchDescription: "Perfect gehydrateerd! Voldoende water zorgt voor directer herstel van je spieren en voorkomt vermoeidheid."
  },
  {
    id: "calorie-cup",
    title: "The Golden Calorie Shredder",
    dutchTitle: "Gouden Calorieën Sloper",
    requirement: "Burn over 500 active kcal in total.",
    dutchRequirement: "Actieve verbranding! Verbrand meer dan 550 kcal in totaal.",
    isUnlocked: (stats) => stats.totalCalories >= 550,
    colorClass: "border-yellow-750/40 bg-yellow-950/10",
    bgGradient: "from-yellow-950/15 to-amber-950/10",
    iconColor: "text-yellow-455",
    description: "Outstanding kinetic efficiency. You activated glycogen deplete protocols to trigger fat-shredding.",
    dutchDescription: "Een ware calorieënoorlog gewonnen! Je hebt meer dan 550 actieve kilocalorieën verbrand en hiermee de gouden beker veroverd."
  },
  {
    id: "streak-cup",
    title: "Championship Platinum Streak Cup",
    dutchTitle: "Platina Discipline Cup",
    requirement: "Sustain a daily streak of 3 days or more.",
    dutchRequirement: "Discipline ten top! Behaal een streak van 3+ dagen.",
    isUnlocked: (stats) => stats.streak >= 3,
    colorClass: "border-cyan-850 bg-cyan-950/15",
    bgGradient: "from-cyan-950/20 to-slate-900/30",
    iconColor: "text-cyan-405",
    description: "Habits are formed through daily repetition. Three consecutive active days locks in neurological training triggers.",
    dutchDescription: "Consistent trainen brengt succes. Wie 3 dagen aaneengesloten actief blijft, is niet meer te stoppen!"
  }
];

export default function TrophiesView({ 
  profile, 
  setProfile,
  loggedWorkouts, 
  chartData,
  onNavigateToTab 
}: TrophiesViewProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeDef | null>(null);
  const [activeSegment, setActiveSegment] = useState<"trophies" | "shop" | "tutorial">("trophies");
  const [filterTabs, setFilterTabs] = useState<"all" | "unlocked" | "locked">("all");
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | null>(null);
  const [selectedCup, setSelectedCup] = useState<CupDef | null>(null);

  // Calculate user progress metrics
  const totalWorkouts = loggedWorkouts.length;
  const totalCalories = loggedWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalDuration = loggedWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0);
  const totalHydration = chartData.reduce((sum, d) => sum + (d.water || 0), 0);
  const dailyStreak = profile.dailyStreak;

  // Calculate current rank dynamically
  const currentRank = RANKS_DATABASE.find(
    r => profile.points >= r.minPoints && profile.points <= r.maxPoints
  ) || RANKS_DATABASE[RANKS_DATABASE.length - 1];

  const nextRankIndex = RANKS_DATABASE.findIndex(r => r === currentRank) + 1;
  const nextRank = nextRankIndex < RANKS_DATABASE.length ? RANKS_DATABASE[nextRankIndex] : null;

  const pointsInCurrentLevel = profile.points - currentRank.minPoints;
  const pointsNeededForNextLevel = nextRank ? nextRank.minPoints - currentRank.minPoints : 1;
  const rankProgressPct = nextRank 
    ? Math.min(100, Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100))
    : 100;

  // Map metric keys to active numbers
  const getValueForMetric = (metric: BadgeDef["metricType"]) => {
    switch (metric) {
      case "streak": return dailyStreak;
      case "workouts": return totalWorkouts;
      case "calories": return totalCalories;
      case "water": return totalHydration;
      case "duration": return totalDuration;
      default: return 0;
    }
  };

  const isBadgeUnlocked = (badge: BadgeDef) => {
    const currentVal = getValueForMetric(badge.metricType);
    return currentVal >= badge.targetValue;
  };

  const filteredBadges = BADGES_DATABASE.filter(badge => {
    const unlocked = isBadgeUnlocked(badge);
    if (filterTabs === "unlocked") return unlocked;
    if (filterTabs === "locked") return !unlocked;
    return true;
  });

  const unlockedCount = BADGES_DATABASE.filter(isBadgeUnlocked).length;
  const scorePercent = Math.round((unlockedCount / BADGES_DATABASE.length) * 100);

  const renderBadgeIcon = (badge: BadgeDef, unlocked: boolean) => {
    const size = "w-6 h-6";
    if (!unlocked) return <Lock className={`${size} text-slate-600`} />;
    switch (badge.metricType) {
      case "streak": return <Flame className={`${size} text-red-500 fill-red-500/20 animate-pulse`} />;
      case "workouts": return <Dumbbell className={`${size} ${badge.textColor}`} />;
      case "calories": return <Sparkles className={`${size} ${badge.textColor}`} />;
      case "water": return <Droplet className={`${size} text-sky-400`} />;
      case "duration": return <Trophy className={`${size} text-purple-400`} />;
      default: return <Award className={`${size} ${badge.textColor}`} />;
    }
  };

  const renderShopIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case "Utensils": return <Utensils className={className} />;
      case "Flame": return <Flame className={className} />;
      case "Volume2": return <Volume2 className={className} />;
      case "Activity": return <Activity className={className} />;
      case "Sparkles": return <Sparkles className={className} />;
      default: return <ShoppingBag className={className} />;
    }
  };

  const handlePurchaseItem = (item: ShopItem) => {
    const isOwned = profile.unlockedItems?.includes(item.id);
    if (isOwned) {
      alert(`Je hebt "${item.dutchName}" al succesvol ontgrendeld en in je bezit! Check je inventaris onderaan de pagina.`);
      return;
    }

    if (profile.points < item.price) {
      alert(`Oeps! Je hebt ${profile.points} punten, maar deze beloning kost ${item.price} punten. Log een workout (+200), dineer een gezonde maaltijd (+50), of drink een beker water (+15) om meer punten op te sparen!`);
      return;
    }

    // Deduct points and store unlocked item
    setProfile(prev => {
      const currentList = prev.unlockedItems || [];
      return {
        ...prev,
        points: Math.max(0, prev.points - item.price),
        unlockedItems: [...currentList, item.id]
      };
    });

    // Interactive arcade audio chime synthesis
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (freq: number, start: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gainNode.gain.setValueAtTime(0.01, start);
        gainNode.gain.exponentialRampToValueAtTime(0.12, start + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, start + dur);
        osc.start(start);
        osc.stop(start + dur);
      };
      const now = audioCtx.currentTime;
      playBeep(523.25, now, 0.15); // C5
      playBeep(1046.50, now + 0.1, 0.25); // C6
    } catch (e) {}

    alert(`🎉 Gefeliciteerd! Je hebt "${item.dutchName}" ontgrendeld voor ${item.price} punten! De beloningsstatus is actief op je profiel.`);
    setSelectedShopItem(null);
  };

  return (
    <div className="space-y-4 text-left">
      
      {/* Upper Unified Points Status Block */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-950/55 p-4 rounded-xl relative overflow-hidden flex flex-col gap-3.5">
        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
          <Trophy className="w-32 h-32 text-indigo-400" />
        </div>

        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/30 uppercase">
              WORKOUTFLOW LOYALITEIT CENTRALE
            </span>
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5 mt-1">
              <Coins className="w-3.5 h-3.5 text-yellow-500 animate-pulse" /> Jouw Gym Status & XP
            </h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Verdien punten via gezonde gewoontes en koop er upgrades mee in de winkel!
            </p>
          </div>
          
          <div className="text-right shrink-0 bg-slate-950/70 border border-slate-900 px-3 py-1.5 rounded-xl">
            <span className="text-lg font-black font-mono text-yellow-400 block leading-tight">{profile.points}</span>
            <span className="block text-[7.5px] font-mono text-slate-500 uppercase tracking-widest">PUNTEN (XP)</span>
          </div>
        </div>

        {/* ACTIVE RANK SHIELD AND PROGRESS */}
        <div className="bg-slate-950/70 border border-slate-900 p-3 rounded-xl flex items-center justify-between gap-3 shadow-inner">
          <div className="space-y-1 text-left">
            <span className="text-[7.5px] font-mono text-slate-500 block uppercase tracking-wider">HUIDIGE METABOLISCHE RANG</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-black text-white bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-850/40">{currentRank.roman}</span>
              <span className="text-[10px] font-bold text-slate-300">{currentRank.title}</span>
            </div>
            
            {/* Range XP slider */}
            <div className="pt-2 w-[160px] xs:w-[200px]">
              <div className="flex justify-between text-[7px] font-mono text-slate-500 mb-0.5">
                <span>{pointsInCurrentLevel} / {pointsNeededForNextLevel} XP</span>
                <span>{nextRank ? nextRank.roman : "MAX"}</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-550"
                  style={{ width: `${rankProgressPct}%` }}
                />
              </div>
              {nextRank ? (
                <span className="text-[7px] text-slate-500 mt-0.5 block leading-none font-mono">
                  Nog {nextRank.minPoints - profile.points} XP tot <strong className="text-slate-400">{nextRank.roman} ({nextRank.title})</strong>
                </span>
              ) : (
                <span className="text-[7px] text-yellow-500 mt-0.5 block leading-none font-mono">
                  Gefeliciteerd! Je hebt de absolute **hoogste sport-rang** bereikt!
                </span>
              )}
            </div>
          </div>

          {/* Glowing active badge graphic */}
          <div className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${currentRank.badgeColor} ${currentRank.bgGlow} border border-slate-100/10 flex flex-col items-center justify-center p-1 shadow-md`}>
            <Award className="w-3.5 h-3.5 mb-0.5 text-inherit" />
            <span className="text-[8px] font-black tracking-tighter leading-none">{currentRank.roman}</span>
          </div>
        </div>

        {/* Small stats drawer summary info of levels completed */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-[9px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Milestones: <strong className="text-white">{unlockedCount} / {BADGES_DATABASE.length}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bekers & Upgrades: <strong className="text-white">{CUPS_DATABASE.filter(c => c.isUnlocked({ workoutsCount: totalWorkouts, waterAmountMl: Math.max(profile.waterIntakeMl, totalHydration), streak: dailyStreak, totalCalories: totalCalories })).length + (profile.unlockedItems || []).length}</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Category Selector Tabs */}
      <div className="flex p-0.5 bg-slate-950/50 border border-slate-900 rounded-xl">
        <button
          onClick={() => setActiveSegment("trophies")}
          className={`flex-1 py-1.5 text-[9px] uppercase font-mono font-extrabold text-center rounded-lg transition-all ${
            activeSegment === "trophies"
              ? "bg-indigo-600 text-white shadow shadow-indigo-600/15"
              : "text-slate-500 hover:text-slate-300 cursor-pointer"
          }`}
        >
          🏆 Trophies ({unlockedCount})
        </button>
        <button
          onClick={() => setActiveSegment("shop")}
          className={`flex-1 py-1.5 text-[9px] uppercase font-mono font-extrabold text-center rounded-lg transition-all ${
            activeSegment === "shop"
              ? "bg-amber-600 text-white shadow shadow-amber-500/15"
              : "text-slate-500 hover:text-slate-300 cursor-pointer"
          }`}
        >
          🪙 Punten Winkel
        </button>
        <button
          onClick={() => setActiveSegment("tutorial")}
          className={`flex-1 py-1.5 text-[9px] uppercase font-mono font-extrabold text-center rounded-lg transition-all ${
            activeSegment === "tutorial"
              ? "bg-sky-600 text-white shadow shadow-sky-500/15"
              : "text-slate-500 hover:text-slate-350 cursor-pointer"
          }`}
        >
          📖 Hoe werkt dit? 🤔
        </button>
      </div>

      {/* SEGMENT 1: STANDARD PRESTIGIOUS BADGES TROPHIES */}
      {activeSegment === "trophies" && (
        <div className="space-y-4">
          
          {/* INTERACTIVE TROPHY CUP CABINET (BEKERS VERZAMELING) */}
          <div className="p-3 bg-gradient-to-tr from-slate-950 to-slate-900/60 border border-slate-900 rounded-xl space-y-2.5 text-left">
            <div className="flex justify-between items-center">
              <h5 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                🏆 Virtuele Prijzenkast (Bekers)
              </h5>
              <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-950/40 border border-indigo-900/30 px-1.5 py-0.2 rounded-md animate-pulse">
                Klik een beker
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {CUPS_DATABASE.map(cup => {
                const stats = {
                  workoutsCount: totalWorkouts,
                  waterAmountMl: Math.max(profile.waterIntakeMl, totalHydration),
                  streak: dailyStreak,
                  totalCalories: totalCalories
                };
                const unlocked = cup.isUnlocked(stats);
                
                return (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    key={cup.id}
                    onClick={() => setSelectedCup(cup)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer relative h-16 transition-all select-none ${
                      unlocked 
                        ? `bg-gradient-to-br ${cup.bgGradient} ${cup.colorClass} shadow-md shadow-amber-500/5` 
                        : "bg-slate-950 border-slate-900/60 opacity-55 hover:opacity-100"
                    }`}
                  >
                    <Trophy className={`w-5 h-5 ${unlocked ? cup.iconColor : "text-slate-700"}`} />
                    <span className="text-[7.5px] font-black text-slate-350 mt-1.5 truncate max-w-full block leading-none">
                      {cup.dutchTitle.split(" ")[0]} {cup.dutchTitle.split(" ")[1] || ""}
                    </span>
                    {!unlocked && (
                      <div className="absolute top-1 right-1 bg-slate-950/90 border border-slate-900 p-0.5 rounded-full scale-75">
                        <Lock className="w-1.5 h-1.5 text-slate-700" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2.5 items-center justify-between border-b border-slate-950 pb-2 pt-1 font-sans">
            <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider">FILTER MILESTONES & BADGES</span>
            <div className="flex gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
              {(["all", "unlocked", "locked"] as const).map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setFilterTabs(tabKey)}
                  className={`text-[8px] font-bold px-2 py-0.5 rounded transition-all uppercase ${
                    filterTabs === tabKey 
                      ? "bg-indigo-600 text-white" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tabKey}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredBadges.map(badge => {
              const unlocked = isBadgeUnlocked(badge);
              const currentProgress = getValueForMetric(badge.metricType);
              const progressPct = Math.min(100, Math.round((currentProgress / badge.targetValue) * 100));

              return (
                <motion.div
                  layout
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ y: -1 }}
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-2.5 rounded-xl border relative overflow-hidden group cursor-pointer transition-all flex flex-col justify-between select-none h-24 ${
                    unlocked 
                      ? `${badge.borderClass} ${badge.bgClass} shadow` 
                      : "bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-650"
                  }`}
                >
                  <div className="flex justify-between items-center z-10">
                    <span className={`text-[7px] font-mono leading-none font-bold px-1 rounded ${
                      unlocked 
                        ? badge.tier === "Bronze" ? "bg-amber-950/40 text-amber-500 border border-amber-900/30"
                          : badge.tier === "Silver" ? "bg-slate-900/40 text-slate-400 border border-slate-800"
                          : badge.tier === "Gold" ? "bg-yellow-950/20 text-yellow-500 border border-yellow-800/40"
                          : "bg-purple-950/20 text-purple-400 border border-purple-800/20"
                        : "bg-slate-900 text-slate-600"
                    }`}>
                      {badge.tier}
                    </span>
                    {unlocked && (
                      <span className="text-[7px] text-emerald-400 font-bold bg-emerald-950/40 rounded px-1 animate-pulse">
                        OK
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 z-10 my-1">
                    <div className="p-1 rounded bg-slate-900/90 border border-slate-800 shrink-0">
                      {renderBadgeIcon(badge, unlocked)}
                    </div>
                    <div className="text-left truncate">
                      <h5 className={`text-[10px] font-bold truncate leading-tight ${unlocked ? "text-slate-100" : "text-slate-500"}`}>
                        {badge.title}
                      </h5>
                      <p className="text-[8px] text-slate-500 font-mono">
                        {badge.targetValue} {badge.metricType === "water" ? "ml" : badge.metricType === "calories" ? "kcal" : badge.metricType === "duration" ? "min" : "streak"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-900/80 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        unlocked ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEGMENT 2: THE REWARDS POINTS SHOP */}
      {activeSegment === "shop" && (
        <div className="space-y-3">
          <div className="bg-amber-950/10 border border-amber-900/25 p-3 rounded-lg flex gap-2 items-start text-xs text-amber-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed">
              <strong>Hoe spaar je punten?</strong> Voltooi een AI routine (+200 XP), voer maaltijden in bij de dierplanner (+50 XP) of drink water (+15 XP per 250ml glas). Tik op een item om deze aan te schaffen!
            </p>
          </div>

          <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
            {REWARDS_SHOP_DATABASE.map(item => {
              const isOwned = (profile.unlockedItems || []).includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedShopItem(item)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-98 flex justify-between items-center gap-3 relative overflow-hidden ${
                    isOwned 
                      ? "border-emerald-950 bg-emerald-950/5 opacity-80" 
                      : "border-slate-900 bg-slate-950 hover:border-slate-800"
                  }`}
                >
                  {/* Shop Item Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isOwned ? "bg-emerald-950/40 text-emerald-400" : "bg-slate-900 text-amber-400 border border-slate-800"
                    }`}>
                      {renderShopIcon(item.icon)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[7px] font-mono bg-slate-900/60 text-slate-450 px-1.5 py-0.2 rounded uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-[11px] font-bold text-slate-100 mt-0.5 truncate flex items-center gap-1">
                        {item.dutchName}
                        {isOwned && <span className="text-[8px] font-normal text-emerald-400 font-mono">(EIGENDOM)</span>}
                      </h4>
                      <p className="text-[9.5px] text-slate-400 leading-normal line-clamp-1 mt-0.5">
                        {item.dutchDescription}
                      </p>
                    </div>
                  </div>

                  {/* Price Badge Tag */}
                  <div className="shrink-0 text-right">
                    {isOwned ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-950/60 border border-emerald-900/30 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className={`px-2 py-1.5 rounded-lg flex items-center gap-1 ${
                        profile.points >= item.price 
                          ? "bg-amber-950/20 text-amber-400 border border-amber-900/30" 
                          : "bg-slate-900 text-slate-450 border border-slate-950"
                      }`}>
                        <Coins className="w-3 h-3 text-yellow-500" />
                        <span className="font-mono text-[10px] font-bold">{item.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Active Unlocked Perks Inventory */}
          <div className="pt-2">
            <span className="text-[8px] font-mono text-slate-500 tracking-wider block uppercase">ONTVANGEN INVENTARIS</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(profile.unlockedItems || []).length === 0 ? (
                <span className="text-[9px] text-slate-500 italic">Nog geen aankopen gedaan. Spaar punten en ontgrendel je eerste upgrade!</span>
              ) : (
                profile.unlockedItems.map(itemId => {
                  const sInfo = REWARDS_SHOP_DATABASE.find(i => i.id === itemId);
                  return (
                    <span 
                      key={itemId}
                      className="text-[9px] bg-emerald-950/60 border border-emerald-900/30 text-emerald-400 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-sans"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" /> {sInfo?.dutchName || itemId}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 3: "HOE WERKT DIT?" FRIENDLY DUTCH APP TACTICAL MANUAL */}
      {activeSegment === "tutorial" && (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 pb-1">
          
          <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3.5 space-y-4">
            <div>
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" /> WorkoutFlow Gebruikersgids
              </h5>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                Welkom bij de ultieme gids! Hieronder leggen we je stap voor stap uit hoe je alles uit deze interactieve mobiele app haalt.
              </p>
            </div>

            {/* Accordion List 1 */}
            <div className="border-t border-slate-950 pt-2.5 space-y-1">
              <span className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase flex items-center gap-1">
                🏋️ 1. AI WORKOUT BUILDER (AI SCHEMA'S)
              </span>
              <p className="text-[10px] text-slate-350 leading-relaxed">
                Navigeer naar het tabblad <strong>AI Planner</strong>. Kies je gewenste spiergroep (bijv. <em>Push Day</em>), niveau en tijdslimiet en tik op <strong>Assemble Custom AI Protocol</strong>. De AI (Gemini 3.5) stelt direct een unieke setoefening samen. Klik op <strong>Start This Workout</strong> om de sessie live te starten en tap reps af om ze schuldvrij te klaren!
              </p>
            </div>

            {/* Accordion List 2 */}
            <div className="border-t border-slate-950 pt-2.5 space-y-1">
              <span className="text-[9px] font-mono text-emerald-400 font-extrabold uppercase flex items-center gap-1">
                🥗 2. AI MAALTIJDPLANNER (DIËTEN)
              </span>
              <p className="text-[10px] text-slate-350 leading-relaxed">
                Binnen het <strong>AI Planner</strong> tabblad kan je bovenin overschakelen naar de <strong>Meal Planner</strong>. Kies een smaakprofiel (Keto, Plant-powered, Bulk) en klik op de knop om direct een volledig, smakelijk dagschema op te stellen voorzien van caloriedoelen, macro-sheets en instructies. Markeer maaltijden als gegeten om calorieën live te loggen!
              </p>
            </div>

            {/* Accordion List 3 */}
            <div className="border-t border-slate-950 pt-2.5 space-y-1">
              <span className="text-[9px] font-mono text-sky-450 font-extrabold uppercase flex items-center gap-0.5">
                💧 3. WATER & DAILY STREAK TRACKER
              </span>
              <p className="text-[10px] text-slate-350 leading-relaxed">
                Op het tabblad <strong>Home</strong> vind je de water-widget. Tik op de glazen water om milliliters toe te voegen. Iedere actieve trainingsdag die je afrondt verhoogt automatisch je <strong>Streak vlammetje</strong>. Houd deze elke dag actief!
              </p>
            </div>

            {/* Accordion List 4 */}
            <div className="border-t border-slate-950 pt-2.5 space-y-1">
              <span className="text-[9px] font-mono text-pink-400 font-extrabold uppercase flex items-center gap-1">
                💬 4. PRATEN MET DE AI COACH
              </span>
              <p className="text-[10px] text-slate-350 leading-relaxed">
                Ga naar <strong>Coach Chat</strong> onderin. Je kan hier elke denkbare vraag intypen (zoals: <em>"Hoe doe ik een perfecte squat?"</em> of <em>"Hoeveel gram eiwit heb ik nodig?"</em>) en direct professioneel, bemoedigend en wetenschappelijk betrouwbaar advies ontvangen.
              </p>
            </div>

            {/* Accordion List 5 */}
            <div className="border-t border-slate-950 pt-2.5 space-y-1">
              <span className="text-[9px] font-mono text-yellow-400 font-extrabold uppercase flex items-center gap-1">
                🪙 5. UPGRADES KOPEN MET PUNTEN!
              </span>
              <p className="text-[10px] text-slate-355 leading-relaxed">
                Elke gezonde gewoonte beloont jou met punten (XP). Log water, dineer of voltooi een training. Ga naar de <strong>Punten Winkel</strong> in dit tabblad, kies een beloning (zoals de <em>Arnold Stem AI Coach</em> of <em>Cheat maaltijd pass</em>) en reken af met je gespaarde punten!
              </p>
            </div>

          </div>

          <div className="p-3 bg-sky-950/20 border border-sky-900/30 rounded-xl text-[9px] text-sky-350 leading-relaxed font-sans italic text-center">
            "Rome is niet in één dag gebouwd, jouw droomlichaam evenmin. Log consistent, drink water en geniet van de reis!" — AI Sportcoach
          </div>

        </div>
      )}

      {/* DETAIL DRAWER FOR BADGES */}
      <AnimatePresence>
        {selectedBadge && (() => {
          const unlocked = isBadgeUnlocked(selectedBadge);
          const currentProgress = getValueForMetric(selectedBadge.metricType);
          const progressPct = Math.min(100, Math.round((currentProgress / selectedBadge.targetValue) * 100));

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-end p-4"
            >
              <motion.div
                initial={{ y: 150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 150, opacity: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-3 max-h-[92%] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">Prestatie Specificaties</span>
                  <button 
                    onClick={() => setSelectedBadge(null)}
                    className="p-1 rounded bg-slate-950 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center py-2 text-center space-y-2 relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                    unlocked 
                      ? `${selectedBadge.borderClass} ${selectedBadge.bgClass} ${selectedBadge.glowClass}` 
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}>
                    {renderBadgeIcon(selectedBadge, unlocked)}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-white">{selectedBadge.title}</h3>
                    <p className="text-[10px] text-indigo-400 font-mono italic">{selectedBadge.tagline}</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl space-y-1.5 text-center">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">DOELSTELLING METRIC</span>
                  <span className="text-xs font-bold font-mono text-white">
                    {currentProgress} / {selectedBadge.targetValue} ({progressPct}%)
                  </span>
                  <p className="text-[9px] text-slate-400 leading-snug">
                    {unlocked 
                      ? "Unbelievable! Je hebt dit doel behaald en de badge permanent geactiveerd." 
                      : `Behaal nog ${selectedBadge.targetValue - currentProgress} meeteenheden om deze badge te bemachtigen.`}
                  </p>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">BIOMEDISCH EFFECT</span>
                  <p className="text-[10.5px] text-slate-300 leading-normal">
                    {selectedBadge.description}
                  </p>
                </div>

                <div className="bg-indigo-950/20 border border-indigo-900/30 p-3 rounded-xl text-left space-y-1">
                  <span className="text-[8px] font-mono text-indigo-400 font-extrabold uppercase">COACH BIOMAX PRO-TIP</span>
                  <p className="text-[10px] text-indigo-200 leading-relaxed italic">
                    "{selectedBadge.coachProTip}"
                  </p>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setSelectedBadge(null)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl active:scale-95"
                  >
                    Bevestig & Sluit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* DETAIL DRAWER FOR SHOP PURCHASES */}
      <AnimatePresence>
        {selectedShopItem && (() => {
          const isOwned = (profile.unlockedItems || []).includes(selectedShopItem.id);
          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 z-55 flex flex-col justify-end p-4"
            >
              <motion.div
                initial={{ y: 150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 150, opacity: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-4 text-left"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">Beloning details</span>
                  <button 
                    onClick={() => setSelectedShopItem(null)}
                    className="p-1 rounded bg-slate-950 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-500">
                    {renderShopIcon(selectedShopItem.icon, "w-8 h-8")}
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-amber-500 border border-amber-900/30 bg-amber-950/10 px-2 py-0.5 rounded-full uppercase">
                      {selectedShopItem.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-white mt-1">{selectedShopItem.dutchName}</h3>
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">{selectedShopItem.name}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">BESCHRIJVING VAN VOORDEEL</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedShopItem.dutchDescription}
                  </p>
                  <p className="text-[10px] text-slate-450 leading-relaxed italic">
                    {selectedShopItem.description}
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-slate-450">Prijs van upgrade:</span>
                  <span className="font-bold font-mono text-yellow-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> {selectedShopItem.price} Punten
                  </span>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setSelectedShopItem(null)}
                    className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-400 rounded-xl cursor-pointer"
                  >
                    Annuleren
                  </button>
                  {isOwned ? (
                    selectedShopItem.id.endsWith("-theme") ? (
                      <button
                        type="button"
                        onClick={() => {
                          setProfile(prev => ({ ...prev, selectedTheme: selectedShopItem.id }));
                          alert(`🎉 Thema "${selectedShopItem.dutchName}" is nu geactiveerd in de app interface!`);
                          setSelectedShopItem(null);
                        }}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl active:scale-95 text-center cursor-pointer transition-all ${
                          profile.selectedTheme === selectedShopItem.id
                            ? "bg-emerald-600 text-white shadow shadow-emerald-500/20"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                      >
                        {profile.selectedTheme === selectedShopItem.id ? "Actief Thema ✨" : "Activeer Thema 🎨"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setProfile(prev => ({ ...prev, selectedBadge: selectedShopItem.id }));
                          alert(`🎉 Badge "${selectedShopItem.dutchName}" is nu geactiveerd op je profiel-avatar!`);
                          setSelectedShopItem(null);
                        }}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl active:scale-95 text-center cursor-pointer transition-all ${
                          profile.selectedBadge === selectedShopItem.id
                            ? "bg-emerald-600 text-white shadow shadow-emerald-500/20"
                            : "bg-indigo-650 hover:bg-indigo-550 text-white"
                        }`}
                      >
                        {profile.selectedBadge === selectedShopItem.id ? "Actieve Badge 👑" : "Activeer Badge 🏷️"}
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePurchaseItem(selectedShopItem)}
                      className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center cursor-pointer ${
                        profile.points >= selectedShopItem.price 
                          ? "bg-amber-600 hover:bg-amber-500 text-white shadow shadow-amber-600/10" 
                          : "bg-slate-800 text-slate-450 cursor-not-allowed"
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" /> Beloning Kopen
                    </button>
                  )}
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* DETAIL DRAWER FOR CUPS */}
      <AnimatePresence>
        {selectedCup && (() => {
          const stats = {
            workoutsCount: totalWorkouts,
            waterAmountMl: Math.max(profile.waterIntakeMl, totalHydration),
            streak: dailyStreak,
            totalCalories: totalCalories
          };
          const unlocked = selectedCup.isUnlocked(stats);

          // Calculate current value for specific cup to show progress
          let currentVal = 0;
          let targetVal = 1;
          let unit = "";
          if (selectedCup.id === "pioneer-cup") {
            currentVal = stats.workoutsCount;
            targetVal = 1;
            unit = "workout(s)";
          } else if (selectedCup.id === "hydration-cup") {
            currentVal = stats.waterAmountMl;
            targetVal = 1000;
            unit = "ml water";
          } else if (selectedCup.id === "calorie-cup") {
            currentVal = stats.totalCalories;
            targetVal = 550;
            unit = "kcal";
          } else if (selectedCup.id === "streak-cup") {
            currentVal = stats.streak;
            targetVal = 3;
            unit = "dagen streak";
          }

          const progressPct = Math.min(100, Math.round((currentVal / targetVal) * 100));

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 z-55 flex flex-col justify-end p-4"
            >
              <motion.div
                initial={{ y: 150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 150, opacity: 0 }}
                className="bg-slate-900 border border-slate-805 rounded-2xl p-4.5 space-y-4 text-left"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">Beker Specificaties & Status</span>
                  <button 
                    onClick={() => setSelectedCup(null)}
                    className="p-1 rounded bg-slate-950 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border-2 flex items-center justify-center bg-gradient-to-br ${
                    unlocked 
                      ? `${selectedCup.colorClass} shadow-xl shadow-amber-500/10`
                      : "bg-slate-950/40 border-slate-800 text-slate-650"
                  }`}>
                    <Trophy className={`w-8 h-8 ${unlocked ? selectedCup.iconColor : "text-slate-650"}`} />
                  </div>
                  <div>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full uppercase ${
                      unlocked ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" : "bg-slate-950 text-slate-500"
                    }`}>
                      {unlocked ? "🏆 GEWONNEN & ACTIEF" : "🔒 VERGRENDELDE BEKER"}
                    </span>
                    <h3 className="text-sm font-extrabold text-white mt-1">{selectedCup.dutchTitle}</h3>
                    <p className="text-[9px] font-mono text-slate-450 mt-0.5">{selectedCup.title}</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl space-y-1 text-center font-mono">
                  <span className="text-[8px] text-slate-500 block uppercase">VEREISTE OP DE SIMULATOR</span>
                  <p className="text-[10.5px] text-slate-300 font-sans leading-normal">
                    {selectedCup.dutchRequirement}
                  </p>
                  <div className="pt-2">
                    <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-sans">
                      <span>Voortgang:</span>
                      <span>{currentVal} / {targetVal} {unit} ({progressPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${unlocked ? "bg-emerald-500" : "bg-indigo-550"}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[8px] font-mono text-slate-550 block uppercase">HOE WERKT DIT RECHT?</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-normal">
                    {selectedCup.dutchDescription}
                  </p>
                </div>

                <div className="bg-indigo-950/20 border border-indigo-900/35 p-3 rounded-xl text-left">
                  <span className="text-[8px] font-mono text-indigo-400 font-bold block uppercase mb-1">🗣️ INSIGHT VAN DE AI COACH</span>
                  <p className="text-[10px] text-indigo-200 leading-normal italic font-sans font-normal">
                    "{selectedCup.description}"
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Trigger audio feedback!
                      try {
                        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const osc = audioCtx.createOscillator();
                        const gainNode = audioCtx.createGain();
                        osc.connect(gainNode);
                        gainNode.connect(audioCtx.destination);
                        osc.frequency.setValueAtTime(330, audioCtx.currentTime); // Mi
                        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                        osc.start();
                        osc.stop(audioCtx.currentTime + 0.2);
                      } catch(err) {}
                      setSelectedCup(null);
                    }}
                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-550 text-xs font-bold text-white rounded-xl active:scale-95 text-center cursor-pointer font-sans"
                  >
                    Ok, helder! Sluiten
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
