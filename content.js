// content.js - This script will run in the context of web pages.

// This function is called when a command is sent from the background script
function executeCommand(command, selectedText) {
    switch (command) {
      case 'improve-english':
        // Functionality for improving English will be implemented here
        break;
      case 'improve-english-creative':
        // Functionality for creative English improvement will be implemented here
        break;
      case 'add-comments-to-code':
        // Functionality for adding comments to code will be implemented here
        break;
      case 'summarize-to-single-paragraph':
        // Functionality for summarizing to a single paragraph will be implemented here
        break;
      case 'ai-quiz':
        // Functionality for AI quiz will be implemented here
        break;
      default:
        console.error('Unrecognized command: ' + command);
    }
  }
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command && message.selectedText) {
      executeCommand(message.command, message.selectedText);
    }
  });
  