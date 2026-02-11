import { useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { BottomNav } from './BottomNav';
import { TrendingDown, Clock, Smile, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export function Home() {
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [budget, setBudget] = useState(0);
  const [avoidedCount, setAvoidedCount] = useState(0);
  const [activeTimer, setActiveTimer] = useState<any>(null);

  useEffect(() => {
    const settings = storage.getSettings();
    setBudget(settings.monthlyBudget);

    const expenses = storage.getExpenses();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    
    const monthExpenses = expenses.filter(e => e.timestamp >= monthStart && !e.avoided);
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    setMonthlySpent(total);

    const avoided = expenses.filter(e => e.avoided).length;
    setAvoidedCount(avoided);

    const timer = storage.getActiveTimer();
    setActiveTimer(timer);
  }, []);

  const remaining = budget - monthlySpent;
  const percentage = Math.min((monthlySpent / budget) * 100, 100);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Impulse Stopper</h1>
          <p className="text-zinc-400">買う前に、一呼吸</p>
        </div>

        {/* Active Timer Alert */}
        {activeTimer && (
          <Link 
            to="/timer"
            className="block mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Clock className="text-amber-400" size={24} />
              <div className="flex-1">
                <p className="font-medium text-amber-400">クールダウン中</p>
                <p className="text-sm text-zinc-400">タップして確認</p>
              </div>
            </div>
          </Link>
        )}

        {/* Budget Gauge */}
        <div className="mb-8 p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">今月の自由予算</h2>
            <span className="text-2xl">💰</span>
          </div>
          
          <div className="mb-3">
            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold">
                ¥{remaining.toLocaleString()}
              </p>
              <p className="text-sm text-zinc-400">残り使える金額</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400">¥{monthlySpent.toLocaleString()}</p>
              <p className="text-xs text-zinc-500">/ ¥{budget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-green-400" size={20} />
              <span className="text-sm text-zinc-400">回避成功</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{avoidedCount}</p>
            <p className="text-xs text-zinc-500 mt-1">今月の衝動回避</p>
          </div>

          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Smile className="text-purple-400" size={20} />
              <span className="text-sm text-zinc-400">感情認識</span>
            </div>
            <p className="text-3xl font-bold text-purple-400">{storage.getExpenses().length}</p>
            <p className="text-xs text-zinc-500 mt-1">記録された出費</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm text-zinc-400 mb-3">クイックアクション</h3>
          
          <Link 
            to="/add"
            className="block p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-lg">出費を記録</p>
                <p className="text-sm text-cyan-100">3秒で完了</p>
              </div>
              <span className="text-2xl">📝</span>
            </div>
          </Link>

          <Link 
            to="/stats"
            className="block p-4 bg-zinc-900 border border-zinc-800 rounded-2xl active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">パターンを見る</p>
                <p className="text-sm text-zinc-400">感情と出費の関係</p>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </Link>
        </div>

        {/* Encouragement */}
        <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="flex gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-sm text-zinc-300">今日も記録を続けています</p>
              <p className="text-xs text-zinc-500 mt-1">自分の感情パターンを理解することが第一歩</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
