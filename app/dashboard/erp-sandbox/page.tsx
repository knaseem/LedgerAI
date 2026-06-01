'use client';

import { useState } from 'react';
import { Building2, Save, CheckCircle2 } from 'lucide-react';

export default function MockERPSandbox() {
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendor && amount) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-accent" />
          Legacy ERP Simulator
        </h1>
        <p className="text-text-secondary">
          This is a simulated external website (like NetSuite or QuickBooks). We will use the Chrome Extension to automatically "type" into this form without an API.
        </p>
      </div>

      <div className="glass p-8 rounded-2xl border border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Create New Bill</h2>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Vendor Name</label>
            <input 
              id="mock-erp-vendor" 
              type="text" 
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
              placeholder="e.g. Stripe Processing"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Invoice Amount ($)</label>
            <input 
              id="mock-erp-amount" 
              type="text" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
              placeholder="e.g. 5000.00"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center gap-4">
            <button 
              id="mock-erp-submit" 
              type="submit" 
              className="btn-primary"
            >
              <Save className="w-4 h-4" />
              Save Bill to Database
            </button>
            
            {saved && (
              <span className="text-success text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Bill Saved Successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
