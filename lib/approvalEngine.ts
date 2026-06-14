// ── Approval Engine & Digital Signatures ─────────────────────────────
import { Role, TeamMember, mockTeam, getRequiredApproval, approvalThresholds } from './rbac';

export interface Signature {
  userId: string;
  userName: string;
  role: Role;
  timestamp: string;
  ip: string;
  hash: string;
  comment?: string;
}

export interface ApprovalStep {
  role: Role;
  status: 'pending' | 'completed';
  signature?: Signature;
}

// Generate simulated cryptographic signature
export function generateSignatureHash(invoiceId: string, userId: string, timestamp: string): string {
  const payload = `${invoiceId}|${userId}|${timestamp}|ledgerai-secret-key`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
}

// Create initial approval steps based on invoice amount and uploader
export function getApprovalRoute(amount: number): ApprovalStep[] {
  if (amount < 1000) {
    return []; // Auto-approved
  } else if (amount < 10000) {
    return [
      { role: 'approver', status: 'pending' }
    ];
  } else if (amount < 50000) {
    return [
      { role: 'approver', status: 'pending' },
      { role: 'approver', status: 'pending' }
    ];
  } else {
    return [
      { role: 'approver', status: 'pending' },
      { role: 'admin', status: 'pending' }
    ];
  }
}

export interface CanSignResult {
  canSign: boolean;
  reason?: string;
}

// Check if a specific user can sign the next pending step of an invoice
export function canUserSign(
  user: TeamMember,
  uploaderId: string,
  amount: number,
  steps: ApprovalStep[],
  alreadySignedUserIds: string[]
): CanSignResult {
  // Find the first pending step
  const nextPendingStep = steps.find((s) => s.status === 'pending');
  if (!nextPendingStep) {
    return { canSign: false, reason: 'All approvals completed' };
  }

  // Check if user has already signed a previous step
  if (alreadySignedUserIds.includes(user.id)) {
    return { canSign: false, reason: 'You have already approved this invoice' };
  }

  // Separation of Duties: Uploader cannot approve high-value invoices (>= $10,000)
  if (user.id === uploaderId && amount >= 10000) {
    return {
      canSign: false,
      reason: 'Separation of Duties Rule: You uploaded this invoice and cannot approve payments ≥ $10,000.'
    };
  }

  // Check role eligibility: User's role must be equal or higher in hierarchy
  const roleHierarchy: Role[] = ['viewer', 'analyst', 'approver', 'admin', 'owner'];
  const userRoleIndex = roleHierarchy.indexOf(user.role);
  const requiredRoleIndex = roleHierarchy.indexOf(nextPendingStep.role);

  if (userRoleIndex < requiredRoleIndex) {
    return {
      canSign: false,
      reason: `Required role is ${nextPendingStep.role} or higher. Your role is ${user.role}.`
    };
  }

  return { canSign: true };
}
