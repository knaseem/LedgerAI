'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Eye,
  X,
  Bot,
  TrendingDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { type CloseTask } from '@/lib/mockData';
import { useCloseStore } from '@/lib/store';

// ── Reasoning Modal ──────────────────────────────────────────────
function ReasoningModal({ task, onClose }: { task: CloseTask; onClose: () => void }) {
  const signOffTask = useCloseStore(s => s.signOffTask);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        className="glass relative w-full max-w-lg p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Bot className="w-5 h-5 text-accent" />
            {task.name}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        <div className="glass-flat p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Agent: <span className="text-text-primary font-medium">{task.agent}</span></span>
            <span className="text-text-muted text-xs">{task.lastUpdated}</span>
          </div>
        </div>

        <div className="glass-flat p-4 border-l-2 border-accent">
          <p className="text-[10px] uppercase tracking-wider text-accent mb-2">LedgerAI Reasoning</p>
          <p className="text-sm text-text-secondary leading-relaxed font-mono whitespace-pre-wrap">
            {task.reasoning}
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          {task.status === 'complete' && (
             <button 
               onClick={() => { signOffTask(task.id); onClose(); }} 
               className="btn-primary flex-1 bg-success hover:bg-success/80"
             >
               <CheckCircle2 className="w-4 h-4" />
               Sign-Off & Certify
             </button>
          )}
          <button onClick={onClose} className="btn-ghost flex-1">Close</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Close Time Chart ─────────────────────────────────────────────
const closeTimeData = [
  { label: 'Before LedgerAI', days: 5, fill: '#64748b' },
  { label: 'With LedgerAI', days: 1, fill: '#6366f1' },
];

function CloseTimeChart() {
  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-accent" />
        Close Time Reduction
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={closeTimeData} layout="vertical" barCategoryGap={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" domain={[0, 6]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} unit=" days" />
            <YAxis type="category" dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15,15,25,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontSize: 12,
                color: '#f1f5f9',
              }}
              formatter={(value) => [`${value} days`, 'Close Time']}
            />
            <Bar dataKey="days" radius={[0, 8, 8, 0]} barSize={32}>
              {closeTimeData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Financial Close Page ─────────────────────────────────────────
export default function FinancialClosePage() {
  const [selectedTask, setSelectedTask] = useState<CloseTask | null>(null);
  const closeTasks = useCloseStore(s => s.tasks);

  const completedCount = closeTasks.filter((t) => t.status === 'complete' || t.status === 'certified').length;
  const totalCount = closeTasks.length;
  const progressPct = (completedCount / totalCount) * 100;

  const statusConfig: Record<CloseTask['status'], { class: string; icon: React.ElementType; label: string }> = {
    certified: { class: 'pill-success', icon: CheckCircle2, label: 'Certified' },
    complete: { class: 'pill-info', icon: CheckCircle2, label: 'Awaiting Sign-Off' },
    'in-progress': { class: 'pill-warning', icon: Loader2, label: 'In Progress' },
    pending: { class: 'pill-neutral', icon: Clock, label: 'Pending' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Financial Close</h1>
        <p className="text-sm text-text-muted mt-1">Track automated close tasks and compliance checks.</p>
      </div>

      {/* Progress Tracker */}
      <motion.div
        className="glass p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-accent" />
            Close Progress
          </h3>
          <span className="text-sm font-medium">
            <span className="text-accent">{completedCount}</span>
            <span className="text-text-muted"> of {totalCount} tasks complete</span>
          </span>
        </div>

        <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-violet rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-text-muted">
          <span>{Math.round(progressPct)}% complete</span>
          <span>Target: May 31, 2026</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-2">
          {closeTasks.map((task, i) => {
            const sc = statusConfig[task.status];
            const Icon = sc.icon;
            return (
              <motion.div
                key={task.id}
                className="glass-flat glass-flat-hover p-4 flex items-center gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  task.status === 'certified' ? 'bg-success/15' :
                  task.status === 'complete' ? 'bg-info/15' :
                  task.status === 'in-progress' ? 'bg-warning/15' :
                  'bg-surface'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    task.status === 'certified' ? 'text-success' :
                    task.status === 'complete' ? 'text-info' :
                    task.status === 'in-progress' ? 'text-warning animate-spin' :
                    'text-text-muted'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{task.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {task.agent} · Last updated {task.lastUpdated}
                  </p>
                </div>

                <div className={`pill ${sc.class}`}>
                  {sc.label}
                </div>

                <button
                  onClick={() => setSelectedTask(task)}
                  className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                  title="View Reasoning"
                >
                  <Eye className="w-4 h-4 text-text-muted hover:text-accent" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Close Time Chart */}
        <div>
          <CloseTimeChart />
        </div>
      </div>

      {/* Reasoning Modal */}
      {selectedTask && (
        <ReasoningModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
