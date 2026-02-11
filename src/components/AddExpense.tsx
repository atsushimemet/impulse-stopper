import { useState } from "react";
import { storage } from "../lib/storage";
import { BottomNav } from "./BottomNav";
import { useNavigate } from "react-router";
import {
  Smile,
  Meh,
  Frown,
  Battery,
  BatteryMedium,
  BatteryLow,
} from "lucide-react";

export function AddExpense() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(5000);
  const [mood, setMood] = useState(3);
  const [fatigue, setFatigue] = useState(2);
  const [category, setCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { id: "food", label: "食事", emoji: "🍔" },
    { id: "shopping", label: "日用品", emoji: "🛍️" },
    { id: "entertainment", label: "娯楽", emoji: "🎮" },
    { id: "fashion", label: "ファッション", emoji: "👔" },
    { id: "beauty", label: "美容", emoji: "💄" },
    { id: "other", label: "その他", emoji: "📦" },
  ];

  const handleSubmit = () => {
    const settings = storage.getSettings();

    // Check if amount exceeds threshold
    if (amount >= settings.impulseThreshold) {
      // Navigate to timer
      navigate("/timer", {
        state: {
          amount,
          mood,
          fatigue,
          category,
        },
      });
      return;
    }

    // Save expense directly
    const expense = {
      id: Date.now().toString(),
      amount,
      mood,
      fatigue,
      category,
      timestamp: Date.now(),
    };
    storage.saveExpense(expense);

    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const moodEmojis = ["😢", "😟", "😐", "🙂", "😊"];
  const moodLabels = ["とても悪い", "悪い", "普通", "良い", "とても良い"];

  const fatigueIcons = [Battery, BatteryMedium, BatteryLow];
  const fatigueLabels = ["元気", "やや疲れ", "とても疲れ"];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl mb-2">出費を記録</h1>
          <p className="text-sm text-zinc-400">
            3秒で完了。感情を記録しましょう
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium text-green-400">記録完了</p>
                <p className="text-sm text-zinc-400">パターンを分析中...</p>
              </div>
            </div>
          </div>
        )}

        {/* Amount Slider */}
        <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
          <label className="block text-sm text-zinc-400 mb-4">金額</label>
          <div className="mb-4">
            <p className="text-5xl font-bold text-center text-cyan-400">
              ¥{amount.toLocaleString()}
            </p>
          </div>
          <input
            type="range"
            min="100"
            max="50000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-2">
            <span>¥100</span>
            <span>¥50,000</span>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="mb-8">
          <label className="block text-sm text-zinc-400 mb-4">今の気分</label>
          <div className="flex justify-between gap-2">
            {moodEmojis.map((emoji, index) => {
              const moodValue = index + 1;
              return (
                <button
                  key={moodValue}
                  onClick={() => setMood(moodValue)}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                    mood === moodValue
                      ? "border-cyan-400 bg-cyan-400/10 scale-110"
                      : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <div className="text-3xl mb-1">{emoji}</div>
                  <div className="text-xs text-zinc-400">
                    {moodLabels[index]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fatigue Selection */}
        <div className="mb-8">
          <label className="block text-sm text-zinc-400 mb-4">疲労度</label>
          <div className="flex gap-3">
            {fatigueLabels.map((label, index) => {
              const fatigueValue = index + 1;
              const Icon = fatigueIcons[index];
              return (
                <button
                  key={fatigueValue}
                  onClick={() => setFatigue(fatigueValue)}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                    fatigue === fatigueValue
                      ? "border-purple-400 bg-purple-400/10"
                      : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <Icon
                    size={32}
                    className={`mx-auto mb-2 ${
                      fatigue === fatigueValue
                        ? "text-purple-400"
                        : "text-zinc-400"
                    }`}
                  />
                  <div className="text-xs text-zinc-400">{label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <label className="block text-sm text-zinc-400 mb-4">カテゴリ</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  category === cat.id
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <div className="text-3xl mb-1">{cat.emoji}</div>
                <div className="text-xs text-zinc-400">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!category}
          className="w-full p-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-medium text-lg shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          記録する
        </button>

        <p className="text-center text-xs text-zinc-500 mt-4">
          {amount >= storage.getSettings().impulseThreshold
            ? "⏱️ この金額はクールダウン推奨です"
            : "✨ すぐに記録されます"}
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
