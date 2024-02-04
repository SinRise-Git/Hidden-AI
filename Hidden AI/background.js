chrome.commands.onCommand.addListener((command) => {
  processClipboard();
});

function processClipboard() {
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if (tabs[0]) {
     chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      files: ['content.js']
     });
  } else {
    console.log('No active tab found');
   }
  });
}