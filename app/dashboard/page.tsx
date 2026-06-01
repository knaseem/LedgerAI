'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  FileText,
  TrendingUp,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import { useWorkflowStore } from '@/lib/store';
import { recentActivity, cashFlowData } from '@/lib/mockData';

// ── Animated Stat Counter ────────────────────────────────────────
function StatCounter({
  label,
  end,
  suffix = '',
  prefix = '',
  icon: Icon,
  delay = 0,
}: {
  label: string;
  end: number;
  suffix?: string;
  prefix?: string;
  icon: React.ElementType;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      let start = 0;
      const dur = 1.5;
      const inc = end / (dur * 60);
      const timer = setInterval(() => {
        start += inc;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start * 10) / 10);
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [started, end, delay]);

  return (
    <motion.div
      ref={ref}
      className="glass p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <div className="text-4xl font-bold text-text-primary tabular-nums">
        {prefix}
        {typeof count === 'number' && count % 1 !== 0 ? count.toFixed(1) : count}
        {suffix}
      </div>
    </motion.div>
  );
}

// ── Workflow Card ────────────────────────────────────────────────
function WorkflowCard({
  name,
  status,
  lastRun,
  recordsProcessed,
  accuracy,
  sparkData,
  delay,
}: {
  name: string;
  status: 'running' | 'paused' | 'exception';
  lastRun: string;
  recordsProcessed: number;
  accuracy: number;
  sparkData: number[];
  delay: number;
}) {
  const statusConfig = {
    running: { class: 'pill-success', label: 'Running' },
    paused: { class: 'pill-neutral', label: 'Paused' },
    exception: { class: 'pill-warning', label: 'Exception' },
  };
  const st = statusConfig[status];
  const chartData = sparkData.map((v, i) => ({ x: i, y: v }));

  return (
    <motion.div
      className="glass p-6 hover:border-accent/20 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{name}</h3>
        <div className={`pill ${st.class}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-success' : status === 'exception' ? 'bg-warning' : 'bg-muted'}`} />
          {st.label}
        </div>
      </div>

      <div className="h-12 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="y"
              stroke="#6366f1"
              strokeWidth={2}
              fill={`url(#grad-${name})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-text-muted">Last Run</p>
          <p className="text-sm font-medium text-text-secondary mt-0.5">{lastRun}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Records</p>
          <p className="text-sm font-medium text-text-secondary mt-0.5">{recordsProcessed.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Accuracy</p>
          <p className="text-sm font-medium text-text-secondary mt-0.5">{accuracy}%</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Activity Icon ────────────────────────────────────────────────
function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-error" />;
    default:
      return <Info className="w-4 h-4 text-accent" />;
  }
}

// ── Cash Flow Forecast Component ───────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-xl border border-border p-4 rounded-xl shadow-xl min-w-[200px]">
        <p className="font-bold mb-3 border-b border-border/50 pb-2">{label}</p>
        <div className="space-y-1.5 mb-3">
          <p className="text-sm flex justify-between gap-4">
            <span className="text-text-muted">Inflow:</span> 
            <span className="text-success font-mono font-medium">${data.inflow.toLocaleString()}</span>
          </p>
          <p className="text-sm flex justify-between gap-4">
            <span className="text-text-muted">Outflow:</span> 
            <span className="text-error font-mono font-medium">-${data.outflow.toLocaleString()}</span>
          </p>
          <p className="text-sm flex justify-between gap-4 pt-1.5 border-t border-border/50">
            <span className="text-text-primary font-medium">Balance:</span> 
            <span className="text-accent font-mono font-bold">${data.balance.toLocaleString()}</span>
          </p>
        </div>
        {data.note && (
          <div className="mt-3 bg-accent/10 border border-accent/20 p-2.5 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-accent font-medium leading-relaxed">{data.note}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
}

function CashFlowChart() {
  return (
    <motion.div
      className="glass p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Cash Flow Forecast
          </h2>
          <p className="text-sm text-text-muted mt-1">AI-driven predictive liquidity modeling based on AP & AR data.</p>
        </div>
        <div className="pill pill-info">
          13-Week Projection
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            <Bar dataKey="inflow" name="Inflow" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Line type="monotone" dataKey="balance" name="Ending Balance" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#0f0f19' }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ── Dashboard Home Page ──────────────────────────────────────────
export default function DashboardPage() {
  const workflows = useWorkflowStore((s) => s.workflows);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold">Workflow Overview</h1>
        <p className="text-sm text-text-muted mt-1">
          Monitor your autonomous finance agents in real-time.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCounter
          label="Total Invoices Processed"
          end={1247}
          icon={FileText}
          delay={0}
        />
        <StatCounter
          label="Average Accuracy"
          end={96.8}
          suffix="%"
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCounter
          label="Close Time Saved"
          end={4}
          suffix=" days"
          icon={Clock}
          delay={0.2}
        />
      </div>

      {/* Cash Flow Forecast Chart */}
      <CashFlowChart />

      {/* Workflow Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Active Workflows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workflows.map((wf, i) => (
            <WorkflowCard
              key={wf.id}
              name={wf.name}
              status={wf.status}
              lastRun={wf.lastRun}
              recordsProcessed={wf.recordsProcessed}
              accuracy={wf.accuracy}
              sparkData={wf.sparkData}
              delay={0.1 + i * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {recentActivity.map((item, i) => (
            <motion.div
              key={item.id}
              className="glass-flat glass-flat-hover px-5 py-3.5 flex items-center gap-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
            >
              <ActivityIcon type={item.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{item.message}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.agent}</p>
              </div>
              <span className="text-xs text-text-muted whitespace-nowrap">{item.timestamp}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
