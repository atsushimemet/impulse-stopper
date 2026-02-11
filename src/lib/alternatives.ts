interface Alternative {
  icon: string;
  title: string;
  description: string;
}

export function getAlternatives(mood: number, fatigue: number): Alternative[] {
  // 疲労が高い場合
  if (fatigue >= 3) {
    return [
      { icon: '🛁', title: '入浴する', description: '温かいお風呂でリラックス' },
      { icon: '🧘', title: 'ストレッチ', description: '5分間の軽いストレッチ' },
      { icon: '😴', title: '仮眠をとる', description: '15分間の短い休憩' },
    ];
  }

  // 気分が低い場合
  if (mood <= 2) {
    return [
      { icon: '🚶', title: '散歩する', description: '10分間外を歩く' },
      { icon: '🎵', title: '音楽を聴く', description: '好きな曲でリフレッシュ' },
      { icon: '☕', title: 'カフェに行く', description: '環境を変えてリラックス' },
    ];
  }

  // 中程度の気分
  if (mood === 3) {
    return [
      { icon: '📖', title: '読書する', description: '少しだけ本を読む' },
      { icon: '🎨', title: '趣味の時間', description: '好きなことを15分' },
      { icon: '💬', title: '友人に連絡', description: '誰かと話してみる' },
    ];
  }

  // 気分が良い場合
  return [
    { icon: '🏃', title: '運動する', description: '軽い運動でさらに気分UP' },
    { icon: '✍️', title: '日記を書く', description: '今の気持ちを記録' },
    { icon: '🎯', title: '目標を見直す', description: '今後の計画を立てる' },
  ];
}
