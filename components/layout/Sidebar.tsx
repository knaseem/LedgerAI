'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ArrowLeftRight,
  CalendarCheck,
  ClipboardList,
  GitBranch,
  Settings,
  Zap,
  PieChart,
  Workflow,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Accounts Payable', href: '/dashboard/ap', icon: FileText },
  { label: 'Accounts Receivable', href: '/dashboard/ar', icon: FileText },
  { label: 'Bank Reconciliation', href: '/dashboard/reconciliation', icon: ArrowLeftRight },
  { label: 'Financial Close', href: '/dashboard/close', icon: CalendarCheck },
  { label: 'Spend Intelligence', href: '/dashboard/intelligence', icon: PieChart },
  { label: 'Audit Log', href: '/dashboard/audit', icon: ClipboardList },
  { label: 'Compliance', href: '/dashboard/compliance', icon: ShieldCheck },
  { label: 'Workflow Builder', href: '/dashboard/workflows/new', icon: Workflow },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass fixed left-0 top-0 bottom-0 w-[260px] z-40 flex flex-col" style={{ borderRadius: '0 16px 16px 0' }}>
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-text-primary tracking-tight">
            Ledger<span className="gradient-text">AI</span>
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 mt-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent/15 text-accent-hover'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-accent' : ''}`} />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-4">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            pathname.startsWith('/dashboard/settings')
              ? 'bg-accent/15 text-accent-hover'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
          }`}
        >
          <Settings className={`w-[18px] h-[18px] ${pathname.startsWith('/dashboard/settings') ? 'text-accent' : ''}`} />
          Settings
          {pathname.startsWith('/dashboard/settings') && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
          )}
        </Link>
      </div>

      {/* System Status */}
      <div className="mx-3 mb-4 p-3 glass-flat">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-text-muted">All Systems Operational</span>
        </div>
        <p className="text-[10px] text-text-muted mt-1 opacity-60">v2.4.1 · Last sync 2m ago</p>
      </div>
    </aside>
  );
}
