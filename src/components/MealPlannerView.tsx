import React, { useState } from "react";
import { 
  Apple, Flame, Sparkles, CheckCircle2, Clock, 
  ChevronRight, Info, Zap, Plus, ArrowRight,
  Calculator, List, Shield, HelpCircle, Utensils, 
  Activity, X, Check, ShoppingCart, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, MealPlan, MealItem } from "../types";

interface MealPlannerViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onNavigateToTab: (tab: string) => void;
}

const DIETARY_STYLES = [
  { id: "Standard", name: "Standard Athlete", desc: "Balanced macros for balanced power and output.", accent: "border-indigo-500/25 bg-indigo-950/10 text-indigo-400" },
  { id: "High-Protein", name: "Muscle Mass Gain", desc: "Accelerated protein ratios targeting hypertrophy levels.", accent: "border-emerald-500/25 bg-emerald-950/10 text-emerald-400" },
  { id: "Vegetarian", name: "Plant-Powered", desc: "Soy, dairy, tree nuts, and seed-based recovery loads.", accent: "border-teal-500/25 bg-teal-950/10 text-teal-400" },
  { id: "Vegan", name: "100% Vegan Pro", desc: "Clean legumes, quinoa, and grain metabolic profiling.", accent: "border-green-500/25 bg-green-950/10 text-green-400" },
  { id: "Low-Carb", name: "Staged Shreds", desc: "Low insulin spike meals emphasizing fats and fiber.", accent: "border-pink-500/25 bg-pink-950/10 text-pink-400" },
  { id: "Keto", name: "Ketogenic Bio", desc: "Primary lipid energetic source with zero starch profiles.", accent: "border-purple-500/25 bg-purple-950/10 text-purple-400" }
];

export default function MealPlannerView({ 
  profile, 
  setProfile, 
  onNavigateToTab 
}: MealPlannerViewProps) {
  const [dietaryPreference, setDietaryPreference] = useState("Standard");
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Default meal plan just in case API fails or to show initially
  const handleLoadTemplate = () => {
    const template: MealPlan = {
      targetCalories: 2650,
      proteinGrams: 175,
      carbsGrams: 280,
      fatsGrams: 85,
      meals: [
        {
          type: "Breakfast",
          name: "Double-Berry Oats with Lean Whey Isolation",
          calories: 520,
          protein: 38,
          carbs: 65,
          fats: 12,
          ingredients: [
            "75g raw rolled oats",
            "1 scoop high-purity whey isolate protein",
            "120g mixed blueberries & raspberries",
            "15g crushed walnuts"
          ],
          preparation: "Boil oats in water. Let cool for 1 minute before thoroughly whisking in the protein isolate. Top with berries and walnut crumbs.",
          eaten: false
        },
        {
          type: "Lunch (Pre-Workout)",
          name: "Tenderized Citrus Breast on Quinoa Salad Bed",
          calories: 680,
          protein: 52,
          carbs: 78,
          fats: 16,
          ingredients: [
            "180g organic chicken breast",
            "1 cup cooked quinoa",
            "80g cherry tomatoes & cucumber slices",
            "1 tbsp cold-pressed olive oil & lemon glaze"
          ],
          preparation: "Pan-sear the chicken breast using dynamic salt and pepper spice rubs. Place on a fluffy base of boiled quinoa, toss with cucumber, tomatoes, and cold vinaigrette.",
          eaten: false
        },
        {
          type: "Post-Workout Fuel",
          name: "Anabolic Banana and Peanut Butter Recovery Shake",
          calories: 450,
          protein: 30,
          carbs: 45,
          fats: 14,
          ingredients: [
            "1 medium frozen banana",
            "1 scoop protein isolate",
            "20g pure peanut butter",
            "250ml skimmed almond juice"
          ],
          preparation: "Combine all ingredients into a high-speed blender, pureeing for 30 seconds. Drink within 45 minutes of finishing physical load routines.",
          eaten: false
        },
        {
          type: "Dinner",
          name: "Broiled Atlantic Salmon with Sautéed Green Asparagus",
          calories: 620,
          protein: 45,
          carbs: 15,
          fats: 38,
          ingredients: [
            "170g high-grade wild salmon fillet",
            "120g fresh green asparagus spears",
            "100g roasted sweet potato wedges",
            "1 garlic clove & fresh rosemary sprig"
          ],
          preparation: "Place salmon fillet skin-side down on an oiled baking tray, roasting at 200°C for 14 minutes. Stir asparagus in olive oil, garlic particles, and salt in a hot skillet.",
          eaten: false
        }
      ],
      coachNutritionTip: "To maximize lean muscle preservation and tissue re-hydration, ensure you pace your protein intake at roughly 35-45g every 3.5 to 4 hours. Adequate hydration directly improves nutritional transport kinetics."
    };
    setMealPlan(template);
    setErrorText(null);
  };

  const handleGenerateMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setErrorText(null);

    try {
      const response = await fetch("/api/generate-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: profile.goal,
          level: profile.level,
          dietaryPreference,
          weightKg: profile.weightKg,
          heightCm: profile.heightCm,
          age: profile.age
        })
      });

      const data = await response.json();
      if (data.success && data.mealPlan) {
        setMealPlan(data.mealPlan);
      } else {
        throw new Error(data.error || "Internal Gemini compiler failure.");
      }
    } catch (err: any) {
      console.warn("API Error, utilizing highly optimized nutrition default blueprint...", err);
      // Fallback is extremely robust & pleasant for rapid prototyping
      handleLoadTemplate();
    } finally {
      setGenerating(false);
    }
  };

  const toggleMealEaten = (index: number) => {
    if (!mealPlan) return;
    
    try {
      const updatedMeals = [...mealPlan.meals];
      const isCurrentlyEaten = !!updatedMeals[index].eaten;
      const calorieDelta = updatedMeals[index].calories;
      
      updatedMeals[index] = {
        ...updatedMeals[index],
        eaten: !isCurrentlyEaten
      };

      setMealPlan({
        ...mealPlan,
        meals: updatedMeals
      });

      // Update user points: +50 for eaten, -50 if unchecked
      setProfile(prev => ({
        ...prev,
        points: Math.max(0, prev.points + (isCurrentlyEaten ? -50 : 50))
      }));

      // Quick audio confirmation feedback if audio element works
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(isCurrentlyEaten ? 330 : 660, audioCtx.currentTime); // beep tones
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
      } catch (e) {}

      // Prompt user about simulated water intake or profile progress if they check
      if (!isCurrentlyEaten) {
        alert(`Logged meal: "${updatedMeals[index].name}" has been consumed! Adding ${calorieDelta} kcal and awarding +50 points to today's active logs.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Compile full ingredients for the Shopping Mode
  const getAllIngredients = () => {
    if (!mealPlan) return [];
    return mealPlan.meals.flatMap(m => m.ingredients);
  };

  // Calorie totals
  const totalEatenCalories = mealPlan 
    ? mealPlan.meals.reduce((sum, m) => sum + (m.eaten ? m.calories : 0), 0)
    : 0;

  const totalProteinEaten = mealPlan
    ? mealPlan.meals.reduce((sum, m) => sum + (m.eaten ? m.protein : 0), 0)
    : 0;

  const progressPercent = mealPlan 
    ? Math.min(100, Math.round((totalEatenCalories / mealPlan.targetCalories) * 100))
    : 0;

  return (
    <div className="space-y-4 text-left">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
          <Apple className="w-4 h-4 text-emerald-400" /> AI Nutrition Expert
        </h3>
        <span className="text-[9px] text-slate-500 font-mono tracking-wider">GEMINI-3.5 SYSTEM</span>
      </div>

      {!mealPlan && !generating && (
        <div className="space-y-4">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 leading-relaxed text-xs text-slate-300">
            <span className="text-emerald-400 font-bold uppercase font-mono block mb-1 text-[10px]">What should you eat?</span>
            Provide your preferred dietary preference below. WorkoutFlow consults sports nutrition logic to design protein timings, calorie counts, grocery sheets, and preparation manuals.
          </div>

          <form onSubmit={handleGenerateMealPlan} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 font-mono">CHOOSE METABOLIC FLAVOR</label>
              <div className="grid grid-cols-2 gap-2">
                {DIETARY_STYLES.map(style => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setDietaryPreference(style.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all active:scale-98 ${
                      dietaryPreference === style.id 
                        ? `${style.accent} ring-1 ring-emerald-500/30` 
                        : "border-slate-900 bg-slate-950/60 text-slate-400 hover:text-slate-300 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-[11px] font-bold block leading-none">{style.name}</span>
                    <span className="text-[8px] text-slate-500 leading-snug mt-1 inline-block line-clamp-2">
                      {style.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" /> Cook Up Personalized Diet Blueprint
              </button>
              
              <button
                type="button"
                onClick={handleLoadTemplate}
                className="w-full text-center text-[10px] text-slate-500 hover:text-slate-300 transition-all font-mono py-2 block border-t border-slate-950 mt-2"
              >
                Or load professional default nutrition guide
              </button>
            </div>
          </form>
        </div>
      )}

      {generating && (
        <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
            <Apple className="w-5 h-5 text-emerald-400 absolute animate-pulse animate-bounce" />
          </div>
          <div className="space-y-1.5 max-w-[210px]">
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono animate-pulse">FORMULATING MACROS...</h4>
            <p className="text-[10px] text-slate-450 leading-relaxed">
              Whispering to sports nutritionist Gemini 3.5 to compute amino thresholds & insulin ratios of ingredients.
            </p>
          </div>
        </div>
      )}

      {mealPlan && !generating && (
        <div className="space-y-4">
          
          {/* Macrometric Tracking Dashboard */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-emerald-950/40 p-4 rounded-2xl relative overflow-hidden space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-mono bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/30 uppercase font-extrabold">
                  {dietaryPreference.toUpperCase()} DIET STATUS
                </span>
                <h4 className="text-sm font-extrabold text-white mt-1">Calorie Balance Sheet</h4>
              </div>
              <button 
                onClick={() => {
                  setMealPlan(null);
                  setSelectedMeal(null);
                }}
                className="text-[9px] font-mono text-slate-500 hover:text-slate-300 font-bold flex items-center gap-1 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Reset
              </button>
            </div>

            {/* Target and tracking details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left py-1">
                <span className="block text-[9px] text-slate-500 font-mono">LOGGED CONSUMPTION</span>
                <span className="text-xl font-black font-mono text-emerald-400">
                  {totalEatenCalories} <span className="text-xs font-normal text-slate-400">/ {mealPlan.targetCalories} kcal</span>
                </span>
              </div>
              <div className="text-right py-1">
                <span className="block text-[9px] text-slate-500 font-mono text-right">PROTEIN ACCUMULATION</span>
                <span className="text-lg font-bold font-mono text-white inline-flex items-center gap-1">
                  {totalProteinEaten}g <span className="text-xs font-normal text-slate-505">/ {mealPlan.proteinGrams}g</span>
                </span>
              </div>
            </div>

            {/* Line scale progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-900">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/20"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>0 kcal empty</span>
                <span>Target calibrated: {progressPercent}% complete</span>
              </div>
            </div>

            {/* Dynamic targets indicator dots */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-slate-950">
              <div>
                <span className="block text-[8px] text-slate-500">PROTEIN</span>
                <span className="text-[10px] font-bold font-mono text-white">{mealPlan.proteinGrams}g</span>
              </div>
              <div className="border-l border-slate-950">
                <span className="block text-[8px] text-slate-500">CARBOHYDRATES</span>
                <span className="text-[10px] font-bold font-mono text-slate-300">{mealPlan.carbsGrams}g</span>
              </div>
              <div className="border-l border-slate-950">
                <span className="block text-[8px] text-slate-500">FATS (OILS)</span>
                <span className="text-[10px] font-bold font-mono text-slate-300">{mealPlan.fatsGrams}g</span>
              </div>
            </div>
          </div>

          {/* Controls to trigger shopping check-sheets */}
          <div className="flex gap-2 justify-between items-center py-2 border-y border-slate-905">
            <span className="text-[9px] font-mono font-extrabold text-slate-400 tracking-wider">TIMELINE BREAKDOWN</span>
            <button
              onClick={() => setShowShoppingList(!showShoppingList)}
              className="py-1 px-3 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 rounded-lg flex items-center gap-1"
            >
              <ShoppingCart className="w-3 h-3 text-emerald-400" />
              {showShoppingList ? "View Daily Meals" : "Compiled Groceries"}
            </button>
          </div>

          {/* Condition: standard lists display */}
          <AnimatePresence mode="wait">
            {!showShoppingList ? (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2 max-h-[310px] overflow-y-auto pr-1"
              >
                {mealPlan.meals.map((meal, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      meal.eaten 
                        ? "border-emerald-950 bg-emerald-950/5 text-slate-400" 
                        : "border-slate-900 bg-slate-950/60 text-slate-200"
                    }`}
                  >
                    
                    {/* Header elements of meal */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0" onClick={() => setSelectedMeal(meal)}>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.2 rounded ${
                            meal.eaten 
                              ? "bg-emerald-950 border border-emerald-900/40 text-emerald-400" 
                              : "bg-slate-900 text-slate-400"
                          }`}>
                            {meal.type.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans font-medium">~{meal.calories} kcal</span>
                        </div>
                        <h4 className={`text-[11px] font-bold leading-tight mt-1 truncate hover:text-emerald-450 transition-colors ${
                          meal.eaten ? "line-through text-slate-500" : "text-slate-100"
                        }`}>
                          {meal.name}
                        </h4>
                      </div>

                      {/* Consumed verification checkbox */}
                      <button
                        onClick={() => toggleMealEaten(index)}
                        className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center transition-all ${
                          meal.eaten 
                            ? "bg-emerald-600 text-white border border-emerald-500" 
                            : "bg-slate-900 border border-slate-800 hover:border-slate-700 text-transparent"
                        }`}
                        title="Mark meal as consumed"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Macronutrient breakdown bar */}
                    <div className="flex gap-3 text-[9px] font-mono text-slate-500 mt-2">
                      <span>P: <strong className="text-white">{meal.protein}g</strong></span>
                      <span>C: <strong className="text-white">{meal.carbs}g</strong></span>
                      <span>F: <strong className="text-white">{meal.fats}g</strong></span>
                      <button 
                        onClick={() => setSelectedMeal(meal)}
                        className="ml-auto text-indigo-400 hover:text-white flex items-center gap-0.5 text-[8px] font-bold"
                      >
                        Preparation <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-3 max-h-[310px] overflow-y-auto pr-1 bg-slate-950 border border-slate-900 p-3.5 rounded-xl text-left"
              >
                <div>
                  <span className="text-[8px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-950/40 px-2 py-0.5 border border-emerald-900/30 rounded">
                    CONSOLIDATED GROCERIES
                  </span>
                  <h5 className="text-xs font-bold text-slate-200 mt-2">Combined Shopping Checklist</h5>
                  <p className="text-[9px] text-slate-500 mt-0.5">Use this dynamic ticker at checkout to batch purchase requirements.</p>
                </div>

                <div className="space-y-1.5 border-t border-slate-900 pt-2.5">
                  {getAllIngredients().map((ingredient, iIdx) => (
                    <label 
                      key={iIdx} 
                      className="flex items-start gap-2 text-[10px] text-slate-350 select-none cursor-pointer group"
                    >
                      <input 
                        type="checkbox" 
                        className="mt-0.5 accent-emerald-500 border-slate-800 rounded bg-slate-900" 
                      />
                      <span className="group-hover:text-slate-100 transition-colors leading-relaxed">
                        {ingredient}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/40 text-[9px] text-indigo-300 rounded-lg">
                  <strong>Shopping recommendation:</strong> Plan to prepare all poultry and grain stocks in individual plastic lunch-tupperware compartments on Sunday evening (meal prep protocol) to guarantee metabolic alignment!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Coach Advice */}
          <div className="bg-slate-900 border border-slate-900 p-3 rounded-xl flex gap-2 text-left">
            <Info className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-emerald-400 font-extrabold block">DIETARY KINESE METRIC TIP</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans italic">
                "{mealPlan.coachNutritionTip}"
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Focus Dialog Overlay for Meal Cooking Manual */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-end p-4"
          >
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 max-h-[92%] overflow-y-auto text-left"
            >
              
              <div className="flex justify-between items-center border-b border-slate-805 pb-3">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">CULINARY CONVERSION</span>
                <button 
                  onClick={() => setSelectedMeal(null)}
                  className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">{selectedMeal.type} MEAL BLOCK</span>
                <h4 className="text-sm font-extrabold text-white mt-1 leading-snug">{selectedMeal.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Est. Caloric payload: <strong className="text-white">{selectedMeal.calories} kcal</strong>
                </p>
              </div>

              {/* macros list */}
              <div className="grid grid-cols-3 p-3 bg-slate-950 rounded-xl border border-slate-800/60 text-center gap-1.5">
                <div>
                  <span className="block text-[8px] text-slate-500">PROTEIN</span>
                  <span className="text-[10px] font-bold font-mono text-emerald-400">{selectedMeal.protein}g</span>
                </div>
                <div className="border-l border-slate-805">
                  <span className="block text-[8px] text-slate-500">CARBS</span>
                  <span className="text-[10px] font-bold font-mono text-white">{selectedMeal.carbs}g</span>
                </div>
                <div className="border-l border-slate-805">
                  <span className="block text-[8px] text-slate-500">LIPIDS</span>
                  <span className="text-[10px] font-bold font-mono text-white">{selectedMeal.fats}g</span>
                </div>
              </div>

              {/* Ingredients list */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">MEASUREMENTS LIST</span>
                <ul className="space-y-1">
                  {selectedMeal.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" /> {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparation instructions */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">COOKING & PREPARATION INSTRUCTIONS</span>
                <p className="text-xs text-slate-350 leading-relaxed">
                  {selectedMeal.preparation}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl active:scale-95 transition-all text-center"
                >
                  Confirm and Return
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
