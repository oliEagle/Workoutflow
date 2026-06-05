import { LibraryExercise, FitnessGoal, FitnessLevel, EquipmentAccess } from "./types";

export const GOAL_LABELS: Record<FitnessGoal, string> = {
  'fat-loss': 'Fat Loss & Tone',
  'clean-bulk': 'Clean Lean Muscle Bulk',
  'overall-health': 'Cardiovascular & Overall Health',
  'strength': 'Raw Strength Progression',
  'endurance': 'High Endurance & Stamina',
};

export const LEVEL_LABELS: Record<FitnessLevel, string> = {
  'beginner': 'Beginner (0-1 yrs)',
  'intermediate': 'Intermediate (1-3 yrs)',
  'advanced': 'Advanced (3+ yrs)',
};

export const EQUIPMENT_LABELS: Record<EquipmentAccess, string> = {
  'full-gym': 'Sportschool (Full Gym)',
  'dumbbells': 'Dumbbells (Gewichten)',
  'bodyweight': 'Thuis / Lichaamsgewicht (Home)',
  'bands': 'Weerstandsbanden (Bands)',
};

export const INSTALLED_EXERCISED_DATABASE: LibraryExercise[] = [
  {
    name: "Push-Ups (Opdrukken)",
    category: "Chest & Arms (Borst & Armen)",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Begin in een hoge plankpositie met je handen iets breder dan schouderbreedte.",
      "Laat je lichaam gecontroleerd zakken totdat je borst bijna de grond raakt.",
      "Houd je lichaam in een rechte lijn en duw jezelf krachtig weer omhoog."
    ],
    tips: "Laat je heupen niet hangen en houd je buikspieren goed aangespannen."
  },
  {
    name: "Squats (Kniebuigingen)",
    category: "Legs & Glutes (Benen & Billen)",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Zet je voeten op schouderbreedte met je tenen licht naar buiten wijzend.",
      "Zak door je knieën alsof je op een stoel gaat zitten, houd je rug recht.",
      "Zak tot je dijen parallel zijn aan de vloer, en duw jezelf weer omhoog."
    ],
    tips: "Houd je gewicht op je hielen en laat je knieën niet voorbij je tenen komen."
  },
  {
    name: "Plank Hold (Planken)",
    category: "Core (Buikspieren)",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Plaats je onderarmen op de grond, met je ellebogen direct onder je schouders.",
      "Strek je benen en steun op je tenen, zodat je lichaam een rechte lijn vormt.",
      "Houd deze positie vast en blijf rustig en diep doorademen."
    ],
    tips: "Knijp in je billen en span je buik aan om te voorkomen dat je rug hol trekt."
  },
  {
    name: "Lunges (Uitvalsstappen)",
    category: "Legs (Benen)",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Sta rechtop en doe een grote stap vooruit met één been.",
      "Laat je heupen zakken tot beide knieën in een hoek van 90 graden gebogen zijn.",
      "Stap krachtig terug naar de beginpositie en wissel van been."
    ],
    tips: "Houd je bovenlichaam mooi rechtop tijdens de hele beweging."
  },
  {
    name: "Dumbbell Bicep Curls (Armen Trainen)",
    category: "Arms (Biceps)",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Sta rechtop met een dumbbell in elke hand, armen langs je lichaam.",
      "Draai je handpalmen naar voren en buig je ellebogen om de gewichten omhoog te brengen.",
      "Laat de dumbbells weer langzaam en gecontroleerd zakken."
    ],
    tips: "Houd je ellebogen strak tegen je zij aan gedrukt en zwaai niet met je rug."
  },
  {
    name: "Jumping Jacks (Stersprongen)",
    category: "Cardio & Full Body",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Sta rechtop met je voeten tegen elkaar en je armen langs je lichaam.",
      "Spring omhoog, spreid je benen en breng je armen boven je hoofd samen.",
      "Spring direct terug naar de beginpositie en herhaal in vlot tempo."
    ],
    tips: "Land zachtjes op de bal van je voeten om je gewrichten te sparen."
  },
  {
    name: "Dumbbell Shoulder Press (Schouderduwen)",
    category: "Shoulders (Schouders)",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    instructions: [
      "Houd twee dumbbells ter hoogte van je schouders met je handpalmen naar voren.",
      "Duw de gewichten recht omhoog totdat je armen gestrekt zijn boven je hoofd.",
      "Laat de gewichten langzaam weer zakken tot schouderhoogte."
    ],
    tips: "Houd je core aangespannen en overstrek je onderrug niet."
  }
];

export const INITIAL_LOGGED_WORKOUTS = [
  {
    id: "log-1",
    title: "AI Power Hypertrophy Lift",
    targetFocus: "Full Body Primary",
    durationMinutes: 52,
    caloriesBurned: 410,
    dateTime: "2026-06-03T08:15:00Z",
    exerciseCount: 6
  },
  {
    id: "log-2",
    title: "Dumbbell Push Protocol",
    targetFocus: "Chest, Shoulders & Triceps",
    durationMinutes: 45,
    caloriesBurned: 350,
    dateTime: "2026-06-01T17:30:00Z",
    exerciseCount: 5
  },
  {
    id: "log-3",
    title: "Agility & Core Endurance",
    targetFocus: "Abs & Stamina",
    durationMinutes: 30,
    caloriesBurned: 280,
    dateTime: "2026-05-30T10:00:00.000Z",
    exerciseCount: 4
  }
];

export const MOCK_PROGRESS_DATA = [
  { day: "Thu", duration: 30, calories: 240, workouts: 1, water: 2100 },
  { day: "Fri", duration: 45, calories: 350, workouts: 1, water: 2500 },
  { day: "Sat", duration: 0, calories: 0, workouts: 0, water: 1500 },
  { day: "Sun", duration: 60, calories: 480, workouts: 2, water: 3000 },
  { day: "Mon", duration: 40, calories: 310, workouts: 1, water: 2200 },
  { day: "Tue", duration: 52, calories: 410, workouts: 1, water: 2800 },
  { day: "Wed", duration: 35, calories: 290, workouts: 1, water: 2900 }
];
