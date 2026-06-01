// LedgerAI Copilot - DOM Manipulation Engine
console.log("LedgerAI Copilot is active on this page.");

// Helper function to force React to recognize programmatic input changes
const setReactInputValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;
  
  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

// Listen for messages from the background worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXECUTE_RPA_TASK") {
    console.log("⚡ LedgerAI RPA Engine Triggered by Cloud Database!", request.task);
    
    // Step 1: Find the target elements on the screen
    const vendorBox = document.querySelector('#mock-erp-vendor');
    const amountBox = document.querySelector('#mock-erp-amount');
    const saveButton = document.querySelector('#mock-erp-submit');

    if (vendorBox && amountBox && saveButton) {
      
      // We will type the Workflow Name into the Vendor box to prove the data came from the cloud!
      const cloudData = request.task.payload.workflow_name || "Cloud Triggered Bot";
      
      // Step 2: "Type" the extracted data into the fields automatically
      setTimeout(() => setReactInputValue(vendorBox, `Auto: ${cloudData}`), 500);
      setTimeout(() => setReactInputValue(amountBox, "9999.00"), 1000);
      
      // Step 3: Literally "Click" the save button
      setTimeout(() => {
        saveButton.click();
        
        // Tell the background script we finished successfully
        sendResponse({ status: "success", executed_at: new Date().toISOString() });
      }, 1500);
      
      // Return true to indicate we will call sendResponse asynchronously
      return true;
    } else {
      console.warn("Could not find ERP elements. Are you on the Sandbox page?");
      sendResponse({ status: "failed", error: "DOM elements not found" });
    }
  }
});
