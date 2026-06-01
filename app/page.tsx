'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Zap,
  FileText,
  ArrowLeftRight,
  CalendarCheck,
  ArrowRight,
  Play,
  Link2,
  Bot,
  ShieldCheck,
  ChevronDown,
  Check,
  Users,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import BgOrbs from '@/components/layout/BgOrbs';

// ── Animated Counter ─────────────────────────────────────────────
function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="text-5xl font-bold gradient-text tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

// ── FAQ Item ─────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-flat overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-sm font-medium text-text-primary">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-48 pb-4' : 'max-h-0'
        }`}
      >
        <p className="px-6 text-sm text-text-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ── Logo Ticker Logos ────────────────────────────────────────────
const logos = ['SAP', 'Oracle', 'NetSuite', 'QuickBooks', 'Xero', 'Sage', 'Workday', 'Stripe', 'Plaid'];

// ── Use Cases ────────────────────────────────────────────────────
const useCases = [
  {
    icon: FileText,
    title: 'Accounts Payable',
    description: 'Autonomous OCR extraction, intelligent three-way matching, and zero-API payment routing. You retain final sign-off.',
    stats: '96.8% extraction confidence',
  },
  {
    icon: ArrowLeftRight,
    title: 'Bank Reconciliation',
    description: 'Continuous matching of bank feeds to ledger entries. Instantly surface exceptions and auto-draft adjusting entries.',
    stats: '99.2% auto-match rate',
  },
  {
    icon: CalendarCheck,
    title: 'Financial Close',
    description: 'Replace manual checklists with active agents. Execute subledger tie-outs and gather SOX-compliant certifications automatically.',
    stats: '5x faster close cycles',
  },
  {
    icon: Users,
    title: 'Accounts Receivable',
    description: 'Monitor aging reports and deploy AI to draft highly contextual collection emails based on customer relationships.',
    stats: '22% DSO reduction',
  },
  {
    icon: ShieldAlert,
    title: 'Spend Intelligence',
    description: 'Actively scan 100% of transactions for duplicates, flag anomalous pricing, and identify SaaS sprawl.',
    stats: '100% leakage prevention',
  },
  {
    icon: TrendingUp,
    title: 'Cash Flow Forecasting',
    description: 'Predictive liquidity modeling based on real-time AP, AR, and bank data. Anticipate runway with precision.',
    stats: '98% forecast accuracy',
  },
];

const steps = [
  {
    icon: Link2,
    title: 'Connect',
    description: 'LedgerAI connects to your existing finance systems through the browser — SAP, Oracle, NetSuite, and more.',
  },
  {
    icon: Bot,
    title: 'Act',
    description: 'AI agents process invoices, reconcile transactions, and execute close tasks exactly like your best team members.',
  },
  {
    icon: ShieldCheck,
    title: 'Audit',
    description: 'Every action is logged with full reasoning traces. Human checkpoints for exceptions ensure compliance.',
  },
];

const faqs = [
  {
    question: 'How does LedgerAI work without APIs?',
    answer: 'LedgerAI uses browser-based AI agents that interact with your finance systems through the same interface your team uses. No API integrations, no middleware, no custom development needed.',
  },
  {
    question: 'Is my financial data secure?',
    answer: 'Absolutely. All data is processed in your environment. LedgerAI never stores or transmits sensitive financial data to external servers. SOC 2 Type II certified with end-to-end encryption.',
  },
  {
    question: 'What systems does LedgerAI support?',
    answer: 'LedgerAI works with any web-based finance system including SAP, Oracle, NetSuite, QuickBooks, Xero, Sage, Workday, and more. If your team can use it in a browser, so can LedgerAI.',
  },
  {
    question: 'How long does implementation take?',
    answer: 'Most teams are up and running within 48 hours. No IT involvement required. Simply configure your workflows, connect your systems, and LedgerAI starts processing immediately.',
  },
  {
    question: 'What happens when the AI encounters an exception?',
    answer: 'LedgerAI routes exceptions to human reviewers with full context and a recommended action. Your team stays in control while the AI handles routine work.',
  },
];

// ── Landing Page ─────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <BgOrbs />

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Ledger<span className="gradient-text">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          <a href="#use-cases" className="hover:text-text-primary transition-colors">Solutions</a>
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</a>
          <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-ghost btn-sm">
            Log In
          </Link>
          <Link href="/dashboard" className="btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto text-center pt-20 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="pill pill-info mx-auto mb-6 w-fit">
            <Zap className="w-3 h-3" />
            Now in Private Beta
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            The Zero-API{' '}
            <span className="gradient-text">AI Co-Pilot</span>
            <br />
            for Modern Finance Teams
          </h1>

          <p className="mt-6 text-lg md:text-xl text-text-muted max-w-4xl mx-auto leading-relaxed">
            LedgerAI is a next-generation, browser-based, Zero-API financial automation platform. It is designed to act as an AI co-pilot for finance teams, seamlessly bridging the gap between legacy ERPs (Enterprise Resource Planning systems), modern SaaS applications, and banking portals without requiring complex back-end integrations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
              Get Started with LedgerAI
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className="btn-ghost text-base px-8 py-3">
              <Play className="w-4 h-4" />
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* ── Stat Counters ────────────────────────────────────── */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[
            { end: 85, suffix: '%', label: 'Tasks Automated' },
            { end: 5, suffix: 'x', label: 'Faster Close' },
            { end: 0, suffix: '', label: 'APIs Needed', prefix: '' },
          ].map((stat, i) => (
            <div key={i} className="glass p-8 text-center">
              <AnimatedCounter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} />
              <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Use Cases ──────────────────────────────────────────── */}
      <section id="use-cases" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            One Platform, <span className="gradient-text">Six Core Modules</span>
          </h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            Deploy autonomous finance agents for your most time-consuming processes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <motion.div
                key={i}
                className="glass p-8 hover:border-accent/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{uc.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-4">{uc.description}</p>
                <div className="pill pill-info w-fit">
                  <Check className="w-3 h-3" />
                  {uc.stats}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Logo Ticker ────────────────────────────────────────── */}
      <section className="relative z-10 py-12 overflow-hidden border-y border-border">
        <p className="text-center text-xs text-text-muted uppercase tracking-wider mb-8">
          Works with the systems you already use
        </p>
        <div className="relative overflow-hidden">
          <div className="ticker-track">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-10 text-xl font-semibold text-text-muted/30 select-none"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            How <span className="gradient-text">LedgerAI</span> Works
          </h2>
          <p className="mt-4 text-text-muted">Three steps to autonomous finance operations.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                className="glass-flat p-8 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="text-xs text-text-muted mb-4 font-mono">Step {i + 1}</div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-12 glow-accent"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Finance Operations?
          </h2>
          <p className="text-text-muted mb-8 max-w-xl mx-auto">
            Join leading finance teams automating their most complex workflows with LedgerAI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
              Get Started with LedgerAI
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className="btn-ghost text-base px-8 py-3">
              See How It Works
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-border py-8 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Zap className="w-4 h-4 text-accent" />
            <span>© 2026 LedgerAI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
