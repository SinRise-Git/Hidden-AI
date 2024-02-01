chrome.commands.onCommand.addListener((command) => {
    processClipboard();
});

function processClipboard() {
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
       chrome.tabs.executeScript(
        tabs[0].id,
         {file: 'content.js'}
       );
    } else {
      console.log('No active tab found');
     }
    });
}
