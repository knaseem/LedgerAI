// LedgerAI Copilot Background Service Worker
// Constantly polls the Supabase Cloud database for new automation tasks

console.log("LedgerAI Copilot Engine started.");

const SUPABASE_URL = "https://tllrmlbajhoticavjjpk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbHJtbGJhamhvdGljYXZqanBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNjE5MjksImV4cCI6MjA5NTgzNzkyOX0.05ehPqX3TTUoQUM_3oXGXIEHtK7ru6HUdb-69xv-bC8";

async function pollRpaQueue() {
  try {
    // 1. Fetch pending tasks from the cloud
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpa_queue?status=eq.pending&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch from Supabase');
    const tasks = await response.json();
    
    if (tasks && tasks.length > 0) {
      for (const task of tasks) {
        console.log(`🤖 LedgerAI Engine: Picked up pending task [${task.id}]`);
        
        // 2. Mark task as "running" so another bot doesn't grab it
        await fetch(`${SUPABASE_URL}/rest/v1/rpa_queue?id=eq.${task.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ status: 'running' })
        });

        // 3. Find the target ERP tab
        chrome.tabs.query({}, (tabs) => {
          const erpTab = tabs.find(t => t.url && t.url.includes('/dashboard/erp-sandbox'));
          
          if (erpTab) {
            console.log("Found ERP tab. Handing off payload to Content Script...");
            
            chrome.tabs.sendMessage(erpTab.id, {
              action: "EXECUTE_RPA_TASK",
              task: task
            }, async (response) => {
              // MUST check lastError to prevent Chrome from throwing an unhandled exception
              if (chrome.runtime.lastError) {
                console.error("Could not reach content script:", chrome.runtime.lastError.message);
                return;
              }
              
              // 4. Mark as "completed" once the content script finishes typing and clicking!
              console.log("Content Script completed the task!", response);
              
              await fetch(`${SUPABASE_URL}/rest/v1/rpa_queue?id=eq.${task.id}`, {
                method: 'PATCH',
                headers: {
                  'apikey': SUPABASE_KEY,
                  'Authorization': `Bearer ${SUPABASE_KEY}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  status: 'completed', 
                  completed_at: new Date().toISOString() 
                })
              });
              console.log("Task marked as COMPLETED in Supabase!");
            });
          } else {
            console.warn("Could not find the target ERP tab open in your browser.");
          }
        });
      }
    }
  } catch (err) {
    console.error("LedgerAI Polling Error:", err);
  }
  
  // Keep polling every 3 seconds
  setTimeout(pollRpaQueue, 3000);
}

// Start the automation engine loop
pollRpaQueue();
