import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { BottomNav } from './BottomNav';
import { DollarSign, Clock, AlertTriangle } from 'lucide-react';

export function Settings() {
  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [impulseThreshold, setImpulseThreshold] = useState(5000);
  const [timerDuration, setTimerDuration] = useState<24 | 48 | 72>(24);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const settings = storage.getSettings();
    setMonthlyBudget(settings.monthlyBudget);
    setImpulseThreshold(settings.impulseThreshold);
    setTimerDuration(settings.timerDuration);
  }, []);

  const handleSave = () => {
    storage.saveSettings({
      monthlyBudget,
      impulseThreshold,
      timerDuration,
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('本当にすべてのデータを削除しますか？この操作は取り消せません。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl mb-2">設定</h1>
          <p className="text-sm text-zinc-400">あなたに合わせてカスタマイズ</p>
        </div>

        {showSaved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="font-medium text-green-400">設定を保存しました</p>
            </div>
          </div>
        )}

        {/* Monthly Budget */}
        <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={20} className="text-cyan-400" />
            <h3 className="text-lg">月次自由予算</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-4">
            毎月自由に使えるお金の目安を設定します
          </p>
          <div className="mb-4">
            <p className="text-4xl font-bold text-center text-cyan-400 mb-4">
              ¥{monthlyBudget.toLocaleString()}
            </p>
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>¥10,000</span>
              <span>¥200,000</span>
            </div>
          </div>
        </div>

        {/* Impulse Threshold */}
        <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-amber-400" />
            <h3 className="text-lg">衝動買い閾値</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-4">
            この金額以上の出費でクールダウンタイマーが起動します
          </p>
          <div className="mb-4">
            <p className="text-4xl font-bold text-center text-amber-400 mb-4">
              ¥{impulseThreshold.toLocaleString()}
            </p>
            <input
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={impulseThreshold}
              onChange={(e) => setImpulseThreshold(Number(e.target.value))}
              className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>¥1,000</span>
              <span>¥30,000</span>
            </div>
          </div>
        </div>

        {/* Timer Duration */}
        <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-purple-400" />
            <h3 className="text-lg">クールダウン時間</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-4">
            衝動を抑えるための待機時間を選択します
          </p>
          <div className="grid grid-cols-3 gap-3">
            {([24, 48, 72] as const).map((hours) => (
              <button
                key={hours}
                onClick={() => setTimerDuration(hours)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  timerDuration === hours
                    ? 'border-purple-400 bg-purple-400/10'
                    : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                <p className="text-2xl font-bold mb-1">{hours}</p>
                <p className="text-xs text-zinc-400">時間</p>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full p-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-medium text-lg shadow-lg shadow-cyan-500/20 mb-4 active:scale-95 transition-transform"
        >
          設定を保存
        </button>

        {/* About Section */}
        <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
          <h3 className="text-lg mb-3">このアプリについて</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Impulse Stopperは、感情と消費の関係を可視化し、衝動買いを減速させるアプリです。
            我慢ではなく、一呼吸おいて考える時間を作ります。
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>🔒</span>
            <span>すべてのデータはあなたのデバイスに保存されます</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl">
          <h3 className="text-lg mb-3 text-red-400">危険な操作</h3>
          <p className="text-sm text-zinc-400 mb-4">
            すべての記録と設定を削除します。この操作は取り消せません。
          </p>
          <button
            onClick={handleReset}
            className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 active:scale-95 transition-transform"
          >
            すべてのデータを削除
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
