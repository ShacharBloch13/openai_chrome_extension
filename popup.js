// popup.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "updatePopupContent") {
        document.getElementById('content').textContent = message.content;
    }
});
