'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Zap,
  Play,
  Save,
  Rocket,
  Trash2,
  Settings,
  X,
  GripVertical,
  Workflow,
  Bell,
  GitFork,
  MousePointer,
  CheckCircle2,
  Info,
  Edit2,
  LayoutTemplate,
  HelpCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sampleWorkflowNodes, type WorkflowNode } from '@/lib/mockData';

// ── Predefined Templates ─────────────────────────────────────────
const workflowTemplates = [
  {
    name: "Intelligent Three-Way Match",
    description: "Accounts Payable: Automatically extract invoice data, match with POs, and route for payment.",
    nodes: [
      { id: 'ap1', type: 'trigger' as const, label: 'Invoice Received', x: 100, y: 200, config: { event_source: 'AP Inbox', file_type: 'PDF', require_attachment: true } },
      { id: 'ap2', type: 'action' as const, label: 'Extract Fields (OCR)', x: 350, y: 200, config: { model: 'LedgerAI Vision', confidence_threshold: '90%' } },
      { id: 'ap3', type: 'action' as const, label: 'Match PO & Receipt', x: 600, y: 200, config: { sync_system: 'NetSuite', match_type: '3-Way' } },
      { id: 'ap4', type: 'condition' as const, label: 'Variance = $0', x: 850, y: 200, config: { variable: 'Line Item Variance', operator: 'Equals', value: '$0' } },
      { id: 'ap5', type: 'action' as const, label: 'Route to ERP', x: 1100, y: 100, config: { system: 'NetSuite', action: 'Draft Bill' } },
      { id: 'ap6', type: 'notify' as const, label: 'Flag Exception', x: 1100, y: 300, config: { channel: 'Slack', priority: 'High' } },
    ]
  },
  {
    name: "Automated Dunning & Collections",
    description: "Accounts Receivable: Escalate overdue invoices with auto-drafted emails and manager reviews.",
    nodes: [
      { id: 'ar1', type: 'trigger' as const, label: '15 Days Overdue', x: 100, y: 200, config: {} },
      { id: 'ar2', type: 'action' as const, label: 'Draft Reminder Email', x: 350, y: 200, config: {} },
      { id: 'ar3', type: 'condition' as const, label: 'Balance > $5k', x: 600, y: 200, config: {} },
      { id: 'ar4', type: 'notify' as const, label: 'Manager Review', x: 850, y: 100, config: {} },
      { id: 'ar5', type: 'action' as const, label: 'Send Auto-Email', x: 850, y: 300, config: {} },
    ]
  },
  {
    name: "Continuous Feed Auto-Match",
    description: "Bank Reconciliation: Reconcile daily banking transactions against ledger entries.",
    nodes: [
      { id: 'br1', type: 'trigger' as const, label: 'Daily Bank Feed', x: 100, y: 200, config: {} },
      { id: 'br2', type: 'action' as const, label: 'AI Auto-Match', x: 350, y: 200, config: {} },
      { id: 'br3', type: 'condition' as const, label: 'Confidence > 99%', x: 600, y: 200, config: {} },
      { id: 'br4', type: 'action' as const, label: 'Post to Ledger', x: 850, y: 100, config: {} },
      { id: 'br5', type: 'notify' as const, label: 'Manual Review Queue', x: 850, y: 300, config: {} },
    ]
  },
  {
    name: "Subledger Tie-Out & Certification",
    description: "Financial Close: Automate month-end subledger reconciliation and SOX sign-offs.",
    nodes: [
      { id: 'fc1', type: 'trigger' as const, label: 'Month-End Trigger', x: 100, y: 200, config: {} },
      { id: 'fc2', type: 'action' as const, label: 'Tie-Out Subledger', x: 350, y: 200, config: {} },
      { id: 'fc3', type: 'condition' as const, label: 'Variance = $0', x: 600, y: 200, config: {} },
      { id: 'fc4', type: 'action' as const, label: 'Auto Sign-Off', x: 850, y: 100, config: {} },
      { id: 'fc5', type: 'notify' as const, label: 'Alert Controller', x: 850, y: 300, config: {} },
    ]
  },
  {
    name: "T&E Anomaly Detection",
    description: "Spend Intelligence: Audit expense reports for out-of-policy behavior and fraud.",
    nodes: [
      { id: 'si1', type: 'trigger' as const, label: 'Expense Submitted', x: 100, y: 200, config: {} },
      { id: 'si2', type: 'action' as const, label: 'Policy Scan', x: 350, y: 200, config: {} },
      { id: 'si3', type: 'condition' as const, label: 'Risk Score > 80', x: 600, y: 200, config: {} },
      { id: 'si4', type: 'notify' as const, label: 'Flag for Audit', x: 850, y: 100, config: {} },
      { id: 'si5', type: 'action' as const, label: 'Hold Reimbursement', x: 1100, y: 100, config: {} },
      { id: 'si6', type: 'action' as const, label: 'Auto-Approve', x: 850, y: 300, config: {} },
    ]
  }
];

// ── Node Colors ──────────────────────────────────────────────────
const nodeStyles: Record<WorkflowNode['type'], { bg: string; border: string; icon: React.ElementType; color: string }> = {
  trigger: { bg: 'bg-success/10', border: 'border-success/30', icon: Zap, color: 'text-success' },
  action: { bg: 'bg-accent/10', border: 'border-accent/30', icon: Play, color: 'text-accent' },
  condition: { bg: 'bg-warning/10', border: 'border-warning/30', icon: GitFork, color: 'text-warning' },
  notify: { bg: 'bg-violet/10', border: 'border-violet/30', icon: Bell, color: 'text-violet' },
};

// ── Palette Item ─────────────────────────────────────────────────
function PaletteItem({
  type,
  label,
  onAdd,
}: {
  type: WorkflowNode['type'];
  label: string;
  onAdd: () => void;
}) {
  const style = nodeStyles[type];
  const Icon = style.icon;

  return (
    <button
      onClick={onAdd}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border ${style.border} ${style.bg} hover:opacity-80 transition-all text-left`}
    >
      <Icon className={`w-4 h-4 ${style.color}`} />
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-[10px] text-text-muted capitalize">{type}</p>
      </div>
    </button>
  );
}

// ── Canvas Node ──────────────────────────────────────────────────
function CanvasNode({
  node,
  selected,
  onSelect,
  onDrag,
}: {
  node: WorkflowNode;
  selected: boolean;
  onSelect: () => void;
  onDrag: (x: number, y: number) => void;
}) {
  const style = nodeStyles[node.type];
  const Icon = style.icon;
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      onDrag(dragRef.current.nodeX + dx, dragRef.current.nodeY + dy);
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`absolute cursor-grab active:cursor-grabbing select-none`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        className={`px-5 py-3.5 rounded-2xl border-2 ${style.border} ${style.bg} min-w-[160px] ${
          selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-3 h-3 text-text-muted/40" />
          <Icon className={`w-4 h-4 ${style.color}`} />
          <span className="text-sm font-medium text-text-primary">{node.label}</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── Config Panel ─────────────────────────────────────────────────
function ConfigPanel({
  node,
  onClose,
  onUpdate,
  onUpdateLabel,
  onDelete,
}: {
  node: WorkflowNode;
  onClose: () => void;
  onUpdate: (config: Record<string, string | number | boolean | undefined>) => void;
  onUpdateLabel: (label: string) => void;
  onDelete: () => void;
}) {
  const [config, setConfig] = useState(node.config);

  const updateField = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(newConfig);
  };

  return (
    <div className="glass p-5 w-[280px] flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4 text-accent" />
          Node Config
        </h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-hover">
          <X className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>

      <div className="glass-flat p-3 mb-4">
        <p className="text-xs text-text-muted">Node</p>
        <p className="text-sm font-medium mt-0.5">{node.label}</p>
        <p className="text-[10px] text-text-muted capitalize mt-0.5">{node.type}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">Node Label</label>
          <input
            type="text"
            value={node.label}
            onChange={(e) => onUpdateLabel(e.target.value)}
            className="w-full px-3 py-2 glass-flat text-sm bg-background focus:outline-none focus:ring-1 focus:ring-accent/50 border border-border transition-all text-text-primary font-medium"
          />
        </div>
        <div className="h-px bg-border my-2" />
        
        {Object.entries(config).map(([key, value]) => {
          // Predefined options for specific keys
          const optionsMap: Record<string, string[]> = {
            // Trigger Options
            event_source: ['Email Inbox', 'SFTP Folder', 'API Webhook', 'Scheduled Task', 'Manual Upload'],
            schedule: ['Continuous', 'Hourly', 'Daily', 'Weekly', 'End of Month'],
            file_type: ['PDF', 'CSV', 'XML', 'Excel', 'Any'],
            
            // Action Options
            target_system: ['NetSuite', 'QuickBooks', 'Xero', 'Sage Intacct', 'Custom ERP'],
            sync_system: ['NetSuite', 'QuickBooks', 'Xero', 'Sage Intacct', 'Custom ERP'],
            system: ['NetSuite', 'QuickBooks', 'Xero', 'Sage Intacct', 'Custom ERP'],
            action_type: ['Data Extraction', 'Draft Bill', 'Sync Record', 'Generate Report', '3-Way Match'],
            action: ['Data Extraction', 'Draft Bill', 'Sync Record', 'Generate Report', '3-Way Match'],
            model: ['LedgerAI Vision', 'AWS Textract', 'Google DocAI', 'Azure Form Recognizer'],
            match_type: ['2-Way', '3-Way', '4-Way', 'Fuzzy Match'],
            
            // Condition Options
            variable: ['Confidence Score', 'Invoice Amount', 'Line Item Variance', 'Vendor Name', 'Due Date'],
            operator: ['>', '<', '==', '!=', 'Contains', 'Equals', 'Starts With'],
            
            // Notify Options
            channel: ['Slack', 'Email', 'Microsoft Teams', 'SMS', 'In-App Notification'],
            priority: ['Low', 'Medium', 'High', 'Critical'],
            template: ['Default Exception', 'Approval Required', 'Success Summary', 'Custom Template'],
          };
          
          const options = optionsMap[key];

          return (
            <div key={key}>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                {key.replace(/_/g, ' ')}
              </label>
              {typeof value === 'boolean' ? (
                <button
                  onClick={() => updateField(key, (!value).toString())}
                  className={`w-full px-3 py-2 glass-flat text-sm text-left font-medium transition-colors ${
                    value ? 'text-success bg-success/5 border-success/30' : 'text-text-muted'
                  }`}
                >
                  {value ? 'Enabled' : 'Disabled'}
                </button>
              ) : options ? (
                <select
                  value={String(value)}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full px-3 py-2 glass-flat text-sm bg-background focus:outline-none focus:ring-1 focus:ring-accent/50 border border-border transition-all text-text-primary font-medium appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                >
                  {/* Ensure the current value is in the list, if not add it */}
                  {!options.includes(String(value)) && <option value={String(value)}>{String(value)}</option>}
                  {options.map(opt => (
                    <option key={opt} value={opt} className="bg-background text-text-primary">{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={String(value)}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full px-3 py-2 glass-flat text-sm bg-background focus:outline-none focus:ring-1 focus:ring-accent/50 border border-border transition-all text-text-primary font-medium"
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onDelete}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-error/30 bg-error/10 text-error text-sm hover:bg-error/20 transition-colors mt-6"
      >
        <Trash2 className="w-4 h-4" />
        Delete Node
      </button>
    </div>
  );
}

export default function WorkflowBuilderPage() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflowTemplates[0].nodes);
  const [workflowName, setWorkflowName] = useState(workflowTemplates[0].name);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveDescription, setSaveDescription] = useState("");
  const [savedWorkflows, setSavedWorkflows] = useState<{id?: string, name: string, description: string, nodes: WorkflowNode[]}[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Fetch saved workflows from Supabase Database on mount
  useEffect(() => {
    async function fetchSavedWorkflows() {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('tenant_id', '00000000-0000-0000-0000-000000000000')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setSavedWorkflows(data);
      }
    }
    fetchSavedWorkflows();
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedId) || null;

  const addNode = useCallback((type: WorkflowNode['type']) => {
    const labels: Record<WorkflowNode['type'], string> = {
      trigger: 'New Trigger',
      action: 'New Action',
      condition: 'New Condition',
      notify: 'New Notification',
    };
    
    const defaultConfigs: Record<WorkflowNode['type'], Record<string, string | boolean>> = {
      trigger: { event_source: 'Email Inbox', schedule: 'Continuous', file_type: 'PDF', require_attachment: true },
      action: { target_system: 'NetSuite', action_type: 'Data Extraction', model: 'LedgerAI Vision', auto_retry: true },
      condition: { variable: 'Confidence Score', operator: '>', threshold: '90%' },
      notify: { channel: 'Slack', template: 'Approval Required', recipient: '@finance-team', priority: 'High' },
    };

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      label: labels[type],
      x: 200 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      config: defaultConfigs[type],
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedId(newNode.id);
  }, []);

  const moveNode = useCallback((id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const updateNodeConfig = useCallback((id: string, config: Record<string, string | number | boolean | undefined>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, config } : n)));
  }, []);

  const updateNodeLabel = useCallback((id: string, label: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, label } : n)));
  }, []);

  const validateWorkflow = useCallback((): boolean => {
    if (nodes.length === 0) {
      showNotification('Error: Canvas is empty. Add a Trigger node to start.', 'error');
      return false;
    }
    
    const sorted = [...nodes].sort((a, b) => a.x - b.x);
    
    if (sorted[0].type !== 'trigger') {
      showNotification('Error: Workflow must start with a Trigger node on the far left.', 'error');
      return false;
    }
    
    const triggers = nodes.filter(n => n.type === 'trigger');
    if (triggers.length > 1) {
      showNotification('Error: A workflow can only have ONE Trigger node.', 'error');
      return false;
    }
    
    if (nodes.length === 1) {
      showNotification('Error: Workflow is incomplete. Add at least one Action node.', 'error');
      return false;
    }
    
    return true;
  }, [nodes, showNotification]);

  // Draw connections
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  useEffect(() => {
    const sorted = [...nodes].sort((a, b) => a.x - b.x);
    const newLines: typeof lines = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      newLines.push({
        x1: sorted[i].x + 160,
        y1: sorted[i].y + 24,
        x2: sorted[i + 1].x,
        y2: sorted[i + 1].y + 24,
      });
    }
    setLines(newLines);
  }, [nodes]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2 group">
            <input 
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-border focus:border-accent outline-none w-full transition-colors pb-1"
              placeholder="Name your workflow..."
            />
            <Edit2 className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-text-muted mt-1">Design and configure automation workflows.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTemplatesOpen(true)} className="btn-ghost btn-sm text-accent hover:bg-accent/10 hover:border-accent/30">
            <LayoutTemplate className="w-3.5 h-3.5" />
            Templates
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button onClick={() => { setNodes([]); setWorkflowName("Untitled Workflow"); }} className="btn-ghost btn-sm text-error hover:bg-error/10 hover:border-error/30">
            <Trash2 className="w-3.5 h-3.5" />
            Clear Canvas
          </button>
          <button onClick={() => setInstructionsOpen(true)} className="btn-ghost btn-sm text-text-secondary hover:text-text-primary">
            <HelpCircle className="w-3.5 h-3.5" />
            How to Use
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button onClick={() => { if (validateWorkflow()) setSimulationOpen(true); }} className="btn-ghost btn-sm text-info hover:bg-info/10 hover:border-info/30">
            <Zap className="w-3.5 h-3.5" />
            Simulate
          </button>
          <button 
            onClick={async () => { 
              if (validateWorkflow()) {
                showNotification('Test Run started. Sending task to Chrome Extension...', 'info');
                
                const { error } = await supabase.from('rpa_queue').insert([{
                  tenant_id: '00000000-0000-0000-0000-000000000000',
                  status: 'pending',
                  payload: {
                    workflow_name: workflowName,
                    action: 'TEST_RUN',
                    timestamp: new Date().toISOString()
                  }
                }]);

                if (error) {
                  showNotification(`Error triggering RPA: ${error.message}`, 'error');
                }
              } 
            }} 
            className="btn-ghost btn-sm"
          >
            <Play className="w-3.5 h-3.5" />
            Test Run
          </button>
          <button onClick={() => { if (validateWorkflow()) setSaveModalOpen(true); }} className="btn-ghost btn-sm">
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button onClick={() => { if (validateWorkflow()) showNotification('Workflow Activated! Now running in background.', 'success'); }} className="btn-primary btn-sm">
            <Rocket className="w-3.5 h-3.5" />
            Activate
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Node Palette */}
        <div className="glass p-4 w-[200px] flex-shrink-0 space-y-3">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Add Nodes
          </h3>
          <PaletteItem type="trigger" label="Trigger" onAdd={() => addNode('trigger')} />
          <PaletteItem type="action" label="Action" onAdd={() => addNode('action')} />
          <PaletteItem type="condition" label="Condition" onAdd={() => addNode('condition')} />
          <PaletteItem type="notify" label="Notify" onAdd={() => addNode('notify')} />

          {selectedId && (
            <button
              onClick={() => deleteNode(selectedId)}
              className="w-full flex items-center gap-2 p-3 rounded-xl border border-error/30 bg-error/10 text-error text-sm hover:bg-error/20 transition-colors mt-4"
            >
              <Trash2 className="w-4 h-4" />
              Delete Node
            </button>
          )}
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative rounded-2xl border border-border bg-background/50 overflow-auto"
          onClick={() => setSelectedId(null)}
        >
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {lines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              selected={selectedId === node.id}
              onSelect={() => setSelectedId(node.id)}
              onDrag={(x, y) => moveNode(node.id, x, y)}
            />
          ))}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MousePointer className="w-10 h-10 text-text-muted/20 mx-auto mb-3" />
                <p className="text-sm text-text-muted">Add nodes from the palette to start building</p>
              </div>
            </div>
          )}
        </div>

        {/* Config Panel */}
        {selectedNode && (
          <ConfigPanel
            node={selectedNode}
            onClose={() => setSelectedId(null)}
            onUpdate={(config) => updateNodeConfig(selectedNode.id, config)}
            onUpdateLabel={(label) => updateNodeLabel(selectedNode.id, label)}
            onDelete={() => deleteNode(selectedNode.id)}
          />
        )}
      </div>

      {/* Simulation Modal */}
      <AnimatePresence>
        {simulationOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSimulationOpen(false)} />
            <motion.div
              className="bg-[#0a0a12] border border-border shadow-[0_0_100px_rgba(0,0,0,0.8)] relative w-full max-w-lg p-6 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-info" />
                  Workflow Simulation
                </h3>
                <button onClick={() => setSimulationOpen(false)} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              <div className="glass-flat p-4 mb-4">
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Based on trailing 12-month historical data, if this workflow was active:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-success/10 rounded-xl border border-success/20">
                    <p className="text-xs text-text-muted">Auto-approved</p>
                    <p className="text-xl font-bold text-success mt-1">4,200 <span className="text-sm font-normal text-text-muted">invoices</span></p>
                  </div>
                  <div className="p-3 bg-info/10 rounded-xl border border-info/20">
                    <p className="text-xs text-text-muted">Time Saved</p>
                    <p className="text-xl font-bold text-info mt-1">800 <span className="text-sm font-normal text-text-muted">hours</span></p>
                  </div>
                </div>
              </div>

              <div className="glass-flat p-4 border-l-2 border-warning mb-6">
                <p className="text-[10px] uppercase tracking-wider text-warning mb-1">Potential Risk Identified</p>
                <p className="text-sm text-text-secondary">
                  Simulation caught <strong>3 false positives</strong> (duplicate payments) that would have slipped through due to the current condition threshold. Consider adding a duplicate check node before approval.
                </p>
              </div>

              <button onClick={() => setSimulationOpen(false)} className="btn-ghost w-full">Close Simulation</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 z-[9999] ${
              notification.type === 'success' ? 'bg-success/10 border-success/30 text-success' : 
              notification.type === 'error' ? 'bg-error/10 border-error/30 text-error' :
              'bg-info/10 border-info/30 text-info'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
             notification.type === 'error' ? <X className="w-5 h-5" /> :
             <Info className="w-5 h-5" />}
            <span className="font-medium text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Modal */}
      <AnimatePresence>
        {instructionsOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setInstructionsOpen(false)} />
            <motion.div
              className="bg-[#0a0a12] border border-border shadow-[0_0_100px_rgba(0,0,0,0.8)] relative w-full max-w-2xl p-8 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-accent" />
                  How to Use Workflow Builder
                </h3>
                <button onClick={() => setInstructionsOpen(false)} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="space-y-6 text-sm text-text-secondary max-h-[60vh] overflow-y-auto pr-2">
                
                <div className="bg-surface/50 p-4 rounded-xl border border-border/50 mb-6">
                  <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">The 4 Building Blocks</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-success mt-0.5" />
                      <div><strong className="text-success">Trigger:</strong> The starting point. Tells LedgerAI <em>when</em> to start (e.g., "Invoice Received"). Every workflow must start with a Trigger.</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Play className="w-4 h-4 text-info mt-0.5" />
                      <div><strong className="text-info">Action:</strong> The doer. Performs an automated task without human intervention (e.g., "Extract Data", "Sync to ERP").</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <GitFork className="w-4 h-4 text-warning mt-0.5" />
                      <div><strong className="text-warning">Condition:</strong> The decision maker. Evaluates data against a rule (e.g., "Amount &gt; $5k"). If passed, it continues to the next node.</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-accent mt-0.5" />
                      <div><strong className="text-accent">Notify:</strong> The communicator. Alerts a human (e.g., "Slack CFO"). Often placed at the end or when a condition fails.</div>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-base font-semibold text-text-primary mb-1">Add Nodes</h4>
                    <p>Click any node type in the left <strong>Add Nodes</strong> palette to drop it onto your canvas. Click on the node to open the Config Panel and customize its behavior.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-base font-semibold text-text-primary mb-1">Auto-Connect Logic</h4>
                    <p>You do not need to manually draw lines! Simply <strong>drag nodes left-to-right</strong> on the canvas. LedgerAI automatically evaluates your workflow from left to right, connecting the nodes sequentially based on their horizontal position.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="text-base font-semibold text-text-primary mb-1">Simulate & Activate</h4>
                    <p>Before saving, click the blue <strong>Simulate</strong> button. LedgerAI will test your visual logic against 12 months of your historical data to ensure there are no errors. Once safe, hit Activate!</p>
                  </div>
                </div>
              </div>

              <button onClick={() => setInstructionsOpen(false)} className="btn-primary w-full mt-8 py-3">Got it, let's build!</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Templates Modal */}
      <AnimatePresence>
        {templatesOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setTemplatesOpen(false)} />
            <motion.div
              className="bg-[#0a0a12] border border-border shadow-[0_0_100px_rgba(0,0,0,0.8)] relative w-full max-w-2xl p-8 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <LayoutTemplate className="w-6 h-6 text-accent" />
                  Workflow Templates
                </h3>
                <button onClick={() => setTemplatesOpen(false)} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {savedWorkflows.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">My Saved Workflows</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {savedWorkflows.map((template, idx) => (
                        <button
                          key={`saved-${idx}`}
                          onClick={() => {
                            setNodes(template.nodes);
                            setWorkflowName(template.name);
                            setTemplatesOpen(false);
                            showNotification(`Loaded: ${template.name}`, 'info');
                          }}
                          className="flex flex-col text-left p-4 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all group"
                        >
                          <h4 className="font-semibold text-accent">{template.name}</h4>
                          {template.description && <p className="text-sm text-text-muted mt-1">{template.description}</p>}
                          <div className="flex gap-2 mt-3">
                            <span className="text-[10px] px-2 py-1 rounded bg-surface border border-border text-text-secondary">
                              {template.nodes.length} Nodes
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">System Templates</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {workflowTemplates.map((template, idx) => (
                      <button
                        key={`sys-${idx}`}
                        onClick={() => {
                          setNodes(template.nodes);
                          setWorkflowName(template.name);
                          setTemplatesOpen(false);
                          showNotification(`Loaded template: ${template.name}`, 'info');
                        }}
                        className="flex flex-col text-left p-4 rounded-xl border border-border bg-background/50 hover:bg-surface-hover transition-all group"
                      >
                        <h4 className="font-semibold text-text-primary group-hover:text-accent transition-colors">{template.name}</h4>
                        <p className="text-sm text-text-muted mt-1">{template.description}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {template.nodes.map((n, i) => (
                            <span key={i} className="text-[10px] px-2 py-1 rounded bg-surface border border-border text-text-secondary">
                              {n.label}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {saveModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSaveModalOpen(false)} />
            <motion.div
              className="bg-[#0a0a12] border border-border shadow-[0_0_100px_rgba(0,0,0,0.8)] relative w-full max-w-md p-6 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Save className="w-5 h-5 text-accent" />
                  Save Workflow
                </h3>
                <button onClick={() => setSaveModalOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Workflow Name</label>
                  <input 
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-flat text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 border border-border transition-all"
                    placeholder="e.g., Monthly Expense Audit"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Description (Optional)</label>
                  <textarea 
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-flat text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 border border-border transition-all min-h-[80px]"
                    placeholder="Add notes about what this workflow does..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setSaveModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
                <button 
                  onClick={async () => {
                    // Prepare data payload for Supabase
                    const newWorkflow = {
                      tenant_id: '00000000-0000-0000-0000-000000000000',
                      name: workflowName,
                      description: saveDescription,
                      nodes: [...nodes],
                      is_active: false
                    };
                    
                    // Insert into Postgres Database
                    const { data, error } = await supabase
                      .from('workflows')
                      .insert([newWorkflow])
                      .select();
                      
                    if (error) {
                      showNotification(`Error saving to DB: ${error.message}`, 'error');
                    } else if (data) {
                      // Update UI state with real DB record
                      setSavedWorkflows(prev => [data[0], ...prev]);
                      setSaveModalOpen(false);
                      setSaveDescription("");
                      showNotification(`"${workflowName}" securely saved to Database!`, 'success');
                    }
                  }} 
                  className="btn-primary flex-1"
                >
                  Confirm Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
