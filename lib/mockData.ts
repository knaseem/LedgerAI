// ── Invoice Types & Data ─────────────────────────────────────────
export interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  poNumber: string;
  grnMatch: boolean;
  status: 'matched' | 'exception' | 'pending' | 'approved' | 'rejected';
  confidence: number;
  lineItems: { description: string; qty: number; unitPrice: number; total: number }[];
  notes?: string;
}

export const invoices: Invoice[] = [
  { id: 'INV-2026-001', vendor: 'Accenture', amount: 84000, currency: 'USD', date: '2026-05-01', dueDate: '2026-06-01', poNumber: 'PO-4410', grnMatch: true, status: 'matched', confidence: 0.98, lineItems: [{ description: 'Consulting Services Q2', qty: 1, unitPrice: 84000, total: 84000 }] },
  { id: 'INV-2026-002', vendor: 'AWS', amount: 23450, currency: 'USD', date: '2026-05-03', dueDate: '2026-06-03', poNumber: 'PO-4411', grnMatch: true, status: 'matched', confidence: 0.99, lineItems: [{ description: 'Cloud Infrastructure May', qty: 1, unitPrice: 23450, total: 23450 }] },
  { id: 'INV-2026-003', vendor: 'Salesforce', amount: 18200, currency: 'USD', date: '2026-05-05', dueDate: '2026-06-05', poNumber: 'PO-4412', grnMatch: true, status: 'approved', confidence: 0.97, lineItems: [{ description: 'CRM Enterprise License', qty: 10, unitPrice: 1820, total: 18200 }] },
  { id: 'INV-2026-004', vendor: 'Stripe', amount: 1200, currency: 'USD', date: '2026-05-06', dueDate: '2026-06-06', poNumber: 'PO-4413', grnMatch: false, status: 'exception', confidence: 0.72, lineItems: [{ description: 'Payment Processing Fees', qty: 1, unitPrice: 1200, total: 1200 }], notes: 'GRN not found - vendor delivery receipt missing' },
  { id: 'INV-2026-005', vendor: 'Deloitte', amount: 67500, currency: 'USD', date: '2026-05-08', dueDate: '2026-07-08', poNumber: 'PO-4414', grnMatch: true, status: 'matched', confidence: 0.96, lineItems: [{ description: 'Tax Advisory Services', qty: 1, unitPrice: 67500, total: 67500 }] },
  { id: 'INV-2026-006', vendor: 'Google Cloud', amount: 31200, currency: 'USD', date: '2026-05-10', dueDate: '2026-06-10', poNumber: 'PO-4415', grnMatch: true, status: 'matched', confidence: 0.99, lineItems: [{ description: 'GCP Enterprise May', qty: 1, unitPrice: 31200, total: 31200 }] },
  { id: 'INV-2026-007', vendor: 'Workday', amount: 45600, currency: 'USD', date: '2026-05-11', dueDate: '2026-06-11', poNumber: 'PO-4416', grnMatch: true, status: 'approved', confidence: 0.95, lineItems: [{ description: 'HCM Platform License', qty: 1, unitPrice: 45600, total: 45600 }] },
  { id: 'INV-2026-008', vendor: 'NetSuite', amount: 12800, currency: 'USD', date: '2026-05-12', dueDate: '2026-06-12', poNumber: 'PO-4417', grnMatch: false, status: 'exception', confidence: 0.68, lineItems: [{ description: 'ERP Module Add-on', qty: 2, unitPrice: 6400, total: 12800 }], notes: 'Amount mismatch - PO shows $11,500' },
  { id: 'INV-2026-009', vendor: 'Slack', amount: 3600, currency: 'USD', date: '2026-05-13', dueDate: '2026-06-13', poNumber: 'PO-4418', grnMatch: true, status: 'pending', confidence: 0.91, lineItems: [{ description: 'Business+ Plan Annual', qty: 120, unitPrice: 30, total: 3600 }] },
  { id: 'INV-2026-010', vendor: 'Figma', amount: 5400, currency: 'USD', date: '2026-05-14', dueDate: '2026-06-14', poNumber: 'PO-4419', grnMatch: true, status: 'matched', confidence: 0.97, lineItems: [{ description: 'Enterprise Design License', qty: 15, unitPrice: 360, total: 5400 }] },
  { id: 'INV-2026-011', vendor: 'HubSpot', amount: 22400, currency: 'USD', date: '2026-05-15', dueDate: '2026-06-15', poNumber: 'PO-4420', grnMatch: true, status: 'matched', confidence: 0.94, lineItems: [{ description: 'Marketing Hub Enterprise', qty: 1, unitPrice: 22400, total: 22400 }] },
  { id: 'INV-2026-012', vendor: 'Snowflake', amount: 41000, currency: 'USD', date: '2026-05-16', dueDate: '2026-07-16', poNumber: 'PO-4421', grnMatch: true, status: 'approved', confidence: 0.98, lineItems: [{ description: 'Data Warehouse Credits', qty: 1, unitPrice: 41000, total: 41000 }] },
  { id: 'INV-2026-013', vendor: 'Datadog', amount: 8900, currency: 'USD', date: '2026-05-17', dueDate: '2026-06-17', poNumber: 'PO-4422', grnMatch: true, status: 'pending', confidence: 0.93, lineItems: [{ description: 'APM + Infrastructure Monitoring', qty: 1, unitPrice: 8900, total: 8900 }] },
  { id: 'INV-2026-014', vendor: 'Notion', amount: 2400, currency: 'USD', date: '2026-05-18', dueDate: '2026-06-18', poNumber: 'PO-4423', grnMatch: true, status: 'matched', confidence: 0.99, lineItems: [{ description: 'Team Plan Annual', qty: 80, unitPrice: 30, total: 2400 }] },
  { id: 'INV-2026-015', vendor: 'Cloudflare', amount: 7600, currency: 'USD', date: '2026-05-19', dueDate: '2026-06-19', poNumber: 'PO-4424', grnMatch: true, status: 'matched', confidence: 0.96, lineItems: [{ description: 'Enterprise WAF + CDN', qty: 1, unitPrice: 7600, total: 7600 }] },
  { id: 'INV-2026-016', vendor: 'Twilio', amount: 4350, currency: 'USD', date: '2026-05-20', dueDate: '2026-06-20', poNumber: 'PO-4425', grnMatch: false, status: 'exception', confidence: 0.65, lineItems: [{ description: 'SMS + Voice API Usage', qty: 1, unitPrice: 4350, total: 4350 }], notes: 'Duplicate invoice - same amount billed on INV-2026-009' },
  { id: 'INV-2026-017', vendor: 'PwC', amount: 55000, currency: 'USD', date: '2026-05-21', dueDate: '2026-07-21', poNumber: 'PO-4426', grnMatch: true, status: 'matched', confidence: 0.97, lineItems: [{ description: 'Audit & Assurance Services', qty: 1, unitPrice: 55000, total: 55000 }] },
  { id: 'INV-2026-018', vendor: 'Adobe', amount: 16800, currency: 'USD', date: '2026-05-22', dueDate: '2026-06-22', poNumber: 'PO-4427', grnMatch: true, status: 'pending', confidence: 0.92, lineItems: [{ description: 'Creative Cloud Enterprise', qty: 40, unitPrice: 420, total: 16800 }] },
  { id: 'INV-2026-019', vendor: 'Zoom', amount: 6000, currency: 'USD', date: '2026-05-23', dueDate: '2026-06-23', poNumber: 'PO-4428', grnMatch: true, status: 'approved', confidence: 0.98, lineItems: [{ description: 'Business License Annual', qty: 100, unitPrice: 60, total: 6000 }] },
  { id: 'INV-2026-020', vendor: 'MongoDB', amount: 9800, currency: 'USD', date: '2026-05-24', dueDate: '2026-06-24', poNumber: 'PO-4429', grnMatch: true, status: 'pending', confidence: 0.90, lineItems: [{ description: 'Atlas Dedicated Cluster', qty: 1, unitPrice: 9800, total: 9800 }] },
];

// ── Bank Transactions ────────────────────────────────────────────
export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  reference: string;
  account: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  glCode: string;
  reference: string;
  entity: string;
}

export interface ReconciliationMatch {
  bankId: string;
  ledgerId: string | null;
  status: 'matched' | 'unmatched' | 'partial';
  reasoning?: string;
  variance?: number;
}

const bankBase: Omit<BankTransaction, 'id'>[] = [
  { date: '2026-05-01', description: 'ACH - Accenture Consulting', amount: 84000, type: 'debit', reference: 'ACH-9901', account: 'Operating' },
  { date: '2026-05-02', description: 'Wire - AWS Infrastructure', amount: 23450, type: 'debit', reference: 'WIR-9902', account: 'Operating' },
  { date: '2026-05-03', description: 'ACH - Salesforce License', amount: 18200, type: 'debit', reference: 'ACH-9903', account: 'Operating' },
  { date: '2026-05-04', description: 'Card - Stripe Processing', amount: 1200, type: 'debit', reference: 'CRD-9904', account: 'Operating' },
  { date: '2026-05-05', description: 'Wire - Deloitte Advisory', amount: 67500, type: 'debit', reference: 'WIR-9905', account: 'Operating' },
  { date: '2026-05-06', description: 'ACH - Google Cloud Platform', amount: 31200, type: 'debit', reference: 'ACH-9906', account: 'Operating' },
  { date: '2026-05-07', description: 'Wire - Workday HCM', amount: 45600, type: 'debit', reference: 'WIR-9907', account: 'Operating' },
  { date: '2026-05-08', description: 'ACH - NetSuite ERP', amount: 12800, type: 'debit', reference: 'ACH-9908', account: 'Operating' },
  { date: '2026-05-09', description: 'Card - Slack Business', amount: 3600, type: 'debit', reference: 'CRD-9909', account: 'Operating' },
  { date: '2026-05-10', description: 'ACH - Figma Enterprise', amount: 5400, type: 'debit', reference: 'ACH-9910', account: 'Operating' },
  { date: '2026-05-11', description: 'Client Payment - Globex Corp', amount: 125000, type: 'credit', reference: 'DEP-9911', account: 'Revenue' },
  { date: '2026-05-12', description: 'Client Payment - Initech', amount: 89000, type: 'credit', reference: 'DEP-9912', account: 'Revenue' },
  { date: '2026-05-13', description: 'ACH - HubSpot Marketing', amount: 22400, type: 'debit', reference: 'ACH-9913', account: 'Operating' },
  { date: '2026-05-14', description: 'Wire - Snowflake Credits', amount: 41000, type: 'debit', reference: 'WIR-9914', account: 'Operating' },
  { date: '2026-05-15', description: 'Card - Datadog Monitoring', amount: 8900, type: 'debit', reference: 'CRD-9915', account: 'Operating' },
  { date: '2026-05-16', description: 'ACH - Notion Workspace', amount: 2400, type: 'debit', reference: 'ACH-9916', account: 'Operating' },
  { date: '2026-05-17', description: 'Wire - Cloudflare Security', amount: 7600, type: 'debit', reference: 'WIR-9917', account: 'Operating' },
  { date: '2026-05-18', description: 'ACH - Twilio API Usage', amount: 4350, type: 'debit', reference: 'ACH-9918', account: 'Operating' },
  { date: '2026-05-19', description: 'Wire - PwC Audit', amount: 55000, type: 'debit', reference: 'WIR-9919', account: 'Operating' },
  { date: '2026-05-20', description: 'ACH - Adobe Creative', amount: 16800, type: 'debit', reference: 'ACH-9920', account: 'Operating' },
  { date: '2026-05-21', description: 'Client Payment - Vandelay Ind', amount: 67500, type: 'credit', reference: 'DEP-9921', account: 'Revenue' },
  { date: '2026-05-22', description: 'Card - Zoom License', amount: 6000, type: 'debit', reference: 'CRD-9922', account: 'Operating' },
  { date: '2026-05-23', description: 'ACH - MongoDB Atlas', amount: 9800, type: 'debit', reference: 'ACH-9923', account: 'Operating' },
  { date: '2026-05-24', description: 'Payroll - May Bi-Weekly', amount: 342000, type: 'debit', reference: 'PAY-9924', account: 'Payroll' },
  { date: '2026-05-25', description: 'Client Payment - Stark Ind', amount: 210000, type: 'credit', reference: 'DEP-9925', account: 'Revenue' },
  { date: '2026-05-26', description: 'Interest Income', amount: 1250, type: 'credit', reference: 'INT-9926', account: 'Revenue' },
  { date: '2026-05-27', description: 'ACH - Office Lease Q2', amount: 28500, type: 'debit', reference: 'ACH-9927', account: 'Operating' },
  // 3 intentionally unmatched
  { date: '2026-05-28', description: 'Unknown Wire Transfer', amount: 15750, type: 'debit', reference: 'WIR-9928', account: 'Operating' },
  { date: '2026-05-29', description: 'Misc ACH - Unidentified', amount: 3200, type: 'debit', reference: 'ACH-9929', account: 'Operating' },
  { date: '2026-05-30', description: 'Card - Unrecognized Vendor', amount: 890, type: 'debit', reference: 'CRD-9930', account: 'Operating' },
];

export const bankTransactions: BankTransaction[] = bankBase.map((t, i) => ({
  ...t,
  id: `BNK-${String(i + 1).padStart(3, '0')}`,
}));

const ledgerBase: Omit<LedgerEntry, 'id'>[] = [
  { date: '2026-05-01', description: 'Accenture Consulting - Q2', amount: 84000, type: 'debit', glCode: '6100', reference: 'JE-5001', entity: 'Corp' },
  { date: '2026-05-02', description: 'AWS Infrastructure - May', amount: 23450, type: 'debit', glCode: '6200', reference: 'JE-5002', entity: 'Corp' },
  { date: '2026-05-03', description: 'Salesforce CRM License', amount: 18200, type: 'debit', glCode: '6300', reference: 'JE-5003', entity: 'Corp' },
  { date: '2026-05-04', description: 'Stripe Payment Fees', amount: 1200, type: 'debit', glCode: '6400', reference: 'JE-5004', entity: 'Corp' },
  { date: '2026-05-05', description: 'Deloitte Tax Advisory', amount: 67500, type: 'debit', glCode: '6100', reference: 'JE-5005', entity: 'Corp' },
  { date: '2026-05-06', description: 'Google Cloud Platform', amount: 31200, type: 'debit', glCode: '6200', reference: 'JE-5006', entity: 'Corp' },
  { date: '2026-05-07', description: 'Workday HCM Platform', amount: 45600, type: 'debit', glCode: '6300', reference: 'JE-5007', entity: 'Corp' },
  { date: '2026-05-08', description: 'NetSuite ERP Modules', amount: 12800, type: 'debit', glCode: '6300', reference: 'JE-5008', entity: 'Corp' },
  { date: '2026-05-09', description: 'Slack Business Plan', amount: 3600, type: 'debit', glCode: '6400', reference: 'JE-5009', entity: 'Corp' },
  { date: '2026-05-10', description: 'Figma Design License', amount: 5400, type: 'debit', glCode: '6400', reference: 'JE-5010', entity: 'Corp' },
  { date: '2026-05-11', description: 'Revenue - Globex Corp', amount: 125000, type: 'credit', glCode: '4100', reference: 'JE-5011', entity: 'Corp' },
  { date: '2026-05-12', description: 'Revenue - Initech', amount: 89000, type: 'credit', glCode: '4100', reference: 'JE-5012', entity: 'Corp' },
  { date: '2026-05-13', description: 'HubSpot Marketing Hub', amount: 22400, type: 'debit', glCode: '6500', reference: 'JE-5013', entity: 'Corp' },
  { date: '2026-05-14', description: 'Snowflake Data Credits', amount: 41000, type: 'debit', glCode: '6200', reference: 'JE-5014', entity: 'Corp' },
  { date: '2026-05-15', description: 'Datadog Monitoring', amount: 8900, type: 'debit', glCode: '6200', reference: 'JE-5015', entity: 'Corp' },
  { date: '2026-05-16', description: 'Notion Team Plan', amount: 2400, type: 'debit', glCode: '6400', reference: 'JE-5016', entity: 'Corp' },
  { date: '2026-05-17', description: 'Cloudflare Security', amount: 7600, type: 'debit', glCode: '6200', reference: 'JE-5017', entity: 'Corp' },
  { date: '2026-05-18', description: 'Twilio API Usage', amount: 4350, type: 'debit', glCode: '6400', reference: 'JE-5018', entity: 'Corp' },
  { date: '2026-05-19', description: 'PwC Audit Services', amount: 55000, type: 'debit', glCode: '6100', reference: 'JE-5019', entity: 'Corp' },
  { date: '2026-05-20', description: 'Adobe Creative Cloud', amount: 16800, type: 'debit', glCode: '6400', reference: 'JE-5020', entity: 'Corp' },
  { date: '2026-05-21', description: 'Revenue - Vandelay Ind', amount: 67500, type: 'credit', glCode: '4100', reference: 'JE-5021', entity: 'Corp' },
  { date: '2026-05-22', description: 'Zoom Business License', amount: 6000, type: 'debit', glCode: '6400', reference: 'JE-5022', entity: 'Corp' },
  { date: '2026-05-23', description: 'MongoDB Atlas Cluster', amount: 9800, type: 'debit', glCode: '6200', reference: 'JE-5023', entity: 'Corp' },
  { date: '2026-05-24', description: 'Payroll - May Bi-Weekly', amount: 342000, type: 'debit', glCode: '5100', reference: 'JE-5024', entity: 'Corp' },
  { date: '2026-05-25', description: 'Revenue - Stark Industries', amount: 210000, type: 'credit', glCode: '4100', reference: 'JE-5025', entity: 'Corp' },
  { date: '2026-05-26', description: 'Interest Income - May', amount: 1250, type: 'credit', glCode: '4200', reference: 'JE-5026', entity: 'Corp' },
  { date: '2026-05-27', description: 'Office Lease - Q2', amount: 28500, type: 'debit', glCode: '6600', reference: 'JE-5027', entity: 'Corp' },
  // No matching ledger entries for bank rows 28-30 (intentional discrepancies)
  { date: '2026-05-15', description: 'Reclassification Entry', amount: 5000, type: 'debit', glCode: '6700', reference: 'JE-5028', entity: 'Sub-A' },
  { date: '2026-05-20', description: 'Intercompany Transfer', amount: 12000, type: 'credit', glCode: '2100', reference: 'JE-5029', entity: 'Sub-B' },
  { date: '2026-05-25', description: 'Accrual - Professional Fees', amount: 8500, type: 'debit', glCode: '6100', reference: 'JE-5030', entity: 'Corp' },
];

export const ledgerEntries: LedgerEntry[] = ledgerBase.map((e, i) => ({
  ...e,
  id: `GL-${String(i + 1).padStart(3, '0')}`,
}));

export const reconciliationMatches: ReconciliationMatch[] = [
  ...Array.from({ length: 27 }, (_, i) => ({
    bankId: `BNK-${String(i + 1).padStart(3, '0')}`,
    ledgerId: `GL-${String(i + 1).padStart(3, '0')}`,
    status: 'matched' as const,
    reasoning: 'Amount, date, and description match within tolerance.',
  })),
  { bankId: 'BNK-028', ledgerId: null, status: 'unmatched', reasoning: 'No corresponding ledger entry found. Unknown wire transfer of $15,750 requires manual review.', variance: 15750 },
  { bankId: 'BNK-029', ledgerId: null, status: 'unmatched', reasoning: 'Unidentified ACH debit of $3,200. No matching PO or invoice on record.', variance: 3200 },
  { bankId: 'BNK-030', ledgerId: null, status: 'unmatched', reasoning: 'Unrecognized vendor charge of $890. Possible unauthorized transaction.', variance: 890 },
];

// ── Financial Close Tasks ────────────────────────────────────────
export interface CloseTask {
  id: string;
  name: string;
  agent: string;
  status: 'complete' | 'in-progress' | 'pending' | 'certified';
  lastUpdated: string;
  reasoning?: string;
  order: number;
}

export const closeTasks: CloseTask[] = [
  { id: 'CT-001', name: 'Revenue Recognition', agent: 'Rev-Agent', status: 'complete', lastUpdated: '2026-05-28 09:15', reasoning: 'All revenue contracts reviewed. ASC 606 criteria met for 47 contracts totaling $2.1M. 3 contracts deferred to Q3 per performance obligation analysis.', order: 1 },
  { id: 'CT-002', name: 'Automated Journal Entries', agent: 'JE-Agent', status: 'complete', lastUpdated: '2026-05-28 10:30', reasoning: 'Generated 142 journal entries: 89 accruals, 31 prepaid amortizations, 22 depreciation entries. All entries balanced and cross-referenced with source documents.', order: 2 },
  { id: 'CT-003', name: 'Intercompany Eliminations', agent: 'IC-Agent', status: 'complete', lastUpdated: '2026-05-28 11:45', reasoning: 'Eliminated $4.2M in intercompany transactions across 5 entities. Identified and resolved $12K timing difference between Sub-A and Corp.', order: 3 },
  { id: 'CT-004', name: 'Account Reconciliations', agent: 'Recon-Agent', status: 'complete', lastUpdated: '2026-05-28 14:00', reasoning: 'Reconciled 68 balance sheet accounts. 3 accounts flagged for review: Prepaid Insurance ($2.1K variance), AP Clearing ($500 variance), Payroll Tax ($180 variance).', order: 4 },
  { id: 'CT-005', name: 'Variance Analysis', agent: 'Variance-Agent', status: 'complete', lastUpdated: '2026-05-28 15:30', reasoning: 'Budget vs actual analysis complete. Material variances: R&D +12% ($340K over budget due to cloud migration), Marketing -8% ($120K under budget). All variances documented with explanations.', order: 5 },
  { id: 'CT-006', name: 'Flux Analysis', agent: 'Flux-Agent', status: 'complete', lastUpdated: '2026-05-29 08:00', reasoning: 'Month-over-month flux analysis for all P&L line items. Significant fluctuations: Professional fees +45% (one-time audit engagement), SaaS costs +8% (new Snowflake contract).', order: 6 },
  { id: 'CT-007', name: 'Tax Provision', agent: 'Tax-Agent', status: 'complete', lastUpdated: '2026-05-29 10:00', reasoning: 'Estimated quarterly tax provision calculated at $890K. Effective tax rate 23.5%. R&D tax credits of $120K applied. Deferred tax asset adjustment of $45K recorded.', order: 7 },
  { id: 'CT-008', name: 'Compliance Verification', agent: 'Compliance-Agent', status: 'in-progress', lastUpdated: '2026-05-29 14:00', reasoning: 'SOX controls testing 85% complete. 2 control deficiencies identified in AP workflow — remediation in progress. GAAP compliance checklist 92% verified.', order: 8 },
  { id: 'CT-009', name: 'Financial Statement Prep', agent: 'FS-Agent', status: 'in-progress', lastUpdated: '2026-05-29 16:00', reasoning: 'Draft P&L and Balance Sheet generated. Cash flow statement pending final bank reconciliation. Notes to financials 60% drafted.', order: 9 },
  { id: 'CT-010', name: 'Management Review Package', agent: 'Report-Agent', status: 'pending', lastUpdated: '2026-05-30 08:00', reasoning: 'Awaiting completion of financial statements and compliance verification before generating executive summary and board-ready package.', order: 10 },
];

// ── Audit Log ────────────────────────────────────────────────────
export interface AuditEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  system: string;
  result: 'success' | 'warning' | 'error';
  reasoning: string;
  workflow: string;
}

const auditActions: Omit<AuditEntry, 'id'>[] = [
  { timestamp: '2026-05-30 09:32:14', agent: 'Invoice-Agent', action: 'Extracted fields from INV-2026-001', system: 'SAP', result: 'success', reasoning: 'Parsed PDF invoice using OCR. Extracted vendor: Accenture, amount: $84,000, PO: PO-4410. Confidence: 98%. All fields validated against vendor master data.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:31:52', agent: 'Match-Agent', action: 'Three-way match for INV-2026-001', system: 'SAP', result: 'success', reasoning: 'Invoice amount $84,000 matches PO-4410 ($84,000) and GRN-7701 ($84,000). Zero variance. Auto-approved per policy threshold.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:30:18', agent: 'Invoice-Agent', action: 'Flagged exception on INV-2026-004', system: 'SAP', result: 'warning', reasoning: 'GRN not found for PO-4413. Stripe invoice $1,200 cannot be matched. Escalated to human checkpoint. Recommendation: Request delivery confirmation from vendor.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:28:44', agent: 'Recon-Agent', action: 'Matched BNK-001 to GL-001', system: 'NetSuite', result: 'success', reasoning: 'Bank transaction ACH-9901 ($84,000 debit) matched to journal entry JE-5001 ($84,000 debit). Date within 1 business day tolerance. Description correlation: 95%.', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-30 09:27:11', agent: 'Recon-Agent', action: 'Flagged unmatched BNK-028', system: 'NetSuite', result: 'warning', reasoning: 'Unknown wire transfer WIR-9928 ($15,750) has no corresponding ledger entry. Searched GL codes 6000-6999. No vendor match found. Requires manual investigation.', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-30 09:25:33', agent: 'JE-Agent', action: 'Created journal entry JE-5024', system: 'Oracle', result: 'success', reasoning: 'Auto-generated payroll journal entry for May bi-weekly cycle. Debit: Salary Expense $342,000. Balanced against Payroll Clearing account. Cross-referenced with ADP payroll report.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:24:01', agent: 'IC-Agent', action: 'Eliminated intercompany balance', system: 'Oracle', result: 'success', reasoning: 'Eliminated $4.2M intercompany receivable/payable between Corp and Sub-A. Timing difference of $12K identified and resolved via adjusting entry JE-ADJ-001.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:22:48', agent: 'Match-Agent', action: 'Rejected INV-2026-008 match', system: 'SAP', result: 'error', reasoning: 'Invoice amount $12,800 does not match PO-4417 amount $11,500. Variance: $1,300 (11.3%). Exceeds 5% tolerance threshold. Flagged for vendor negotiation.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:21:15', agent: 'Compliance-Agent', action: 'SOX control test - AP approval', system: 'Workday', result: 'warning', reasoning: 'AP approval control test identified 2 instances where invoices >$50K were approved by single approver instead of required dual approval. Control deficiency documented. Remediation: Enforce dual-approval workflow rule.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:20:00', agent: 'Rev-Agent', action: 'Revenue recognition - Globex', system: 'Salesforce', result: 'success', reasoning: 'Recognized $125,000 revenue for Globex Corp contract. ASC 606 Step 1-5 analysis complete. Single performance obligation identified. Revenue recognized at point in time upon delivery confirmation.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:18:30', agent: 'Invoice-Agent', action: 'Extracted fields from INV-2026-002', system: 'SAP', result: 'success', reasoning: 'Parsed AWS invoice PDF. Extracted: vendor: AWS, amount: $23,450, PO: PO-4411. Line items: EC2 instances, S3 storage, CloudFront CDN. Confidence: 99%.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:17:05', agent: 'Match-Agent', action: 'Three-way match for INV-2026-002', system: 'SAP', result: 'success', reasoning: 'Invoice $23,450 = PO-4411 ($23,450) = GRN-7702 ($23,450). Perfect match. Auto-approved and routed to payment queue.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:15:42', agent: 'Recon-Agent', action: 'Matched 27 transactions', system: 'NetSuite', result: 'success', reasoning: 'Batch reconciliation complete. 27 of 30 bank transactions matched to ledger entries. Match rate: 90%. Remaining 3 transactions flagged for review.', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-30 09:14:18', agent: 'Variance-Agent', action: 'Budget variance alert - R&D', system: 'Oracle', result: 'warning', reasoning: 'R&D expenses $340K over budget (+12%). Root cause: unplanned cloud migration to GCP ($180K) and additional Snowflake credits ($160K). CFO notification triggered.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:12:55', agent: 'Invoice-Agent', action: 'Extracted fields from INV-2026-003', system: 'SAP', result: 'success', reasoning: 'Salesforce invoice processed. 10 Enterprise licenses at $1,820 each = $18,200. Matched to existing contract terms. Confidence: 97%.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:11:30', agent: 'Tax-Agent', action: 'Calculated quarterly provision', system: 'Oracle', result: 'success', reasoning: 'Q2 tax provision: $890K at 23.5% effective rate. R&D credits: $120K. State apportionment applied across 12 jurisdictions. Deferred tax asset: $45K adjustment.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:10:05', agent: 'Flux-Agent', action: 'MoM flux analysis complete', system: 'Oracle', result: 'success', reasoning: 'All P&L line items analyzed. 4 items with >10% flux: Professional Fees +45%, SaaS +8%, Travel -22%, Recruiting -35%. Explanations documented and linked to supporting evidence.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:08:40', agent: 'Invoice-Agent', action: 'Duplicate detection - INV-2026-016', system: 'SAP', result: 'error', reasoning: 'Potential duplicate detected. INV-2026-016 (Twilio, $4,350) has same amount and similar date as previous Twilio invoice. Flagged for manual review. Recommendation: Reject and request credit memo.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:07:15', agent: 'FS-Agent', action: 'Generated draft P&L', system: 'Oracle', result: 'success', reasoning: 'Draft P&L statement generated for May 2026. Total revenue: $491,500. Total expenses: $1,089,600. Net loss: ($598,100). Note: Includes one-time items of $342K payroll and $84K consulting.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:05:50', agent: 'Match-Agent', action: 'Three-way match for INV-2026-005', system: 'SAP', result: 'success', reasoning: 'Deloitte invoice $67,500 matched. PO-4414: $67,500, GRN-7705: $67,500. Engagement letter terms verified. Payment terms: Net 60.', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:04:25', agent: 'Recon-Agent', action: 'Flagged unmatched BNK-029', system: 'NetSuite', result: 'warning', reasoning: 'ACH debit ACH-9929 ($3,200) unidentified. Searched vendor database and open PO list. No match found. Possible: subscription renewal not yet recorded.', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-30 09:03:00', agent: 'Invoice-Agent', action: 'Batch processing - 5 invoices', system: 'SAP', result: 'success', reasoning: 'Batch processed INV-2026-010 through INV-2026-014. 4 successful extractions, 1 pending review (INV-2026-013 has handwritten annotations requiring manual verification).', workflow: 'AP Automation' },
  { timestamp: '2026-05-30 09:01:35', agent: 'Compliance-Agent', action: 'GAAP compliance check', system: 'Workday', result: 'success', reasoning: 'GAAP compliance checklist 92% verified. Items pending: lease accounting (ASC 842 review), stock compensation (ASC 718 valuation). Expected completion: May 30.', workflow: 'Financial Close' },
  { timestamp: '2026-05-30 09:00:10', agent: 'Report-Agent', action: 'Dashboard metrics updated', system: 'Internal', result: 'success', reasoning: 'Updated all dashboard KPIs: Invoice processing accuracy 96.8%, Reconciliation match rate 90%, Close progress 70%. Sparkline data refreshed for last 30 days.', workflow: 'System' },
  { timestamp: '2026-05-29 17:45:00', agent: 'Invoice-Agent', action: 'End-of-day summary generated', system: 'Internal', result: 'success', reasoning: 'Daily summary: 15 invoices processed, 12 auto-approved, 3 exceptions flagged. Total value processed: $382,100. Average confidence: 94.2%.', workflow: 'AP Automation' },
  { timestamp: '2026-05-29 17:30:00', agent: 'Recon-Agent', action: 'Reconciliation report saved', system: 'NetSuite', result: 'success', reasoning: 'Daily reconciliation report generated and archived. 27 matched, 3 unmatched. Total bank balance: $1,247,840. Total ledger balance: $1,228,000. Difference: $19,840 (unmatched items).', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-29 16:15:00', agent: 'IC-Agent', action: 'Intercompany confirmation sent', system: 'Oracle', result: 'success', reasoning: 'Sent intercompany balance confirmation requests to Sub-A, Sub-B, and Sub-C. Deadline: May 30 EOD. Auto-follow-up scheduled if no response within 24 hours.', workflow: 'Financial Close' },
  { timestamp: '2026-05-29 15:00:00', agent: 'Match-Agent', action: 'Updated matching rules', system: 'SAP', result: 'success', reasoning: 'Refined three-way matching algorithm. Added fuzzy matching for vendor names (Levenshtein distance ≤ 2). Updated amount tolerance from 3% to 5% per finance team request.', workflow: 'AP Automation' },
  { timestamp: '2026-05-29 14:30:00', agent: 'Variance-Agent', action: 'Alert threshold updated', system: 'Oracle', result: 'success', reasoning: 'Updated variance alert thresholds per CFO directive. Material variance threshold changed from 15% to 10% for all expense categories. Retroactive analysis triggered.', workflow: 'Financial Close' },
  { timestamp: '2026-05-29 13:45:00', agent: 'Invoice-Agent', action: 'Vendor master data sync', system: 'SAP', result: 'success', reasoning: 'Synchronized vendor master data from SAP. 342 active vendors, 12 new additions, 3 deactivations. Bank details verified for top 50 vendors by spend volume.', workflow: 'AP Automation' },
  { timestamp: '2026-05-29 12:30:00', agent: 'Recon-Agent', action: 'Bank feed connected', system: 'Plaid', result: 'success', reasoning: 'Established connection to Chase Business checking via Plaid API. Historical data loaded for last 90 days. Real-time transaction feed active. Encryption verified: AES-256.', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-29 11:15:00', agent: 'JE-Agent', action: 'Depreciation entries posted', system: 'Oracle', result: 'success', reasoning: 'Monthly depreciation entries generated for 156 fixed assets. Total depreciation: $89,400. Methods: 142 straight-line, 14 declining balance. All entries auto-posted to GL.', workflow: 'Financial Close' },
  { timestamp: '2026-05-29 10:00:00', agent: 'Rev-Agent', action: 'Contract review - 12 contracts', system: 'Salesforce', result: 'success', reasoning: 'Reviewed 12 new contracts for revenue recognition. 9 qualify for immediate recognition (point-in-time). 3 require over-time recognition per ASC 606-10-25.', workflow: 'Financial Close' },
  { timestamp: '2026-05-29 09:30:00', agent: 'Compliance-Agent', action: 'SOX testing initiated', system: 'Workday', result: 'success', reasoning: 'Initiated Q2 SOX compliance testing. 24 key controls identified across AP, AR, GL, and Payroll processes. Automated testing for 18 controls, manual sampling for 6.', workflow: 'Financial Close' },
  { timestamp: '2026-05-29 09:00:00', agent: 'Report-Agent', action: 'Morning health check', system: 'Internal', result: 'success', reasoning: 'All systems operational. API connections verified: SAP ✓, Oracle ✓, NetSuite ✓, Salesforce ✓, Workday ✓, Plaid ✓. Agent queue: 0 pending, 0 failed. Uptime: 99.97%.', workflow: 'System' },
  { timestamp: '2026-05-28 17:00:00', agent: 'Invoice-Agent', action: 'Weekly AP aging report', system: 'SAP', result: 'success', reasoning: 'Generated AP aging report. Current: $245K, 1-30 days: $189K, 31-60 days: $67K, 61-90 days: $12K, 90+ days: $0. Payment recommendations generated for $189K batch.', workflow: 'AP Automation' },
  { timestamp: '2026-05-28 16:00:00', agent: 'Match-Agent', action: 'Training data updated', system: 'Internal', result: 'success', reasoning: 'Updated ML training dataset with 150 new invoice-PO-GRN triplets from May processing. Model accuracy improved from 94.2% to 96.8% on validation set.', workflow: 'AP Automation' },
  { timestamp: '2026-05-28 15:00:00', agent: 'Recon-Agent', action: 'Multi-currency reconciliation', system: 'NetSuite', result: 'success', reasoning: 'Reconciled EUR and GBP accounts. EUR: 15 transactions matched, 0 unmatched. GBP: 8 transactions matched, 0 unmatched. FX rates applied from ECB daily fix.', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-28 14:00:00', agent: 'Tax-Agent', action: 'Sales tax calculation', system: 'Oracle', result: 'success', reasoning: 'Calculated May sales tax obligations across 12 states. Total liability: $34,200. Filed auto-returns for 8 states. 4 states require manual filing (CA, NY, TX, IL).', workflow: 'Financial Close' },
  { timestamp: '2026-05-28 13:00:00', agent: 'Flux-Agent', action: 'YoY comparison generated', system: 'Oracle', result: 'success', reasoning: 'Year-over-year comparison for May: Revenue +18% ($491K vs $416K), OpEx +22% ($1.09M vs $894K). Key driver: headcount growth +15% and infrastructure scaling.', workflow: 'Financial Close' },
  { timestamp: '2026-05-28 12:00:00', agent: 'Invoice-Agent', action: 'OCR model calibration', system: 'Internal', result: 'success', reasoning: 'Calibrated OCR model for new invoice formats from 3 vendors (Snowflake, Datadog, MongoDB). Extraction accuracy improved to 98.5% on test set. Deployed to production.', workflow: 'AP Automation' },
  { timestamp: '2026-05-28 11:00:00', agent: 'Recon-Agent', action: 'Stale check investigation', system: 'NetSuite', result: 'warning', reasoning: 'Identified 2 stale checks >90 days: Check #8821 ($2,400 to Notion) and Check #8835 ($1,800 to former vendor). Recommendation: Void and reissue or write off.', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-28 10:00:00', agent: 'JE-Agent', action: 'Prepaid amortization', system: 'Oracle', result: 'success', reasoning: 'Generated 31 prepaid expense amortization entries. Total amortized: $78,600. Largest items: Insurance ($24K), Software licenses ($31K), Rent deposits ($18K).', workflow: 'Financial Close' },
  { timestamp: '2026-05-28 09:30:00', agent: 'IC-Agent', action: 'Transfer pricing review', system: 'Oracle', result: 'success', reasoning: 'Reviewed intercompany transfer pricing for Q2. All transactions within arm\'s length range. Documentation updated for TP files. No adjustments required.', workflow: 'Financial Close' },
  { timestamp: '2026-05-28 09:00:00', agent: 'Report-Agent', action: 'System startup complete', system: 'Internal', result: 'success', reasoning: 'LedgerAI system initialized. All 8 agents online. Connected to 6 external systems. Processing queue loaded with 15 pending items from overnight batch.', workflow: 'System' },
  { timestamp: '2026-05-27 17:00:00', agent: 'Invoice-Agent', action: 'Vendor payment batch', system: 'SAP', result: 'success', reasoning: 'Submitted payment batch for 8 approved invoices totaling $289,350. Payment methods: 5 ACH, 2 wire, 1 virtual card. Expected settlement: May 29.', workflow: 'AP Automation' },
  { timestamp: '2026-05-27 16:00:00', agent: 'Compliance-Agent', action: 'Policy update notification', system: 'Workday', result: 'success', reasoning: 'Detected update to company expense policy v2.4. Updated matching rules to reflect new approval thresholds: <$10K single approver, $10K-$50K manager + director, >$50K VP approval required.', workflow: 'AP Automation' },
  { timestamp: '2026-05-27 15:00:00', agent: 'Recon-Agent', action: 'Cash forecast generated', system: 'NetSuite', result: 'success', reasoning: 'Generated 30-day cash forecast. Projected inflows: $890K. Projected outflows: $1.2M. Net: ($310K). Recommendation: Draw $350K from revolving credit facility by June 5.', workflow: 'Bank Reconciliation' },
  { timestamp: '2026-05-27 14:00:00', agent: 'Match-Agent', action: 'Exception auto-resolution', system: 'SAP', result: 'success', reasoning: 'Auto-resolved 4 invoice exceptions from previous day. 3 resolved by updated GRN data, 1 resolved by vendor credit memo. Remaining exceptions: 3 (require human review).', workflow: 'AP Automation' },
  { timestamp: '2026-05-27 13:00:00', agent: 'Rev-Agent', action: 'Deferred revenue schedule', system: 'Salesforce', result: 'success', reasoning: 'Updated deferred revenue schedule. Total deferred: $1.8M across 23 contracts. May recognition: $310K. Largest: Stark Industries ($125K over 12 months).', workflow: 'Financial Close' },
];

export const auditLog: AuditEntry[] = auditActions.map((a, i) => ({
  ...a,
  id: `AUD-${String(i + 1).padStart(3, '0')}`,
}));

// ── Workflows ────────────────────────────────────────────────────
export interface Workflow {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'exception';
  lastRun: string;
  recordsProcessed: number;
  accuracy: number;
  description: string;
  sparkData: number[];
}

export const workflows: Workflow[] = [
  { id: 'WF-001', name: 'AP Invoice Processing', status: 'running', lastRun: '2 min ago', recordsProcessed: 1247, accuracy: 96.8, description: 'Automated invoice extraction, three-way matching, and approval routing', sparkData: [92, 94, 93, 95, 96, 94, 97, 96, 95, 97, 96, 98] },
  { id: 'WF-002', name: 'Bank Reconciliation', status: 'running', lastRun: '5 min ago', recordsProcessed: 3842, accuracy: 99.2, description: 'Daily bank-to-ledger transaction matching and discrepancy detection', sparkData: [98, 99, 98, 99, 99, 98, 99, 100, 99, 99, 100, 99] },
  { id: 'WF-003', name: 'Financial Close', status: 'exception', lastRun: '1 hr ago', recordsProcessed: 892, accuracy: 94.5, description: 'Month-end close automation including journal entries, reconciliations, and reporting', sparkData: [88, 90, 91, 92, 93, 91, 94, 93, 95, 94, 95, 94] },
  { id: 'WF-004', name: 'Compliance Monitoring', status: 'running', lastRun: '15 min ago', recordsProcessed: 2156, accuracy: 98.1, description: 'Continuous SOX compliance testing and policy enforcement monitoring', sparkData: [96, 97, 97, 98, 97, 98, 99, 98, 98, 97, 98, 98] },
];

// ── Activity Feed ────────────────────────────────────────────────
export interface ActivityItem {
  id: string;
  timestamp: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  agent: string;
}

export const recentActivity: ActivityItem[] = [
  { id: 'ACT-001', timestamp: '2 min ago', message: 'Invoice INV-2026-001 auto-approved after three-way match', type: 'success', agent: 'Match-Agent' },
  { id: 'ACT-002', timestamp: '5 min ago', message: 'Bank reconciliation completed — 27/30 matched', type: 'success', agent: 'Recon-Agent' },
  { id: 'ACT-003', timestamp: '8 min ago', message: 'Exception flagged on INV-2026-004 — GRN missing', type: 'warning', agent: 'Invoice-Agent' },
  { id: 'ACT-004', timestamp: '12 min ago', message: 'SOX control deficiency detected in AP workflow', type: 'error', agent: 'Compliance-Agent' },
  { id: 'ACT-005', timestamp: '15 min ago', message: 'Tax provision calculated — $890K at 23.5% effective rate', type: 'info', agent: 'Tax-Agent' },
  { id: 'ACT-006', timestamp: '20 min ago', message: 'Revenue recognized for Globex Corp — $125,000', type: 'success', agent: 'Rev-Agent' },
  { id: 'ACT-007', timestamp: '25 min ago', message: 'Intercompany eliminations completed — $4.2M across 5 entities', type: 'success', agent: 'IC-Agent' },
  { id: 'ACT-008', timestamp: '30 min ago', message: 'R&D budget variance alert — +12% over budget', type: 'warning', agent: 'Variance-Agent' },
  { id: 'ACT-009', timestamp: '35 min ago', message: '142 automated journal entries generated for May', type: 'success', agent: 'JE-Agent' },
  { id: 'ACT-010', timestamp: '40 min ago', message: 'All dashboard metrics refreshed', type: 'info', agent: 'Report-Agent' },
];

// ── Workflow Builder Node Types ──────────────────────────────────
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'notify';
  label: string;
  x: number;
  y: number;
  config: Record<string, string | number | boolean | undefined>;
}

export const sampleWorkflowNodes: WorkflowNode[] = [
  { id: 'node-1', type: 'trigger', label: 'Invoice Received', x: 100, y: 200, config: { source: 'Email', format: 'PDF', schedule: 'Real-time' } },
  { id: 'node-2', type: 'action', label: 'Extract Fields', x: 350, y: 200, config: { model: 'claude-sonnet-4-20250514', confidence_threshold: 0.9, retry: true } },
  { id: 'node-3', type: 'condition', label: 'Confidence > 90%', x: 600, y: 200, config: { field: 'confidence', operator: '>', value: 0.9 } },
  { id: 'node-4', type: 'action', label: 'Three-Way Match', x: 850, y: 130, config: { tolerance: 0.05, auto_approve: true, system: 'SAP' } },
  { id: 'node-5', type: 'notify', label: 'Flag for Review', x: 850, y: 300, config: { channel: 'Slack', recipients: '#finance-team', priority: 'high' } },
];

// ── AR Invoices (Accounts Receivable) ────────────────────────────
export interface ARInvoice {
  id: string;
  customer: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'open' | 'overdue';
  daysOverdue: number;
  riskScore: 'low' | 'medium' | 'high';
}

export const arInvoices: ARInvoice[] = [
  { id: 'AR-1001', customer: 'Stark Industries', amount: 45000, issueDate: '2026-04-15', dueDate: '2026-05-15', status: 'overdue', daysOverdue: 15, riskScore: 'high' },
  { id: 'AR-1002', customer: 'Wayne Enterprises', amount: 120000, issueDate: '2026-05-01', dueDate: '2026-05-31', status: 'open', daysOverdue: 0, riskScore: 'low' },
  { id: 'AR-1003', customer: 'LexCorp', amount: 32000, issueDate: '2026-03-10', dueDate: '2026-04-10', status: 'overdue', daysOverdue: 50, riskScore: 'high' },
  { id: 'AR-1004', customer: 'Oscorp', amount: 8500, issueDate: '2026-05-10', dueDate: '2026-06-10', status: 'open', daysOverdue: 0, riskScore: 'medium' },
  { id: 'AR-1005', customer: 'Initech', amount: 64000, issueDate: '2026-04-28', dueDate: '2026-05-28', status: 'overdue', daysOverdue: 2, riskScore: 'low' },
  { id: 'AR-1006', customer: 'Cyberdyne Systems', amount: 210000, issueDate: '2026-05-15', dueDate: '2026-06-15', status: 'open', daysOverdue: 0, riskScore: 'low' },
];

export interface DunningQueueItem {
  id: string;
  invoiceId: string;
  customer: string;
  amount: number;
  daysOverdue: number;
  draftedEmail: string;
  status: 'pending_approval' | 'sent';
}

export const dunningQueue: DunningQueueItem[] = [
  {
    id: 'DUN-01',
    invoiceId: 'AR-1001',
    customer: 'Stark Industries',
    amount: 45000,
    daysOverdue: 15,
    draftedEmail: "Hi Tony,\n\nHope all is well. Just following up on invoice AR-1001 for $45,000, which was due on May 15. We know your AP team has been migrating systems recently. Could you let us know when we might expect this to be processed?\n\nBest,\nLedgerAI Collections Agent",
    status: 'pending_approval',
  },
  {
    id: 'DUN-02',
    invoiceId: 'AR-1003',
    customer: 'LexCorp',
    amount: 32000,
    daysOverdue: 50,
    draftedEmail: "Dear LexCorp Accounts Payable,\n\nThis is our third follow-up regarding invoice AR-1003 for $32,000, now 50 days past due. Per our SLA, a 1.5% late fee will be applied if payment is not received by next Friday. Please remit payment immediately or contact us to arrange a payment plan.\n\nRegards,\nLedgerAI Collections Agent",
    status: 'pending_approval',
  }
];

// ── SaaS Subscriptions & Sprawl ──────────────────────────────────
export interface SaaSSubscription {
  id: string;
  vendor: string;
  category: string;
  monthlyCost: number;
  totalLicenses: number;
  activeUsers: number;
  utilization: number;
  potentialSavings: number;
}

export const saasData: SaaSSubscription[] = [
  { id: 'SUB-01', vendor: 'Salesforce', category: 'CRM', monthlyCost: 18200, totalLicenses: 120, activeUsers: 95, utilization: 79, potentialSavings: 3791 },
  { id: 'SUB-02', vendor: 'Zoom', category: 'Communications', monthlyCost: 6000, totalLicenses: 300, activeUsers: 285, utilization: 95, potentialSavings: 300 },
  { id: 'SUB-03', vendor: 'Adobe Creative Cloud', category: 'Design', monthlyCost: 4200, totalLicenses: 40, activeUsers: 18, utilization: 45, potentialSavings: 2310 },
  { id: 'SUB-04', vendor: 'Notion', category: 'Productivity', monthlyCost: 2400, totalLicenses: 200, activeUsers: 195, utilization: 98, potentialSavings: 60 },
  { id: 'SUB-05', vendor: 'Asana', category: 'Project Mgmt', monthlyCost: 1850, totalLicenses: 150, activeUsers: 60, utilization: 40, potentialSavings: 1110 },
];

// ── Cash Flow Forecast ───────────────────────────────────────────
export const cashFlowData = [
  { week: 'W1', inflow: 120000, outflow: 85000, balance: 535000 },
  { week: 'W2', inflow: 45000, outflow: 110000, balance: 470000 },
  { week: 'W3', inflow: 210000, outflow: 60000, balance: 620000 },
  { week: 'W4', inflow: 80000, outflow: 350000, balance: 350000, note: 'Payroll run expected' },
  { week: 'W5', inflow: 150000, outflow: 90000, balance: 410000 },
  { week: 'W6', inflow: 60000, outflow: 55000, balance: 415000 },
  { week: 'W7', inflow: 320000, outflow: 120000, balance: 615000, note: 'Large invoice payment (Acme Corp) due' },
  { week: 'W8', inflow: 95000, outflow: 355000, balance: 355000, note: 'Payroll run expected' },
  { week: 'W9', inflow: 110000, outflow: 70000, balance: 395000 },
  { week: 'W10', inflow: 50000, outflow: 85000, balance: 360000 },
  { week: 'W11', inflow: 180000, outflow: 65000, balance: 475000 },
  { week: 'W12', inflow: 75000, outflow: 360000, balance: 190000, note: 'Payroll + Quarterly estimated tax due' },
  { week: 'W13', inflow: 250000, outflow: 95000, balance: 345000 },
];

// ── Intelligence Alerts ──────────────────────────────────────────
export interface IntelligenceAlert {
  id: string;
  type: 'duplicate' | 'price_variance' | 'fraud' | 'tax_nexus';
  title: string;
  description: string;
  impactAmount: number;
  severity: 'high' | 'medium' | 'low';
}

export const intelligenceAlerts: IntelligenceAlert[] = [
  { id: 'IA-01', type: 'duplicate', title: 'Potential Duplicate Payment Detected', description: 'Vendor "Twilio" sent Invoice INV-2026-016 for $4,350 which matches the amount and date of an expense report submitted by J. Smith via Expensify.', impactAmount: 4350, severity: 'high' },
  { id: 'IA-02', type: 'price_variance', title: 'AWS Price Variance Alert', description: 'EC2 instance pricing on the May invoice is 12% higher than the trailing 6-month average, despite consistent usage volume.', impactAmount: 2800, severity: 'medium' },
  { id: 'IA-03', type: 'fraud', title: 'Anomalous Expense Report', description: 'Employee M. Johnson submitted a $450 dinner receipt in Las Vegas on a Saturday. No correlated client meetings exist on their calendar.', impactAmount: 450, severity: 'high' },
  { id: 'IA-04', type: 'tax_nexus', title: 'Approaching Economic Nexus: Texas', description: 'Trailing 12-month sales in Texas have reached $485,000. You will trigger economic nexus at $500,000 and must begin collecting sales tax.', impactAmount: 0, severity: 'medium' },
];
