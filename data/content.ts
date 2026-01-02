import { LearnModule, AdvancedTopic, SGEvent } from '../types';

// 8 Beginner Modules with Singapore examples - showing first 2 complete, rest abbreviated for space
export const beginnerModules: LearnModule[] = [
  {
    id: 'module-1',
    title: 'Energy Balance + Metabolism Basics',
    category: 'beginner',
    completed: false,
    content: [
      { type: 'heading', content: 'Understanding Energy Balance' },
      { type: 'text', content: 'Your body needs energy (calories) to function. Energy balance is calories in vs calories out.' },
      { type: 'heading', content: 'Metabolism for Teens' },
      { type: 'text', content: 'Teen metabolism is unique! You need MORE energy than adults for growth.' },
      { type: 'bullet', content: 'BMR: Energy your body uses at rest (~60-70% of total)' },
      { type: 'bullet', content: 'NEAT: Non-exercise activity (walking to class)' },
      { type: 'example', content: 'Chicken rice at canteen: ~500-600 calories' },
    ],
    quiz: {
      questions: [
        {
          id: 'q1-1',
          question: 'What is the largest component of daily energy expenditure?',
          options: ['Exercise', 'Basal Metabolic Rate (BMR)', 'Digesting food', 'Walking'],
          correctAnswer: 1,
          explanation: 'BMR accounts for 60-70% of total daily calories for basic body functions.',
        },
        {
          id: 'q1-2',
          question: 'Why do teens need more calories than many adults?',
          options: ['Teens exercise more', 'Teens are still growing', 'Slower metabolism', 'Eat more junk'],
          correctAnswer: 1,
          explanation: 'Growth and development require significant energy for bone, muscle, and brain development.',
        },
      ],
    },
  },
  {
    id: 'module-2',
    title: 'Macronutrients + Food Quality',
    category: 'beginner',
    completed: false,
    content: [
      { type: 'heading', content: 'The Big Three: Carbs, Protein, Fat' },
      { type: 'text', content: 'Macronutrients are nutrients your body needs in large amounts.' },
      { type: 'heading', content: 'Carbohydrates (4 cal/g)' },
      { type: 'bullet', content: 'Primary fuel for brain and muscles' },
      { type: 'example', content: 'SG examples: Brown rice, whole grain bread, fruits' },
      { type: 'heading', content: 'Protein (4 cal/g)' },
      { type: 'bullet', content: 'Builds muscles, bones, skin. Teens need ~0.8-1g per kg daily' },
      { type: 'example', content: 'SG: Chicken, fish, tofu, eggs, legumes' },
    ],
    quiz: {
      questions: [
        {
          id: 'q2-1',
          question: 'Which macronutrient is the primary fuel for your brain?',
          options: ['Protein', 'Carbohydrates', 'Fat', 'Fiber'],
          correctAnswer: 1,
          explanation: 'Your brain runs mainly on glucose from carbs.',
        },
      ],
    },
  },
  {
    id: 'module-3',
    title: 'Micronutrients + RDA Essentials',
    category: 'beginner',
    completed: false,
    content: [
      { type: 'heading', content: 'Micronutrients: Small But Mighty' },
      { type: 'text', content: 'Vitamins and minerals are essential for growth and energy.' },
      { type: 'bullet', content: 'Fiber: 25-30g daily' },
      { type: 'bullet', content: 'Calcium: 1200-1300mg for strong bones' },
      { type: 'example', content: 'Bubble tea with regular sugar: ~30-50g sugar!' },
    ],
    quiz: { questions: [] },
  },
  {
    id: 'module-4',
    title: 'My Healthy Plate + Portioning Skills',
    category: 'beginner',
    completed: false,
    content: [
      { type: 'heading', content: 'My Healthy Plate (HPB Singapore)' },
      { type: 'bullet', content: 'Half plate: Fruit & vegetables' },
      { type: 'bullet', content: 'Quarter: Whole grains' },
      { type: 'bullet', content: 'Quarter: Protein' },
      { type: 'example', content: 'Economic rice: 1 meat, 2-3 veggies, brown rice' },
    ],
    quiz: { questions: [] },
  },
  {
    id: 'module-5',
    title: 'Singapore Food Environment',
    category: 'beginner',
    completed: false,
    content: [
      { type: 'heading', content: 'Navigating SG Food' },
      { type: 'example', content: 'Roasted chicken rice vs fried' },
      { type: 'example', content: 'Soup bee hoon with veggies' },
      { type: 'example', content: 'Bubble tea: 0-50% sugar' },
    ],
    quiz: { questions: [] },
  },
  {
    id: 'module-6',
    title: 'Exercise Science',
    category: 'beginner',
    completed: false,
    content: [
      { type: 'heading', content: 'Types of Exercise' },
      { type: 'bullet', content: 'Strength: 2-3x weekly' },
      { type: 'bullet', content: 'Cardio: 60 min daily' },
      { type: 'bullet', content: 'NEAT: Daily movement adds up!' },
    ],
    quiz: { questions: [] },
  },
  {
    id: 'module-7',
    title: 'Sleep + Stress + Hunger/Cravings',
    category: 'beginner',
    completed: false,
    content: [
      { type: 'heading', content: 'Sleep: The Foundation' },
      { type: 'text', content: 'Teens need 8-10 hours nightly.' },
      { type: 'bullet', content: 'Poor sleep increases hunger hormones' },
    ],
    quiz: { questions: [] },
  },
  {
    id: 'module-8',
    title: 'Myths & Misinformation Toolkit',
    category: 'beginner',
    completed: false,
    content: [
      { type: 'heading', content: 'Spotting Misinformation' },
      { type: 'bullet', content: 'Red flag: Quick fixes' },
      { type: 'example', content: 'MYTH: Carbs make you fat' },
    ],
    quiz: { questions: [] },
  },
];

export const advancedTopics: AdvancedTopic[] = [
  {
    id: 'adv-1',
    title: 'Metabolic Adaptation & Set Point Theory',
    category: 'Nutrition science',
    popularity: 85,
    lastUpdated: '2025-12-15',
    bookmarked: false,
    content: {
      explanation: 'Metabolic adaptation refers to the body\'s response to sustained calorie restriction. When you eat significantly less, your metabolism slows down. For teens, this is especially important because aggressive dieting can interfere with growth.',
      keyFindings: [
        'Metabolic rate can decrease by 10-25% during prolonged restriction',
        'Teen bodies have higher baseline metabolic rates due to growth demands',
        'Recovery can take months and requires adequate nutrition',
      ],
      evidence: [
        {
          title: 'Minnesota Starvation Experiment (Keys et al., 1950)',
          keyStats: '50% calorie restriction showed 40% metabolic decrease',
          limitations: 'Extreme conditions, adult men only',
          link: 'https://example.com',
        },
      ],
      teenApplication: 'Work with your body, not against it. Moderate, sustainable changes don\'t trigger dramatic adaptation.',
    },
  },
  {
    id: 'adv-2',
    title: 'Sleep Deprivation & Teen Health',
    category: 'Sleep & stress',
    popularity: 95,
    lastUpdated: '2025-12-18',
    bookmarked: false,
    content: {
      explanation: 'Sleep deprivation is epidemic among teenagers. Teens need 8-10 hours nightly, but biological changes shift circadian rhythms later.',
      keyFindings: [
        'Over 70% of teens don\'t get recommended sleep',
        'Sleep deprivation increases obesity risk by 50-80%',
        'One night of poor sleep increases next-day calorie intake by 200-300 calories',
      ],
      evidence: [],
      teenApplication: 'Sleep isn\'t optional. It\'s essential for everything you care about: academics, mood, health, performance.',
    },
  },
];

export const sgEvents: SGEvent[] = [
  {
    id: 'evt-1',
    title: 'East Coast Park Morning Run',
    date: '2026-01-15',
    location: 'East Coast Park, Area C',
    type: 'Running',
    free: true,
    description: 'Community morning run for all fitness levels.',
  },
  {
    id: 'evt-2',
    title: 'ActiveSG Sports Festival',
    date: '2026-01-22',
    location: 'Bishan Stadium',
    type: 'Multi-sport',
    free: true,
    description: 'Try various sports including basketball, badminton, rock climbing.',
  },
];

export const aiKnowledgeBase = {
  nutrition: {
    protein: 'Teens need about 0.8-1g protein per kg body weight. Good sources: chicken, fish, tofu, eggs.',
    carbs: 'Carbs are your brain and muscles\' primary fuel. Choose whole grains, fruits, veggies.',
    water: 'Aim for 2-3 liters daily. More if very active.',
  },
  exercise: {
    teens_recommendation: 'Teens need 60 minutes moderate activity daily + strength training 2-3x weekly.',
  },
  sleep: {
    teen_needs: 'Teens need 8-10 hours nightly. Poor sleep increases hunger and affects mood.',
  },
  singapore_food: {
    chicken_rice: 'Chicken rice: ~500-600 cal. Choose roasted over fried.',
    bubble_tea: 'Smart order: 0-50% sugar, fresh milk option.',
  },
  safety: {
    refusal_disordered_eating: 'I can\'t help with extreme dieting. Please talk to a trusted adult or call National Care Hotline (1800-202-6868).',
    refusal_self_harm: 'I\'m concerned about you. Please talk to a trusted adult immediately or call National Care Hotline (1800-202-6868).',
  },
};

