import React from 'react';
import { 
  Wifi, 
  Activity, 
  Search, 
  Zap, 
  AlertTriangle, 
  HelpCircle 
} from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string; 
  icon: React.ReactNode;
  actionType: string; 
  promptData?: string; 
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    label: 'Чому повільний інтернет?',
    icon: <AlertTriangle size={18} color="#eab308" />, // Жовтий колір
    actionType: 'analyze_slow_speed',
    promptData: 'Проаналізуй мої останні спідтести та рівень сигналу. Чому інтернет повільний?'
  },
  {
    id: '2',
    label: 'Знайди найкращий канал',
    icon: <Search size={18} color="#3b82f6" />, // Синій
    actionType: 'find_best_channel',
    promptData: 'Який канал Wi-Fi мені краще обрати, зважаючи на сусідні мережі?'
  },
  {
    id: '3',
    label: 'Проаналізувати якість мережі',
    icon: <Activity size={18} color="#10b981" />, // Зелений
    actionType: 'analyze_health',
    promptData: 'Оціни загальний стан моєї мережі (Health Score).'
  },
  {
    id: '4',
    label: 'Оптимізація для ігор/відео',
    icon: <Zap size={18} color="#8b5cf6" />, // Фіолетовий
    actionType: 'optimize_streaming',
    promptData: 'Що налаштувати для стабільного стрімінгу та ігор?'
  },
  {
    id: '5',
    label: 'Що таке 5 GHz?',
    icon: <Wifi size={18} color="#64748b" />, 
    actionType: 'explain_5ghz',
    promptData: 'Поясни різницю між 2.4 ГГц та 5 ГГц простою мовою.'
  }
];