import { create } from 'zustand';
import { Invoice, Workflow, AuditEntry, invoices as mockInvoices, workflows as mockWorkflows, auditLog as mockAuditLog, recentActivity as mockActivity, ActivityItem, ReconciliationMatch, reconciliationMatches as mockMatches, CloseTask, closeTasks } from './mockData';

// ── Invoice Store ────────────────────────────────────────────────
interface InvoiceStore {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  drawerOpen: boolean;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  setDrawerOpen: (open: boolean) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  addInvoice: (invoice: Invoice) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: mockInvoices,
  selectedInvoice: null,
  drawerOpen: false,
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  updateInvoiceStatus: (id, status) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status } : inv
      ),
    })),
  addInvoice: (invoice) =>
    set((state) => ({
      invoices: [invoice, ...state.invoices],
    })),
}));

// ── Workflow Store ────────────────────────────────────────────────
interface WorkflowStore {
  workflows: Workflow[];
  updateWorkflowStatus: (id: string, status: Workflow['status']) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  workflows: mockWorkflows,
  updateWorkflowStatus: (id, status) =>
    set((state) => ({
      workflows: state.workflows.map((wf) =>
        wf.id === id ? { ...wf, status } : wf
      ),
    })),
}));

// ── Audit Store ──────────────────────────────────────────────────
interface AuditStore {
  entries: AuditEntry[];
  addEntry: (entry: AuditEntry) => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
  entries: mockAuditLog,
  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),
}));

// ── Activity Store ───────────────────────────────────────────────
interface ActivityStore {
  activities: ActivityItem[];
  addActivity: (activity: ActivityItem) => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: mockActivity,
  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities],
    })),
}));

// ── Reconciliation Store ─────────────────────────────────────────
interface ReconciliationStore {
  matches: ReconciliationMatch[];
  isReconciling: boolean;
  setReconciling: (val: boolean) => void;
  setMatches: (matches: ReconciliationMatch[]) => void;
  resolveMismatch: (bankId: string) => void;
}

export const useReconciliationStore = create<ReconciliationStore>((set) => ({
  matches: mockMatches,
  isReconciling: false,
  setReconciling: (val) => set({ isReconciling: val }),
  setMatches: (matches) => set({ matches }),
  resolveMismatch: (bankId) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.bankId === bankId ? { ...m, status: 'matched' } : m
      ),
    })),
}));

// ── Checkpoint Store ─────────────────────────────────────────────
export interface Checkpoint {
  id: string;
  invoiceId: string;
  vendor: string;
  amount: number;
  reason: string;
  recommendation: string;
  timestamp: string;
}

interface CheckpointStore {
  checkpoints: Checkpoint[];
  resolveCheckpoint: (id: string) => void;
  addCheckpoint: (checkpoint: Checkpoint) => void;
}

export const useCheckpointStore = create<CheckpointStore>((set) => ({
  checkpoints: [
    {
      id: 'CP-001',
      invoiceId: 'INV-2026-004',
      vendor: 'Stripe',
      amount: 1200,
      reason: 'GRN not found — vendor delivery receipt missing',
      recommendation: 'Request delivery confirmation from vendor before approval. Suggest contacting vendor procurement team.',
      timestamp: '2026-05-30 09:30',
    },
    {
      id: 'CP-002',
      invoiceId: 'INV-2026-008',
      vendor: 'NetSuite',
      amount: 12800,
      reason: 'Amount mismatch — PO shows $11,500 vs Invoice $12,800',
      recommendation: 'Reject invoice and request corrected version. Variance of $1,300 (11.3%) exceeds 5% tolerance. Alternatively, create change order to PO-4417.',
      timestamp: '2026-05-30 09:22',
    },
    {
      id: 'CP-003',
      invoiceId: 'INV-2026-016',
      vendor: 'Twilio',
      amount: 4350,
      reason: 'Potential duplicate — same amount billed recently',
      recommendation: 'Reject as duplicate. Invoice has identical amount and similar description to a prior billing. Request credit memo from Twilio.',
      timestamp: '2026-05-30 09:08',
    },
  ],
  resolveCheckpoint: (id) =>
    set((state) => ({
      checkpoints: state.checkpoints.filter((cp) => cp.id !== id),
    })),
  addCheckpoint: (checkpoint) =>
    set((state) => ({
      checkpoints: [checkpoint, ...state.checkpoints],
    })),
}));

// ── AR Store ─────────────────────────────────────────────────────
import { ARInvoice, DunningQueueItem, arInvoices, dunningQueue, IntelligenceAlert, intelligenceAlerts } from './mockData';

interface ARStore {
  invoices: ARInvoice[];
  dunningQueue: DunningQueueItem[];
  approveDunning: (id: string) => void;
  updateDunningEmail: (id: string, text: string) => void;
}

export const useARStore = create<ARStore>((set) => ({
  invoices: arInvoices,
  dunningQueue: dunningQueue,
  approveDunning: (id) =>
    set((state) => ({
      dunningQueue: state.dunningQueue.map((item) =>
        item.id === id ? { ...item, status: 'sent' } : item
      ),
    })),
  updateDunningEmail: (id, text) =>
    set((state) => ({
      dunningQueue: state.dunningQueue.map((item) =>
        item.id === id ? { ...item, draftedEmail: text } : item
      ),
    })),
}));

export interface NegotiationOpportunity {
  id: string;
  vendor: string;
  currentRate: string;
  marketRate: string;
  confidence: number;
  suggestedAction: string;
  draftEmail: string;
  status: 'pending_approval' | 'approved' | 'rejected';
}

const mockNegotiations: NegotiationOpportunity[] = [
  {
    id: 'n1',
    vendor: 'Salesforce',
    currentRate: '$150/user',
    marketRate: '$110/user',
    confidence: 94,
    suggestedAction: 'Request price match based on anonymized market data.',
    draftEmail: 'Hi Salesforce Team,\n\nWe are reviewing our annual contract. Based on our market benchmarking, the current rate of $150/user is significantly above the market average of $110/user for our tier. Can we hop on a call to discuss a price match before our renewal next month?\n\nThanks,\nLedgerAI',
    status: 'pending_approval'
  },
  {
    id: 'n2',
    vendor: 'AWS',
    currentRate: '$12k/mo',
    marketRate: '$9.5k/mo',
    confidence: 88,
    suggestedAction: 'Propose 1-year reserved instance commitment for 20% discount.',
    draftEmail: 'Hi AWS Account Manager,\n\nLedgerAI has analyzed our EC2 compute usage over the past 6 months. Our utilization is highly predictable. We would like to convert our on-demand instances to a 1-year Compute Savings Plan. Can you confirm the total monthly rate will drop to approximately $9.5k as modeled?\n\nBest,\nLedgerAI',
    status: 'pending_approval'
  }
];

interface IntelligenceStore {
  alerts: IntelligenceAlert[];
  dismissAlert: (id: string) => void;
  negotiationOpportunities: NegotiationOpportunity[];
  approveNegotiation: (id: string) => void;
  rejectNegotiation: (id: string) => void;
}

export const useIntelligenceStore = create<IntelligenceStore>((set) => ({
  alerts: intelligenceAlerts,
  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
  negotiationOpportunities: mockNegotiations,
  approveNegotiation: (id) =>
    set((state) => ({
      negotiationOpportunities: state.negotiationOpportunities.map((n) =>
        n.id === id ? { ...n, status: 'approved' } : n
      ),
    })),
  rejectNegotiation: (id) =>
    set((state) => ({
      negotiationOpportunities: state.negotiationOpportunities.map((n) =>
        n.id === id ? { ...n, status: 'rejected' } : n
      ),
    })),
}));

// ── Close Store ────────────────────────────────────────────────────
interface CloseStore {
  tasks: CloseTask[];
  signOffTask: (id: string) => void;
}

export const useCloseStore = create<CloseStore>((set) => ({
  tasks: closeTasks,
  signOffTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: 'certified' } : t
      ),
    })),
}));
