import { useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { BottomNav } from './BottomNav';
import { TrendingDown, Calendar, Heart } from 'lucide-react';

export function Stats() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [moodAverage, setMoodAverage] = useState(0);
  const [fatigueAverage, setFatigueAverage] = useState(0);
  const [heatmapData, setHeatmapData] = useState<number[]>([]);

  useEffect(() => {
    const allExpenses = storage.getExpenses();
    setExpenses(allExpenses);

    if (allExpenses.length > 0) {
      const avgMood = allExpenses.reduce((sum, e) => sum + e.mood, 0) / allExpenses.length;
      const avgFatigue = allExpenses.reduce((sum, e) => sum + e.fatigue, 0) / allExpenses.length;
      setMoodAverage(avgMood);
      setFatigueAverage(avgFatigue);

      // Calculate day of week heatmap (0 = Sunday, 6 = Saturday)
      const dayCount = new Array(7).fill(0);
      allExpenses.forEach(e => {
        const day = new Date(e.timestamp).getDay();
        dayCount[day]++;
      });
      setHeatmapData(dayCount);
    }
  }, []);

  const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
  const maxCount = Math.max(...heatmapData, 1);

  const moodEmojis = ['😢', '😟', '😐', '🙂', '😊'];
  const categories = {
    food: { label: '食事', emoji: '🍔' },
    shopping: { label: '買い物', emoji: '🛍️' },
    entertainment: { label: '娯楽', emoji: '🎮' },
    fashion: { label: 'ファッション', emoji: '👔' },
    beauty: { label: '美容', emoji: '💄' },
    other: { label: 'その他', emoji: '📦' },
  };

  const getCategoryStats = () => {
    const stats: any = {};
    expenses.forEach(e => {
      if (!stats[e.category]) {
        stats[e.category] = { count: 0, total: 0 };
      }
      stats[e.category].count++;
      stats[e.category].total += e.amount;
    });
    return Object.entries(stats).sort((a: any, b: any) => b[1].total - a[1].total);
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl mb-2">統計とパターン</h1>
          <p className="text-sm text-zinc-400">感情と出費の関係を理解する</p>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl text-zinc-400 mb-2">まだデータがありません</p>
            <p className="text-sm text-zinc-500">出費を記録すると、パターンが見えてきます</p>
          </div>
        ) : (
          <>
            {/* Average Mood & Fatigue */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={20} className="text-purple-400" />
                  <span className="text-sm text-zinc-400">平均気分</span>
                </div>
                <div className="text-4xl mb-2">{moodEmojis[Math.round(moodAverage) - 1]}</div>
                <p className="text-sm text-zinc-400">
                  {moodAverage.toFixed(1)} / 5.0
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown size={20} className="text-amber-400" />
                  <span className="text-sm text-zinc-400">平均疲労</span>
                </div>
                <div className="text-4xl mb-2">
                  {fatigueAverage <= 1.5 ? '⚡' : fatigueAverage <= 2.5 ? '🔋' : '🪫'}
                </div>
                <p className="text-sm text-zinc-400">
                  {fatigueAverage.toFixed(1)} / 3.0
                </p>
              </div>
            </div>

            {/* Day of Week Heatmap */}
            <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-cyan-400" />
                <h3 className="text-lg">曜日別の傾向</h3>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {dayLabels.map((day, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="aspect-square rounded-lg mb-1 flex items-center justify-center"
                      style={{
                        backgroundColor: heatmapData[index] > 0 
                          ? `rgba(34, 211, 238, ${(heatmapData[index] / maxCount) * 0.8})`
                          : 'rgba(39, 39, 42, 0.5)'
                      }}
                    >
                      <span className="text-xs font-medium">{heatmapData[index]}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{day}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-4">
                {heatmapData.indexOf(Math.max(...heatmapData)) >= 0 && (
                  `${dayLabels[heatmapData.indexOf(Math.max(...heatmapData))]}曜日に出費が多い傾向`
                )}
              </p>
            </div>

            {/* Category Breakdown */}
            <div className="mb-8">
              <h3 className="text-lg mb-4">カテゴリ別の内訳</h3>
              <div className="space-y-3">
                {categoryStats.map(([cat, data]: any) => {
                  const catInfo = categories[cat as keyof typeof categories] || categories.other;
                  return (
                    <div 
                      key={cat}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{catInfo.emoji}</span>
                          <span>{catInfo.label}</span>
                        </div>
                        <span className="font-bold">¥{data.total.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>{data.count}回</span>
                        <span>平均 ¥{Math.round(data.total / data.count).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl">
              <h3 className="text-lg mb-4">💡 インサイト</h3>
              <div className="space-y-3 text-sm">
                {fatigueAverage >= 2.5 && (
                  <p className="text-cyan-200">
                    疲労度が高い時に出費する傾向があります。十分な休息を心がけましょう。
                  </p>
                )}
                {moodAverage <= 2.5 && (
                  <p className="text-cyan-200">
                    気分が低い時の出費が多いようです。気分転換の方法を見つけると良いかもしれません。
                  </p>
                )}
                {heatmapData[5] > heatmapData[1] && (
                  <p className="text-cyan-200">
                    金曜日の出費が多い傾向です。週末前のストレス発散パターンかもしれません。
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
