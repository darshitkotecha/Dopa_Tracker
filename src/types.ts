
export interface UserProfile {
  name: string;
  age: string;
  teamCode: string;
  points: number;
  habits: Habit[];
  onboarded: boolean;
  history: DailyHistory[];
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  lastCompleted: string | null; // ISO Date
  longestStreak: number;
}

export interface DailyHistory {
  date: string; // YYYY-MM-DD
  completedHabits: string[]; // Habit IDs
  pointsEarned: number;
  proofUrl?: string; // Data URL for photo
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'physical' | 'digital';
  image: string;
}

export const MILESTONES = [
  { days: 7, label: "Initiate Stage", badge: "🏏" },
  { days: 21, label: "Habit Builder Stage", badge: "🔥" },
  { days: 90, label: "Lifestyle Builder Stage", badge: "🏆" },
  { days: 365, label: "Identity Builder Stage", badge: "👑" },
];

export const DEFAULT_HABITS = [
  { id: 'h1', name: 'Early Wakeup', icon: 'Sun' },
  { id: 'h2', name: 'Drink Water', icon: 'Droplets' },
  { id: 'h3', name: 'Diet Tracker', icon: 'Apple' },
  { id: 'h4', name: 'Focus Tracker', icon: 'Target' },
  { id: 'h5', name: 'Learn Builder', icon: 'BookOpen' },
  { id: 'h6', name: 'Exercise', icon: 'Dumbbell' },
  { id: 'h7', name: 'Sleep Better', icon: 'Moon' },
  { id: 'h8', name: 'Do Good', icon: 'Heart' },
];

export const REWARDS: Reward[] = [
  { 
    id: 'r1', 
    name: 'Cricket Gloves', 
    description: 'Pro-grade leather batting gloves.', 
    points: 500, 
    type: 'physical',
    image: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=400&h=400&fit=crop'
  },
  { 
    id: 'r2', 
    name: '$25 Amazon Gift Card', 
    description: 'Digital gift card for any purchase.', 
    points: 250, 
    type: 'digital',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop'
  },
  { 
    id: 'r3', 
    name: 'Kashmir Willow Bat', 
    description: 'Lightweight bat for power hitting.', 
    points: 1200, 
    type: 'physical',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop'
  },
  { 
    id: 'r4', 
    name: 'Sports Bottle', 
    description: 'Insulated 1L water bottle.', 
    points: 150, 
    type: 'physical',
    image: 'https://images.unsplash.com/photo-1602143307185-8c1556399997?w=400&h=400&fit=crop'
  }
];
