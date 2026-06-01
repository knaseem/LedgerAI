'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  DollarSign, 
  ArrowRight,
  TrendingDown,
  XCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell
} from 'recharts';
import { useIntelligenceStore } from '@/lib/store';
import { cashFlowData, saasData } from '@/lib/mockData';

// ── Cash Flow Chart ──────────────────────────────────────────────
function CashFlowChart() {
  return (
    <div className="glass p-6 flex flex-col h-full min-h-[460px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            13-Week Cash Flow Forecast
          </h3>
          <p className="text-xs text-text-muted mt-1">Projected balance based on AP/AR pipeline and recurring spend.</p>
        </div>
      </div>
      
      <div className="h-[320px] w-full mt-auto relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip
              contentStyle={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px' }}
              labelStyle={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
            />
            <Bar dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} name="Cash In" />
            <Bar dataKey="outflow" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} name="Cash Out" />
            <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#050508' }} name="Ending Balance" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Intelligence Alerts ──────────────────────────────────────────
function AlertsPanel() {
  const alerts = useIntelligenceStore(s => s.alerts);
  const dismiss = useIntelligenceStore(s => s.dismissAlert);
  const [investigatingId, setInvestigatingId] = useState<string | null>(null);

  if (alerts.length === 0) {
    return (
      <div className="glass p-6 h-full flex flex-col items-center justify-center text-center">
        <ShieldAlert className="w-10 h-10 text-success/50 mb-3" />
        <h3 className="text-sm font-semibold text-text-primary">No Active Alerts</h3>
        <p className="text-xs text-text-muted mt-1">LedgerAI has found no anomalies or leakage.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 flex flex-col h-full min-h-[460px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Leakage Prevention
        </h3>
        <span className="pill pill-warning">{alerts.length} Alerts</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {alerts.map((alert, i) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-flat p-4 border-l-2 ${
              alert.severity === 'high' ? 'border-error' : 
              alert.severity === 'medium' ? 'border-warning' : 'border-info'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-text-primary">{alert.title}</p>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{alert.description}</p>
              </div>
              {alert.impactAmount > 0 && (
                <div className="ml-4 text-right flex-shrink-0">
                  <p className="text-xs text-text-muted">Impact</p>
                  <p className="text-sm font-bold font-mono text-error">
                    ${alert.impactAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <button 
                onClick={() => setInvestigatingId(investigatingId === alert.id ? null : alert.id)}
                className="btn-primary btn-sm flex-1"
              >
                {investigatingId === alert.id ? 'Close Investigation' : 'Investigate'}
              </button>
              <button onClick={() => dismiss(alert.id)} className="btn-ghost btn-sm">Dismiss</button>
            </div>

            {investigatingId === alert.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-surface/50 border border-border/50 rounded-lg text-xs text-text-secondary overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-2 text-text-primary font-semibold">
                  <ShieldAlert className="w-3 h-3 text-accent" />
                  AI Investigation Trace
                </div>
                <ul className="list-disc pl-4 space-y-1 mb-3">
                  {alert.type === 'duplicate' && <li>Cross-referenced AP inbox with Expensify API. Exact amount and date match found for user J. Smith.</li>}
                  {alert.type === 'price_variance' && <li>Scraped AWS billing dashboard. Usage (compute hours) is flat, but unit price per hour increased without notification.</li>}
                  {alert.type === 'fraud' && <li>Analyzed receipt coordinates. Location: Las Vegas. Correlated with Outlook Calendar: No events scheduled.</li>}
                  {alert.type === 'tax_nexus' && <li>Analyzed trailing 12-month sales data via Stripe API. Texas sales: $485,000. Threshold: $500,000.</li>}
                </ul>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      dismiss(alert.id);
                      setInvestigatingId(null);
                    }}
                    className="btn-ghost btn-sm text-error hover:bg-error/10 hover:text-error"
                  >
                    Block & Resolve
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── SaaS Sprawl ──────────────────────────────────────────────────
function SaaSSprawlMatrix() {
  const totalSavings = saasData.reduce((acc, curr) => acc + curr.potentialSavings, 0);

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-accent" />
            SaaS Sprawl & Utilization
          </h3>
          <p className="text-xs text-text-muted mt-1">Identifying unused software licenses across the organization.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Potential Savings</p>
          <p className="text-xl font-bold text-success font-mono">${totalSavings.toLocaleString()}/mo</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-3 text-xs font-semibold text-text-muted border-b border-border">Vendor</th>
              <th className="pb-3 text-xs font-semibold text-text-muted border-b border-border">Category</th>
              <th className="pb-3 text-xs font-semibold text-text-muted border-b border-border">Monthly Cost</th>
              <th className="pb-3 text-xs font-semibold text-text-muted border-b border-border">Utilization</th>
              <th className="pb-3 text-xs font-semibold text-text-muted border-b border-border text-right">Potential Savings</th>
            </tr>
          </thead>
          <tbody>
            {saasData.map((item, i) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/50 hover:bg-surface-hover transition-colors"
              >
                <td className="py-3 text-sm font-medium">{item.vendor}</td>
                <td className="py-3 text-xs text-text-muted">{item.category}</td>
                <td className="py-3 text-sm font-mono">${item.monthlyCost.toLocaleString()}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className={`h-full rounded-full ${
                          item.utilization < 50 ? 'bg-error' : item.utilization < 80 ? 'bg-warning' : 'bg-success'
                        }`} 
                        style={{ width: `${item.utilization}%` }} 
                      />
                    </div>
                    <span className="text-xs font-mono">{item.utilization}%</span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">{item.activeUsers} of {item.totalLicenses} users active</p>
                </td>
                <td className="py-3 text-sm font-mono text-right text-success font-medium">
                  ${item.potentialSavings.toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Auto-Negotiation (HITL) ──────────────────────────────────────
function AutoNegotiationPanel() {
  const opportunities = useIntelligenceStore(s => s.negotiationOpportunities);
  const approve = useIntelligenceStore(s => s.approveNegotiation);
  const reject = useIntelligenceStore(s => s.rejectNegotiation);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingCount = opportunities.filter(o => o.status === 'pending_approval').length;

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            Vendor Auto-Negotiation
          </h3>
          <p className="text-xs text-text-muted mt-1">AI-identified opportunities to reduce spend via automated vendor negotiation.</p>
        </div>
        <div className="text-right">
          {pendingCount > 0 && <span className="pill pill-warning">{pendingCount} Action Required</span>}
        </div>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp, i) => {
          if (opp.status !== 'pending_approval') return null;
          const isExpanded = expandedId === opp.id;

          return (
            <motion.div 
              key={opp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-flat p-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">{opp.vendor}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <span className="text-[10px] text-text-muted">Current Rate</span>
                      <p className="text-xs font-mono text-error font-medium">{opp.currentRate}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-text-muted" />
                    <div>
                      <span className="text-[10px] text-text-muted">Market Benchmark</span>
                      <p className="text-xs font-mono text-success font-medium">{opp.marketRate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-left sm:text-right w-full sm:w-auto">
                   <div className="flex items-center justify-start sm:justify-end gap-2 mb-2">
                     <span className="text-[10px] text-text-muted">AI Confidence:</span>
                     <span className="text-xs font-mono text-success">{opp.confidence}%</span>
                   </div>
                   <button 
                     onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                     className="btn-ghost btn-sm w-full sm:w-auto"
                   >
                     {isExpanded ? 'Hide Draft' : 'Review Draft Email'}
                   </button>
                </div>
              </div>

              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-border/50"
                >
                  <p className="text-xs text-text-muted mb-2 font-medium">AI Strategy: <span className="text-text-primary">{opp.suggestedAction}</span></p>
                  <div className="bg-surface/50 p-4 rounded-lg border border-border/50 mb-4">
                    <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
                      {opp.draftEmail}
                    </pre>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => { reject(opp.id); setExpandedId(null); }}
                      className="btn-ghost text-error hover:bg-error/10 hover:text-error"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => { approve(opp.id); setExpandedId(null); }}
                      className="btn-primary"
                    >
                      Approve & Send
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {pendingCount === 0 && (
          <div className="text-center py-8">
             <DollarSign className="w-8 h-8 text-success/50 mx-auto mb-3" />
             <p className="text-sm font-medium text-text-primary">All caught up!</p>
             <p className="text-xs text-text-muted mt-1">No pending negotiation opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function IntelligencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Spend Intelligence</h1>
        <p className="text-sm text-text-muted mt-1">Optimize cash flow, prevent leakage, and identify cost savings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AutoNegotiationPanel />
        <SaaSSprawlMatrix />
      </div>
    </div>
  );
}
