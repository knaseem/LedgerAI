document.getElementById('extractBtn').addEventListener('click', async () => {
  try {
    // Get the currently active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Inject a script to read the page content
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractPageData,
    });
  } catch (error) {
    console.error(error);
    alert("Oops! LedgerAI cannot extract data from this specific page. (Browser security prevents extracting from settings pages or new tabs). Please open a normal website like Google or your Dashboard and try again!");
  }
});

// This function runs entirely in the context of the webpage the user is viewing
function extractPageData() {
  console.log("LedgerAI: Scanning page for financial data...");
  
  // In a real app, this would use complex selectors to scrape NetSuite/QBO specific elements
  // For scaffolding, we just grab all the visible text
  const rawText = document.body.innerText;
  
  // Send data to the background worker to be forwarded to the LedgerAI server
  chrome.runtime.sendMessage({
    action: "SEND_TO_LEDGER_AI",
    payload: {
      url: window.location.href,
      dataPreview: rawText.substring(0, 200) + "..."
    }
  });

  alert("LedgerAI successfully extracted data from this page! Check the extension background console.");
}
