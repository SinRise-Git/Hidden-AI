chrome.storage.local.set({cooldown: 'false'})
chrome.commands.onCommand.addListener((command) => {
  processClipboard();
});

function processClipboard() {
  chrome.tabs.query({
      active: true,
      currentWindow: true
  }, function(tabs) {
      chrome.storage.local.get(['cooldown'], async function(result) {
          if (tabs[0] && result.cooldown === 'false') {
              chrome.scripting.executeScript({
                  target: {
                      tabId: tabs[0].id
                  },
                  files: ['content.js']
              });
          } else {
              console.log('No active tab found');
          }
      });
  })
}