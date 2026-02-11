import { useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { getAlternatives } from '../lib/alternatives';
import { BottomNav } from './BottomNav';
import { useNavigate, useLocation } from 'react-router';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export function Timer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTimer, setActiveTimer] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [alternatives, setAlternatives] = useState<any[]>([]);

  useEffect(() => {
    const timer = storage.getActiveTimer();
    
    if (!timer && location.state) {
      // Create new timer from state
      const { amount, mood, fatigue, category } = location.state;
      const settings = storage.getSettings();
      const duration = settings.timerDuration * 60 * 60 * 1000; // hours to ms
      
      const newTimer = {
        id: Date.now().toString(),
        amount,
        mood,
        fatigue,
        category,
        startTime: Date.now(),
        endTime: Date.now() + duration,
        completed: false,
      };
      
      storage.saveTimer(newTimer);
      setActiveTimer(newTimer);
      setAlternatives(getAlternatives(mood, fatigue));
    } else if (timer) {
      setActiveTimer(timer);
      setAlternatives(getAlternatives(timer.mood, timer.fatigue));
    }
  }, [location.state]);

  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      const remaining = activeTimer.endTime - Date.now();
      if (remaining <= 0) {
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleComplete = (avoided: boolean) => {
    if (!activeTimer) return;

    storage.updateTimer(activeTimer.id, { completed: true });

    const expense = {
      id: Date.now().toString(),
      amount: activeTimer.amount,
      mood: activeTimer.mood,
      fatigue: activeTimer.fatigue,
      category: activeTimer.category,
      timestamp: Date.now(),
      avoided,
    };
    storage.saveExpense(expense);

    navigate('/');
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}時間 ${minutes}分`;
  };

  if (!activeTimer) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pb-20">
        <div className="max-w-md mx-auto p-6">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Clock size={64} className="text-zinc-600 mb-4" />
            <p className="text-xl text-zinc-400">アクティブなタイマーはありません</p>
            <button
              onClick={() => navigate('/add')}
              className="mt-6 px-6 py-3 bg-cyan-500 rounded-xl"
            >
              出費を記録する
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const progress = timeRemaining > 0 
    ? ((activeTimer.endTime - activeTimer.startTime - timeRemaining) / (activeTimer.endTime - activeTimer.startTime)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl mb-2">クールダウン中</h1>
          <p className="text-sm text-zinc-400">一呼吸おいて、考える時間</p>
        </div>

        {/* Timer Display */}
        <div className="mb-8 p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⏱️</div>
            <p className="text-4xl font-bold text-amber-400 mb-2">
              {timeRemaining > 0 ? formatTime(timeRemaining) : '完了！'}
            </p>
            <p className="text-sm text-zinc-400">
              {timeRemaining > 0 ? '残り時間' : 'クールダウン完了しました'}
            </p>
          </div>

          <div className="mb-4">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">金額</span>
              <span className="text-xl font-bold">¥{activeTimer.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">その時の気分</span>
              <span className="text-lg">
                {['😢', '😟', '😐', '🙂', '😊'][activeTimer.mood - 1]}
              </span>
            </div>
          </div>
        </div>

        {/* Self Comparison */}
        <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
          <h3 className="text-lg mb-4">今の自分 vs 未来の自分</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-400 mb-1">購入前の気持ち</p>
              <p className="text-cyan-400">「これがあれば満たされるかも」</p>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <p className="text-sm text-zinc-400 mb-1">購入後の可能性</p>
              <p className="text-amber-400">「本当に必要だったかな...」</p>
            </div>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="mb-8">
          <h3 className="text-lg mb-4">代わりにできること</h3>
          <div className="space-y-3">
            {alternatives.map((alt, index) => (
              <div 
                key={index}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{alt.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{alt.title}</p>
                    <p className="text-sm text-zinc-400">{alt.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleComplete(true)}
            className="w-full p-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl font-medium text-lg shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle size={24} />
            購入を見送った
          </button>

          <button
            onClick={() => handleComplete(false)}
            className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl font-medium text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <XCircle size={24} />
            やっぱり購入した
          </button>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-4">
          どちらを選んでも大丈夫。記録することが大切です
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
