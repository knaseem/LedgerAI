// ── Role-Based Access Control (RBAC) ─────────────────────────────

export type Role = 'owner' | 'admin' | 'approver' | 'analyst' | 'viewer';

export interface Permission {
  key: string;
  label: string;
  description: string;
  category: 'data' | 'workflow' | 'audit' | 'admin' | 'financial';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  lastActive: string;
  twoFactorEnabled: boolean;
  department: string;
}

export const roleHierarchy: Role[] = ['viewer', 'analyst', 'approver', 'admin', 'owner'];

export const roleLabels: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  approver: 'Approver',
  analyst: 'Analyst',
  viewer: 'Viewer',
};

export const roleColors: Record<Role, { pill: string; bg: string; text: string }> = {
  owner: { pill: 'pill-error', bg: 'bg-error/10', text: 'text-error' },
  admin: { pill: 'pill-warning', bg: 'bg-warning/10', text: 'text-warning' },
  approver: { pill: 'pill-info', bg: 'bg-accent/10', text: 'text-accent' },
  analyst: { pill: 'pill-success', bg: 'bg-success/10', text: 'text-success' },
  viewer: { pill: 'pill-neutral', bg: 'bg-surface', text: 'text-text-muted' },
};

export const permissions: Permission[] = [
  { key: 'view_dashboard', label: 'View Dashboard', description: 'Access the main dashboard and metrics', category: 'data' },
  { key: 'view_invoices', label: 'View Invoices', description: 'View AP and AR invoice data', category: 'data' },
  { key: 'upload_invoices', label: 'Upload Invoices', description: 'Upload new invoices for processing', category: 'data' },
  { key: 'approve_invoices', label: 'Approve/Reject Invoices', description: 'Approve or reject invoices under threshold', category: 'financial' },
  { key: 'approve_high_value', label: 'Approve High-Value (>$10k)', description: 'Approve invoices exceeding $10,000', category: 'financial' },
  { key: 'export_data', label: 'Export Data', description: 'Download audit logs and financial reports', category: 'data' },
  { key: 'manage_workflows', label: 'Manage Workflows', description: 'Create, edit, and activate automation workflows', category: 'workflow' },
  { key: 'view_audit_log', label: 'View Audit Log', description: 'Access the full audit trail', category: 'audit' },
  { key: 'verify_chain', label: 'Verify Hash Chain', description: 'Run cryptographic verification on audit trail', category: 'audit' },
  { key: 'manage_team', label: 'Manage Team', description: 'Add/remove team members and change roles', category: 'admin' },
  { key: 'manage_settings', label: 'Manage Settings', description: 'Configure system settings and integrations', category: 'admin' },
  { key: 'view_compliance', label: 'View Compliance', description: 'Access the compliance dashboard', category: 'audit' },
  { key: 'sync_erp', label: 'Sync to ERP', description: 'Push data to connected ERP systems', category: 'workflow' },
  { key: 'manage_approvals', label: 'Manage Approval Chains', description: 'Configure multi-step approval workflows', category: 'admin' },
];

// Permission matrix: which roles have which permissions
export const permissionMatrix: Record<Role, string[]> = {
  viewer: ['view_dashboard', 'view_invoices', 'view_audit_log', 'view_compliance'],
  analyst: ['view_dashboard', 'view_invoices', 'upload_invoices', 'view_audit_log', 'view_compliance', 'export_data'],
  approver: ['view_dashboard', 'view_invoices', 'upload_invoices', 'approve_invoices', 'view_audit_log', 'view_compliance', 'export_data', 'verify_chain', 'sync_erp'],
  admin: ['view_dashboard', 'view_invoices', 'upload_invoices', 'approve_invoices', 'approve_high_value', 'export_data', 'manage_workflows', 'view_audit_log', 'verify_chain', 'manage_team', 'manage_settings', 'view_compliance', 'sync_erp', 'manage_approvals'],
  owner: permissions.map((p) => p.key), // all permissions
};

export function hasPermission(role: Role, permissionKey: string): boolean {
  return permissionMatrix[role]?.includes(permissionKey) ?? false;
}

export function getRoleLevel(role: Role): number {
  return roleHierarchy.indexOf(role);
}

// Separation of Duties (SoD) — prevent same person from both creating and approving
export interface SoDConflict {
  action1: string;
  action2: string;
  description: string;
}

export const sodRules: SoDConflict[] = [
  { action1: 'upload_invoices', action2: 'approve_high_value', description: 'The person who creates a bill cannot also approve high-value payments' },
  { action1: 'manage_workflows', action2: 'approve_invoices', description: 'Workflow designers should not also be invoice approvers (to prevent self-serving automation)' },
];

// Mock team data
export const mockTeam: TeamMember[] = [
  { id: 'USR-001', name: 'Khalid Naseem', email: 'khalid@ledgerai.com', role: 'owner', avatar: 'KN', lastActive: '2 min ago', twoFactorEnabled: true, department: 'Engineering' },
  { id: 'USR-002', name: 'Sarah Chen', email: 'sarah@ledgerai.com', role: 'admin', avatar: 'SC', lastActive: '15 min ago', twoFactorEnabled: true, department: 'Finance' },
  { id: 'USR-003', name: 'Marcus Johnson', email: 'marcus@ledgerai.com', role: 'approver', avatar: 'MJ', lastActive: '1 hr ago', twoFactorEnabled: true, department: 'Finance' },
  { id: 'USR-004', name: 'Emily Rodriguez', email: 'emily@ledgerai.com', role: 'approver', avatar: 'ER', lastActive: '3 hrs ago', twoFactorEnabled: false, department: 'Accounting' },
  { id: 'USR-005', name: 'David Park', email: 'david@ledgerai.com', role: 'analyst', avatar: 'DP', lastActive: '30 min ago', twoFactorEnabled: true, department: 'Finance' },
  { id: 'USR-006', name: 'Lisa Thompson', email: 'lisa@ledgerai.com', role: 'analyst', avatar: 'LT', lastActive: '2 hrs ago', twoFactorEnabled: false, department: 'Operations' },
  { id: 'USR-007', name: 'James Wilson', email: 'james@ledgerai.com', role: 'viewer', avatar: 'JW', lastActive: '1 day ago', twoFactorEnabled: false, department: 'Executive' },
  { id: 'USR-008', name: 'Priya Patel', email: 'priya@ledgerai.com', role: 'viewer', avatar: 'PP', lastActive: '5 hrs ago', twoFactorEnabled: true, department: 'Audit' },
];

// Approval thresholds
export interface ApprovalThreshold {
  maxAmount: number;
  requiredRole: Role;
  requiredApprovers: number;
  label: string;
}

export const approvalThresholds: ApprovalThreshold[] = [
  { maxAmount: 1000, requiredRole: 'analyst', requiredApprovers: 0, label: 'Auto-approved' },
  { maxAmount: 10000, requiredRole: 'approver', requiredApprovers: 1, label: 'Single approval' },
  { maxAmount: 50000, requiredRole: 'approver', requiredApprovers: 2, label: 'Dual approval' },
  { maxAmount: Infinity, requiredRole: 'admin', requiredApprovers: 2, label: 'Admin + Dual approval' },
];

export function getRequiredApproval(amount: number): ApprovalThreshold {
  return approvalThresholds.find((t) => amount <= t.maxAmount) || approvalThresholds[approvalThresholds.length - 1];
}

// Session log types
export interface SessionLog {
  id: string;
  userId: string;
  userName: string;
  action: 'login' | 'logout' | 'failed_login' | 'password_change' | 'role_change' | '2fa_enabled';
  ip: string;
  device: string;
  timestamp: string;
  success: boolean;
  detail?: string;
}

export const mockSessionLogs: SessionLog[] = [
  { id: 'SES-001', userId: 'USR-001', userName: 'Khalid Naseem', action: 'login', ip: '192.168.1.42', device: 'Chrome / macOS', timestamp: '2026-06-03 09:14', success: true },
  { id: 'SES-002', userId: 'USR-002', userName: 'Sarah Chen', action: 'login', ip: '10.0.0.15', device: 'Firefox / Windows', timestamp: '2026-06-03 09:01', success: true },
  { id: 'SES-003', userId: 'USR-003', userName: 'Marcus Johnson', action: 'login', ip: '172.16.0.8', device: 'Chrome / macOS', timestamp: '2026-06-03 08:45', success: true },
  { id: 'SES-004', userId: 'USR-006', userName: 'Lisa Thompson', action: 'failed_login', ip: '203.0.113.50', device: 'Safari / iOS', timestamp: '2026-06-03 08:30', success: false, detail: 'Invalid password — attempt 2 of 5' },
  { id: 'SES-005', userId: 'USR-004', userName: 'Emily Rodriguez', action: 'login', ip: '10.0.0.22', device: 'Edge / Windows', timestamp: '2026-06-03 06:15', success: true },
  { id: 'SES-006', userId: 'USR-005', userName: 'David Park', action: 'login', ip: '192.168.1.100', device: 'Chrome / Linux', timestamp: '2026-06-03 09:32', success: true },
  { id: 'SES-007', userId: 'USR-001', userName: 'Khalid Naseem', action: 'role_change', ip: '192.168.1.42', device: 'Chrome / macOS', timestamp: '2026-06-02 16:00', success: true, detail: 'Changed Lisa Thompson from Viewer to Analyst' },
  { id: 'SES-008', userId: 'USR-002', userName: 'Sarah Chen', action: '2fa_enabled', ip: '10.0.0.15', device: 'Firefox / Windows', timestamp: '2026-06-02 14:20', success: true },
  { id: 'SES-009', userId: 'USR-007', userName: 'James Wilson', action: 'login', ip: '198.51.100.23', device: 'Safari / macOS', timestamp: '2026-06-02 10:00', success: true },
  { id: 'SES-010', userId: 'USR-008', userName: 'Priya Patel', action: 'login', ip: '10.0.0.45', device: 'Chrome / Windows', timestamp: '2026-06-03 04:30', success: true },
  { id: 'SES-011', userId: 'USR-003', userName: 'Marcus Johnson', action: 'password_change', ip: '172.16.0.8', device: 'Chrome / macOS', timestamp: '2026-06-01 11:00', success: true },
  { id: 'SES-012', userId: 'USR-006', userName: 'Lisa Thompson', action: 'failed_login', ip: '203.0.113.50', device: 'Safari / iOS', timestamp: '2026-06-03 08:28', success: false, detail: 'Invalid password — attempt 1 of 5' },
];
