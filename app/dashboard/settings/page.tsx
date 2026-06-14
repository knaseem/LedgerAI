'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Fingerprint,
  Clock,
  History,
  ArrowUpDown,
  Settings,
  Eye,
  ChevronRight,
  LogIn,
  LogOut,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import {
  type Role,
  type TeamMember,
  roleLabels,
  roleColors,
  permissions,
  permissionMatrix,
  hasPermission,
  mockTeam,
  sodRules,
  approvalThresholds,
  mockSessionLogs,
  type SessionLog,
} from '@/lib/rbac';

// ── Team Member Row ─────────────────────────────────────────────
function TeamMemberRow({ member, delay }: { member: TeamMember; delay: number }) {
  const rc = roleColors[member.role];

  return (
    <motion.div
      className="glass-flat glass-flat-hover p-4 flex items-center gap-4"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className={`w-10 h-10 rounded-xl ${rc.bg} flex items-center justify-center text-sm font-bold ${rc.text}`}>
        {member.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text-primary">{member.name}</p>
          {member.twoFactorEnabled && (
            <span title="2FA Enabled">
              <Fingerprint className="w-3.5 h-3.5 text-success" />
            </span>
          )}
        </div>
        <p className="text-xs text-text-muted">{member.email} · {member.department}</p>
      </div>
      <div className={`pill ${rc.pill}`}>
        <Shield className="w-3 h-3" />
        {roleLabels[member.role]}
      </div>
      <div className="text-right min-w-[80px]">
        <p className="text-[10px] text-text-muted">Last Active</p>
        <p className="text-xs text-text-secondary">{member.lastActive}</p>
      </div>
    </motion.div>
  );
}

// ── Permission Matrix ───────────────────────────────────────────
function PermissionMatrixTable() {
  const roles: Role[] = ['viewer', 'analyst', 'approver', 'admin', 'owner'];
  const categories = ['data', 'financial', 'workflow', 'audit', 'admin'] as const;

  return (
    <div className="glass p-6 overflow-x-auto">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Lock className="w-4 h-4 text-accent" />
        Permission Matrix
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 text-xs font-semibold text-text-muted w-[200px]">Permission</th>
            {roles.map((role) => (
              <th key={role} className="pb-3 text-center">
                <span className={`pill ${roleColors[role].pill} text-[10px]`}>{roleLabels[role]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <>
              <tr key={`cat-${cat}`}>
                <td colSpan={roles.length + 1} className="pt-4 pb-2">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">{cat}</span>
                </td>
              </tr>
              {permissions
                .filter((p) => p.category === cat)
                .map((perm) => (
                  <tr key={perm.key} className="border-b border-border/30 hover:bg-surface-hover/50 transition-colors">
                    <td className="py-2.5">
                      <p className="text-xs font-medium text-text-primary">{perm.label}</p>
                      <p className="text-[10px] text-text-muted">{perm.description}</p>
                    </td>
                    {roles.map((role) => (
                      <td key={role} className="py-2.5 text-center">
                        {hasPermission(role, perm.key) ? (
                          <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-text-muted/20 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Separation of Duties ────────────────────────────────────────
function SoDPanel() {
  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-warning" />
        Separation of Duties (SoD)
      </h3>
      <div className="space-y-3">
        {sodRules.map((rule, i) => (
          <motion.div
            key={i}
            className="glass-flat p-4 border-l-2 border-warning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xs font-semibold text-text-primary">Enforced</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{rule.description}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] px-2 py-1 rounded bg-surface border border-border/50 text-text-muted font-mono">
                {permissions.find(p => p.key === rule.action1)?.label}
              </span>
              <span className="text-[10px] text-text-muted self-center">≠</span>
              <span className="text-[10px] px-2 py-1 rounded bg-surface border border-border/50 text-text-muted font-mono">
                {permissions.find(p => p.key === rule.action2)?.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Approval Thresholds ─────────────────────────────────────────
function ApprovalThresholdsPanel() {
  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-accent" />
        Approval Thresholds
      </h3>
      <div className="space-y-2">
        {approvalThresholds.map((t, i) => (
          <motion.div
            key={i}
            className="glass-flat p-3 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                i === 0 ? 'bg-success/10' : i === 1 ? 'bg-info/10' : i === 2 ? 'bg-warning/10' : 'bg-error/10'
              }`}>
                <span className={`text-xs font-bold ${
                  i === 0 ? 'text-success' : i === 1 ? 'text-info' : i === 2 ? 'text-warning' : 'text-error'
                }`}>
                  {i === 0 ? 'A' : i === 1 ? '1' : i === 2 ? '2' : '2+'}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-text-primary">
                  {t.maxAmount === Infinity ? '> $50,000' : t.maxAmount === 1000 ? '< $1,000' : `$${(approvalThresholds[i-1]?.maxAmount || 0).toLocaleString()} – $${t.maxAmount.toLocaleString()}`}
                </p>
                <p className="text-[10px] text-text-muted">{t.label}</p>
              </div>
            </div>
            <div className={`pill ${roleColors[t.requiredRole].pill} text-[10px]`}>
              {roleLabels[t.requiredRole]}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Session Log ─────────────────────────────────────────────────
function SessionLogPanel() {
  const actionIcons: Record<SessionLog['action'], React.ElementType> = {
    login: LogIn,
    logout: LogOut,
    failed_login: XCircle,
    password_change: KeyRound,
    role_change: Shield,
    '2fa_enabled': Fingerprint,
  };

  const actionLabels: Record<SessionLog['action'], string> = {
    login: 'Login',
    logout: 'Logout',
    failed_login: 'Failed Login',
    password_change: 'Password Change',
    role_change: 'Role Change',
    '2fa_enabled': '2FA Enabled',
  };

  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <History className="w-4 h-4 text-accent" />
        Session & Access Log
      </h3>
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
        {mockSessionLogs.map((log, i) => {
          const Icon = actionIcons[log.action];
          return (
            <motion.div
              key={log.id}
              className="glass-flat p-3 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                log.success ? 'bg-success/10' : 'bg-error/10'
              }`}>
                <Icon className={`w-3.5 h-3.5 ${log.success ? 'text-success' : 'text-error'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary truncate">
                  <span className="font-medium">{log.userName}</span>
                  {' · '}
                  <span className="text-text-secondary">{actionLabels[log.action]}</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-text-muted">
                  <span className="font-mono">{log.ip}</span>
                  <span>·</span>
                  <span>{log.device}</span>
                  {log.detail && <span className="text-warning">· {log.detail}</span>}
                </div>
              </div>
              <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">{log.timestamp}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [tab, setTab] = useState<'team' | 'permissions' | 'sessions'>('team');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Team management, permissions, and access control.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {([
          { key: 'team', label: 'Team & Roles', icon: Users },
          { key: 'permissions', label: 'Permissions', icon: Lock },
          { key: 'sessions', label: 'Access Log', icon: History },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === key ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'team' && (
        <div className="space-y-6">
          {/* Team Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="glass-flat p-4 text-center">
              <p className="text-xs text-text-muted">Total Members</p>
              <p className="text-2xl font-bold mt-1">{mockTeam.length}</p>
            </div>
            <div className="glass-flat p-4 text-center">
              <p className="text-xs text-text-muted">2FA Enabled</p>
              <p className="text-2xl font-bold mt-1 text-success">{mockTeam.filter(t => t.twoFactorEnabled).length}</p>
            </div>
            <div className="glass-flat p-4 text-center">
              <p className="text-xs text-text-muted">Admins</p>
              <p className="text-2xl font-bold mt-1 text-warning">{mockTeam.filter(t => t.role === 'admin' || t.role === 'owner').length}</p>
            </div>
            <div className="glass-flat p-4 text-center">
              <p className="text-xs text-text-muted">2FA Missing</p>
              <p className="text-2xl font-bold mt-1 text-error">{mockTeam.filter(t => !t.twoFactorEnabled).length}</p>
            </div>
          </div>

          {/* Team List */}
          <div className="space-y-2">
            {mockTeam.map((member, i) => (
              <TeamMemberRow key={member.id} member={member} delay={i * 0.05} />
            ))}
          </div>

          {/* SoD + Approval Thresholds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SoDPanel />
            <ApprovalThresholdsPanel />
          </div>
        </div>
      )}

      {tab === 'permissions' && <PermissionMatrixTable />}
      {tab === 'sessions' && <SessionLogPanel />}
    </div>
  );
}
