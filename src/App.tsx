import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  ShoppingBag, 
  Dumbbell, 
  Sun, 
  Droplets, 
  Apple, 
  Target, 
  BookOpen, 
  Moon, 
  Heart, 
  Camera, 
  Plus, 
  ChevronRight, 
  Zap, 
  CheckCircle2, 
  Share2,
  TrendingUp,
  LayoutDashboard,
  Menu,
  LogOut
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays, isSameDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { UserProfile, Habit, MILESTONES, REWARDS, DEFAULT_HABITS } from './types';
import { getUser, saveUser, updateHabitCompletion } from './lib/storage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Icon Mapping
const IconMap: Record<string, React.ReactNode> = {
  Sun: <Sun className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  Apple: <Apple className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
};

type Screen = 'onboarding' | 'dashboard' | 'teams' | 'rewards';

// --- NAVIGATION & LAYOUT ---
function MobileHeader({ user, onLogout, onToggleMenu }: { user: UserProfile, onLogout: () => void, onToggleMenu: () => void }) {
  const today = format(new Date(), 'EEE, MMM dd');
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-40 px-4 flex items-center justify-between shadow-sm">
      <button 
        onClick={onToggleMenu}
        className="p-2 hover:bg-slate-100 rounded-full text-neon transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="flex flex-col items-center">
        <h1 className="text-sm font-bold tracking-tight text-ink">{user.name}</h1>
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{today}</span>
      </div>
      
      <button 
        onClick={onLogout}
        className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-all active:scale-90"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
}

function SideMenu({ isOpen, onClose, currentScreen, setScreen, user }: { 
  isOpen: boolean, 
  onClose: () => void, 
  currentScreen: Screen, 
  setScreen: (s: Screen) => void,
  user: UserProfile
}) {
  const menuItems: { screen: Screen, icon: any, label: string, desc: string }[] = [
    { screen: 'dashboard', icon: LayoutDashboard, label: 'The Nets', desc: 'Daily Practice' },
    { screen: 'teams', icon: Users, label: 'The Stadium', desc: 'Team Match' },
    { screen: 'rewards', icon: ShoppingBag, label: 'Club Shop', desc: 'Redeem Runs' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] shadow-2xl border-r border-slate-100"
          >
            <div className="p-8 space-y-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-neon italic">HABIT QUEST</h2>
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                  <span>ID: {user.teamCode}</span>
                </div>
              </div>

              <nav className="space-y-4">
                {menuItems.map(item => (
                  <button
                    key={item.screen}
                    onClick={() => { setScreen(item.screen); onClose(); }}
                    className={cn(
                      "w-full flex items-center space-x-4 p-4 rounded-2xl transition-all",
                      currentScreen === item.screen ? "bg-neon text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-bold">{item.label}</div>
                      <div className={cn("text-[10px] uppercase font-bold opacity-60")}>{item.desc}</div>
                    </div>
                  </button>
                ))}
              </nav>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Lifetime Career Runs</div>
                  <div className="text-2xl font-black text-neon font-mono">{user.points}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AppFooter() {
  return (
    <footer className="py-12 px-6 text-center border-t border-slate-100 mt-8">
      <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
        Copyright by Darshit K By GDG baroda 2026
      </p>
    </footer>
  );
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tip, setTip] = useState<string>("Stay focused on your goals!");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setScreen('dashboard');
    }
    setIsLoading(false);
    fetchTip();
  }, []);

  const handleLogout = () => {
    if (confirm("Logout will reset your local progress. Are you sure?")) {
      localStorage.removeItem('habit_quest_user');
      setUser(null);
      setScreen('onboarding');
    }
  };

  const fetchTip = async () => {
    try {
      const res = await fetch('/api/habit-tips');
      const data = await res.json();
      if (data.tip) setTip(data.tip);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <div className="h-screen w-screen bg-stadium flex items-center justify-center text-neon">Loading...</div>;

  return (
    <div className="min-h-screen bg-stadium text-ink stadium-gradient selection:bg-neon selection:text-white">
      <AnimatePresence mode="wait">
        {screen === 'onboarding' && (
          <Onboarding 
            key="onboarding" 
            onComplete={(u) => { setUser(u); setScreen('dashboard'); }} 
          />
        )}
        
        {user && (
          <>
            <MobileHeader 
              user={user} 
              onLogout={handleLogout} 
              onToggleMenu={() => setIsMenuOpen(true)} 
            />
            
            <SideMenu 
              isOpen={isMenuOpen} 
              onClose={() => setIsMenuOpen(false)} 
              currentScreen={screen}
              setScreen={setScreen}
              user={user}
            />

            <main className="pt-20 pb-24 max-w-lg mx-auto">
              {screen === 'dashboard' && (
                <Dashboard 
                  user={user} 
                  setUser={setUser} 
                  tip={tip}
                />
              )}

              {screen === 'teams' && (
                <Teams user={user} />
              )}

              {screen === 'rewards' && (
                <Rewards user={user} setUser={setUser} />
              )}
              
              <AppFooter />
            </main>

            <BottomNav currentScreen={screen} setScreen={setScreen} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SCREEN: ONBOARDING ---
function Onboarding({ onComplete }: { onComplete: (u: UserProfile) => void, key?: string }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const toggleHabit = (id: string) => {
    setSelectedHabits(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const startQuest = () => {
    if (!name || !age || selectedHabits.length === 0) return;
    
    const newUser: UserProfile = {
      name,
      age,
      teamCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      points: 0,
      habits: DEFAULT_HABITS
        .filter(h => selectedHabits.includes(h.id))
        .map(h => ({ ...h, streak: 0, lastCompleted: null, longestStreak: 0 })),
      onboarded: true,
      history: []
    };
    
    saveUser(newUser);
    onComplete(newUser);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-lg mx-auto space-y-8 pt-12"
    >
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-neon leading-tight">HABIT QUEST</h1>
        <p className="text-gray-400">Join the nets. Build your identity. Score runs.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-gray-400">Player Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g. Sachin T."
            className="w-full bg-pitch border-white/10 border p-4 rounded-xl focus:border-neon outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-gray-400">Age</label>
          <input 
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Player's age"
            className="w-full bg-pitch border-white/10 border p-4 rounded-xl focus:border-neon outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs uppercase tracking-widest text-slate-500">Select Training Skills</label>
        <div className="grid grid-cols-2 gap-3">
          {DEFAULT_HABITS.map(h => (
            <button
              key={h.id}
              onClick={() => toggleHabit(h.id)}
              className={cn(
                "p-4 rounded-xl border flex items-center space-x-3 transition-all",
                selectedHabits.includes(h.id) 
                  ? "bg-neon text-white border-neon" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              )}
            >
              {IconMap[h.icon]}
              <span className="text-sm font-medium">{h.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={startQuest}
        disabled={!name || !age || selectedHabits.length === 0}
        className="w-full bg-neon text-black font-bold p-5 rounded-2xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
      >
        <span>START QUEST</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

// --- SCREEN: DASHBOARD ---
function Dashboard({ user, setUser, tip }: { user: UserProfile, setUser: (u: UserProfile) => void, tip: string, key?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleComplete = (id: string) => {
    const updated = updateHabitCompletion(user, id);
    setUser(updated);
    // Haptic simulation if possible or just visual
  };

  const getActiveMilestone = (days: number) => {
    return [...MILESTONES].reverse().find(m => days >= m.days) || { label: "Rookie", badge: "🌱" };
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const updatedHistory = [...user.history];
        const histIndex = updatedHistory.findIndex(h => h.date === today);
        
        if (histIndex !== -1) {
          updatedHistory[histIndex].proofUrl = reader.result as string;
        } else {
          updatedHistory.push({
            date: today,
            completedHabits: [],
            pointsEarned: 0,
            proofUrl: reader.result as string
          });
        }
        
        const updatedUser = { ...user, history: updatedHistory };
        setUser(updatedUser);
        saveUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  const todayHistory = user.history.find(h => h.date === format(new Date(), 'yyyy-MM-dd'));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      <header className="flex justify-between items-start pt-6">
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="flex items-center space-x-2 text-neon">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-mono tracking-tighter">TOTAL RUNS: {user.points}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-neon flex items-center justify-center text-xl bg-pitch">
          {getActiveMilestone(Math.max(...user.habits.map(h => h.streak), 0)).badge}
        </div>
      </header>

      {/* Learn Builder Card */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-neon/10 border border-neon/30 p-5 rounded-2xl space-y-2 relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 text-neon/10"><BookOpen className="w-24 h-24" /></div>
        <h3 className="text-xs font-bold text-neon uppercase tracking-wider">Coach's Tip</h3>
        <p className="text-sm leading-relaxed pr-8">{tip}</p>
        <div className="flex items-center space-x-1 text-[10px] text-neon/60 mt-2">
          <Zap className="w-3 h-3" />
          <span>BONUS RUN ANIMATION ACTIVE</span>
        </div>
      </motion.div>

      {/* Habit List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Daily Drills</h3>
        <div className="space-y-3">
          {user.habits.map(h => {
             const isCompleted = h.lastCompleted === format(new Date(), 'yyyy-MM-dd');
             return (
              <motion.div
                key={h.id}
                layout
                className={cn(
                  "p-5 rounded-2xl flex items-center justify-between border transition-all duration-300",
                  isCompleted ? "bg-slate-50 border-neon/30 opacity-60" : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className={cn("p-3 rounded-xl", isCompleted ? "bg-neon/10 text-neon" : "bg-slate-50")}>
                    {IconMap[h.icon]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-ink">{h.name}</h4>
                    <span className="text-xs font-mono text-slate-400">{h.streak} Day Streak</span>
                  </div>
                </div>
                
                <button
                  onClick={() => !isCompleted && handleComplete(h.id)}
                  disabled={isCompleted}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    isCompleted ? "bg-neon/10 text-neon" : "bg-neon text-white active:scale-90"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </button>
              </motion.div>
             );
          })}
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Daily Match Proof</h3>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3 bg-slate-50 hover:border-neon/50 cursor-pointer transition-colors relative overflow-hidden"
        >
          {todayHistory?.proofUrl ? (
            <img src={todayHistory.proofUrl} className="w-full h-full object-cover opacity-80" alt="Proof" />
          ) : (
            <>
              <Camera className="w-8 h-8 text-slate-400" />
              <span className="text-sm text-slate-400">Upload Team Proof from Gallery</span>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload}
            className="hidden" 
          />
        </div>
      </div>
    </motion.div>
  );
}

// --- SCREEN: TEAMS ---
function Teams({ user }: { user: UserProfile, key?: string }) {
  // Simulated Analytics Data
  const weeklyData = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  }).map(date => {
    const hist = user.history.find(h => isSameDay(new Date(h.date), date));
    return {
      name: format(date, 'eee'),
      runs: hist ? hist.pointsEarned : 0
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      <header className="pt-6">
        <h2 className="text-3xl font-bold italic tracking-tighter">THE STADIUM</h2>
        <p className="text-gray-400 text-sm">Analyze your form and join a team.</p>
      </header>

      {/* Analytics Card */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-neon" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Weekly Form</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Last 7 Sessions</span>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#16A34A', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                itemStyle={{ color: '#0F172A' }}
              />
              <Bar dataKey="runs" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Link Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Join Your Squad</h3>
        <div className="bg-neon/5 border border-neon/10 p-6 rounded-3xl flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-neon text-white rounded-2xl flex items-center justify-center">
            <Share2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-ink">Your Locker ID</h4>
            <p className="text-sm text-slate-500">Share this code with teammates to link runs.</p>
          </div>
          <div className="w-full bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <span className="font-mono text-xl tracking-widest text-neon">{user.teamCode}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(user.teamCode)}
              className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md active:bg-neon active:text-white uppercase font-bold"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Match Engine Simulation */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold uppercase text-slate-500">Active Match</h4>
          <span className="bg-red-500 w-2 h-2 rounded-full animate-pulse" />
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-1 text-xl">🏏</div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Your Team</span>
            <div className="text-xl font-black text-ink">{user.points}/0</div>
          </div>
          <div className="text-2xl font-black italic text-slate-200">VS</div>
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-1 text-xl">🛡️</div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Rival Squad</span>
            <div className="text-xl font-black text-ink">0/0</div>
          </div>
        </div>
        <p className="text-[10px] text-center text-slate-400">Match updates every 24 hours based on habit completion rates.</p>
      </div>
    </motion.div>
  );
}

// --- SCREEN: REWARDS ---
function Rewards({ user, setUser }: { user: UserProfile, setUser: (u: UserProfile) => void, key?: string }) {
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = async (reward: typeof REWARDS[0]) => {
    if (user.points < reward.points) return;

    setIsRedeeming(true);
    const code = Math.random().toString(36).substring(2, 12).toUpperCase();

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "darshitkotecha5556@gmail.com", // From user context
          rewardName: reward.name,
          pointsSpent: reward.points,
          couponCode: code
        })
      });
      
      const data = await res.json();
      if (data.success) {
        const updatedUser = {
          ...user,
          points: user.points - reward.points
        };
        setUser(updatedUser);
        saveUser(updatedUser);
        alert(`REDEEMED! ${reward.name} coupon ${code} sent to your email.`);
      }
    } catch (e) {
      console.error(e);
      alert("Redemption service unavailable. Try again later.");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      <header className="sticky top-0 bg-stadium/80 backdrop-blur-xl z-20 pt-6 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter italic">CLUB SHOP</h2>
          <p className="text-gray-400 text-sm">Exchange runs for top-tier gear.</p>
        </div>
        <div className="bg-patch bg-neon text-black px-4 py-2 rounded-xl flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span className="font-mono font-bold">{user.points}</span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {REWARDS.map(r => (
          <div key={r.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
            <div className="aspect-square w-full relative">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md text-[10px] px-2 py-1 rounded-full text-neon border border-neon/30 font-bold">
                {r.type.toUpperCase()}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-sm leading-tight mb-1 text-ink">{r.name}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-2">{r.description}</p>
              </div>
              <button
                disabled={user.points < r.points || isRedeeming}
                onClick={() => handleRedeem(r)}
                className={cn(
                  "w-full py-2 rounded-xl text-xs font-bold transition-all active:scale-95",
                  user.points >= r.points 
                    ? "bg-neon text-white" 
                    : "bg-slate-50 text-slate-300 line-through"
                )}
              >
                {r.points} RUNS
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- NAVIGATION ---
function BottomNav({ currentScreen, setScreen }: { currentScreen: Screen, setScreen: (s: Screen) => void }) {
  const NavItems: { screen: Screen, icon: any, label: string }[] = [
    { screen: 'dashboard', icon: LayoutDashboard, label: 'Nets' },
    { screen: 'teams', icon: Users, label: 'Match' },
    { screen: 'rewards', icon: ShoppingBag, label: 'Shop' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-pitch/80 backdrop-blur-2xl border-t border-white/5 p-2 flex justify-around items-center h-20 z-50">
      {NavItems.map(item => (
        <button
          key={item.screen}
          onClick={() => setScreen(item.screen)}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-2xl transition-all w-20",
            currentScreen === item.screen ? "text-neon" : "text-gray-500 hover:text-gray-300"
          )}
        >
          <item.icon className={cn("w-6 h-6 mb-1", currentScreen === item.screen && "stroke-[2.5]")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          {currentScreen === item.screen && (
            <motion.div layoutId="nav-pill" className="w-1 h-1 rounded-full bg-neon mt-1" />
          )}
        </button>
      ))}
    </nav>
  );
}
