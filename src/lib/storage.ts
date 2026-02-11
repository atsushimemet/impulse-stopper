export interface Expense {
  id: string;
  amount: number;
  mood: number; // 1-5
  fatigue: number; // 1-3
  category: string;
  timestamp: number;
  avoided?: boolean;
}

export interface TimerEntry {
  id: string;
  amount: number;
  startTime: number;
  endTime: number;
  mood: number;
  fatigue: number;
  category: string;
  completed: boolean;
}

export interface Settings {
  monthlyBudget: number;
  impulseThreshold: number;
  timerDuration: 24 | 48 | 72;
}

const STORAGE_KEYS = {
  EXPENSES: 'impulse_stopper_expenses',
  TIMERS: 'impulse_stopper_timers',
  SETTINGS: 'impulse_stopper_settings',
};

export const storage = {
  getExpenses(): Expense[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  },

  saveExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    expenses.push(expense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getTimers(): TimerEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.TIMERS);
    return data ? JSON.parse(data) : [];
  },

  saveTimer(timer: TimerEntry): void {
    const timers = this.getTimers();
    timers.push(timer);
    localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(timers));
  },

  updateTimer(id: string, updates: Partial<TimerEntry>): void {
    const timers = this.getTimers();
    const index = timers.findIndex(t => t.id === id);
    if (index !== -1) {
      timers[index] = { ...timers[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(timers));
    }
  },

  getSettings(): Settings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      monthlyBudget: 50000,
      impulseThreshold: 5000,
      timerDuration: 24,
    };
  },

  saveSettings(settings: Settings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getActiveTimer(): TimerEntry | null {
    const timers = this.getTimers();
    const active = timers.find(t => !t.completed && t.endTime > Date.now());
    return active || null;
  },
};
