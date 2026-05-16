import { UserProfile, Habit, DailyHistory } from '../types';
import { format } from 'date-fns';

const STORAGE_KEY = 'habit_quest_user';

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const getUser = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const updateHabitCompletion = (user: UserProfile, habitId: string): UserProfile => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const habitIndex = user.habits.findIndex(h => h.id === habitId);
  
  if (habitIndex === -1) return user;
  
  const habit = user.habits[habitIndex];
  
  // Check if already completed today
  if (habit.lastCompleted === today) return user;
  
  // Update Streak
  let newStreak = (habit.streak || 0) + 1;
  const lastComp = habit.lastCompleted;
  
  if (lastComp) {
    const lastDate = new Date(lastComp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If last completion wasn't yesterday, reset streak (simplified)
    if (format(lastDate, 'yyyy-MM-dd') !== format(yesterday, 'yyyy-MM-dd')) {
      newStreak = 1;
    }
  }

  const updatedHabits = [...user.habits];
  updatedHabits[habitIndex] = {
    ...habit,
    streak: newStreak,
    lastCompleted: today,
    longestStreak: Math.max(habit.longestStreak || 0, newStreak)
  };

  // Update Points
  const newPoints = user.points + 1;

  // Add to History
  const historyIndex = user.history.findIndex(h => h.date === today);
  const updatedHistory = [...user.history];
  
  if (historyIndex !== -1) {
    updatedHistory[historyIndex].completedHabits.push(habitId);
    updatedHistory[historyIndex].pointsEarned += 1;
  } else {
    updatedHistory.push({
      date: today,
      completedHabits: [habitId],
      pointsEarned: 1
    });
  }

  const updatedUser = {
    ...user,
    habits: updatedHabits,
    points: newPoints,
    history: updatedHistory
  };
  
  saveUser(updatedUser);
  return updatedUser;
};
