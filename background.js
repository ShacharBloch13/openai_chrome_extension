my_api = 'sk-proj-X4WxzPQRqv7uHODr1lu9T3BlbkFJAutqnYkCxjEXv27qZvX2'
class_api = 'sk-proj-wQ4taTDDFhbuDrmkqIlOT3BlbkFJlJVo8Zlx0wucOcJ2atou'

let currentWindowId = null;
let currentListener = null;

chrome.contextMenus.create({
  id: "improveEnglish",
  title: "Improve English",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "improveEnglishCreative",
  title: "Improve English - Creative",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "addCommentsToCode",
  title: "Add comments to code",
  contexts: ["selection"]
});

chrome.contextMenus.create({
    id: "summarizeToSingleParagraph",
    title: "Summarize to a single paragraph",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "generateQuiz",
    title: "AI Quiz",
    contexts: ["selection"]
  });

  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "improveEnglish") {
      improveSelectedText(info.selectionText, 'gpt-3.5-turbo', 0.6);
    } else if (info.menuItemId === "improveEnglishCreative") {
        improveSelectedTextCreative(info.selectionText, 'gpt-3.5-turbo', 0.9);
    } else if (info.menuItemId === "addCommentsToCode") {
        codeCommenter(info.selectionText);
    } else if (info.menuItemId === "summarizeToSingleParagraph") {
        Summarizer(info.selectionText);
    } else if (info.menuItemId === "generateQuiz") {
        Quizer(info.selectionText);
      }
  });

function improveSelectedText(selectedText, apiModel, temperature) {
  var messages = [
    {
      role: "system",
      content: "You are a harvard English professor. Your task is to improve the given text to make it more professional and grammatically correct."
    },
    {
      role: "user",
      content: "Improve the following text" + selectedText
    }
  ];

  fetchChatCompletion(messages, 'sk-proj-X4WxzPQRqv7uHODr1lu9T3BlbkFJAutqnYkCxjEXv27qZvX2', apiModel, temperature)
    .then(data => {
      var improvedText = data.choices[0].message.content.trim();
      console.log("Improved Text:", improvedText);

      // Close the previous window if it exists
      if (currentWindowId !== null) {
        chrome.windows.remove(currentWindowId);
      }

      // Remove the previous listener if it exists
      if (currentListener !== null) {
        chrome.runtime.onMessage.removeListener(currentListener);
      }

      currentWindowId = null;
      currentListener = null;
      
      chrome.windows.create({
        url: "popup.html",
        type: "popup",
        width: 400,
        height: 300
      }, function(window) {
        currentWindowId = window.id;

        // Create a new listener with a closure
        currentListener = function handleMessage(request, sender, sendResponse) {
          if (request.action === "getImprovedText") {
            sendResponse({ text: improvedText });
          }
        };
        chrome.runtime.onMessage.addListener(currentListener);

        // Listen for the window being closed programmatically or manually
        chrome.windows.onRemoved.addListener(handlePopupWindowRemoved);
        window.onRemoved.addListener(handlePopupWindowRemoved);
      });
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function improveSelectedTextCreative(selectedText, apiModel, temperature) {
  var messages = [
    {
      role: "system",
      content: "You are the famous author Ernest Hemingway. Your task is to improve the given text to make it more creative and engaging."
    },
    {
      role: "user",
      content: "Improve the following text, like Ernest would" + selectedText
    }
  ];

  fetchChatCompletion(messages, 'sk-proj-X4WxzPQRqv7uHODr1lu9T3BlbkFJAutqnYkCxjEXv27qZvX2', apiModel, temperature)
    .then(data => {
      var improvedText = data.choices[0].message.content.trim();
      console.log("Improved Text:", improvedText);

      // Close the previous window if it exists
      if (currentWindowId !== null) {
        chrome.windows.remove(currentWindowId);
      }

      // Remove the previous listener if it exists
      if (currentListener !== null) {
        chrome.runtime.onMessage.removeListener(currentListener);
      }

      currentWindowId = null;
      currentListener = null;
      
      chrome.windows.create({
        url: "popup.html",
        type: "popup",
        width: 400,
        height: 300
      }, function(window) {
        currentWindowId = window.id;

        // Create a new listener with a closure
        currentListener = function handleMessage(request, sender, sendResponse) {
          if (request.action === "getImprovedText") {
            sendResponse({ text: improvedText });
          }
        };
        chrome.runtime.onMessage.addListener(currentListener);

        // Listen for the window being closed programmatically or manually
        chrome.windows.onRemoved.addListener(handlePopupWindowRemoved);
        window.onRemoved.addListener(handlePopupWindowRemoved);
      });
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

async function codeCommenter(selectedText) {
  const messages = [
    {
      role: "system",
      content: "You are a computer science professor. Your task is to add comments to the given code to explain it clearly. Return the full code with comments. If possible, suggest improvements, but only at the end."
    },
    {
      role: "user",
      content: "Add comments to the following code: " + selectedText
    }
  ];

  try {
    const response = await fetchChatCompletion(messages, 'sk-proj-X4WxzPQRqv7uHODr1lu9T3BlbkFJAutqnYkCxjEXv27qZvX2', 'gpt-3.5-turbo', 0.4);
    const commentedCode = response.choices[0].message.content.trim();
    console.log("Commented Code:", commentedCode);

    if (currentWindowId !== null) {
      chrome.windows.remove(currentWindowId);
    }

    if (currentListener !== null) {
      chrome.runtime.onMessage.removeListener(currentListener);
    }

    currentWindowId = null;
    currentListener = null;

    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      width: 400,
      height: 300
    }, function(window) {
      currentWindowId = window.id;

      currentListener = function handleMessage(request, sender, sendResponse) {
        if (request.action === "getImprovedText") {
          sendResponse({ text: commentedCode });
          saveToFile(commentedCode);
        }
      };
      chrome.runtime.onMessage.addListener(currentListener);

      chrome.windows.onRemoved.addListener(handlePopupWindowRemoved);
      window.onRemoved.addListener(handlePopupWindowRemoved);
    });
  }
  catch (error) {
    console.error("Error:", error);
  }
}

function saveToFile(data) {
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url,
    filename: 'commentedCode.txt', // Optional: specify a filename for the downloaded file
    saveAs: true
  });
}
  // Fetch data from the OpenAI Chat Completion API
  async function fetchChatCompletion(messages, apiKey, apiModel, temperature) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          "messages": messages,
          "model": apiModel,
          "temperature": temperature
        })
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - Incorrect API key
          throw new Error("Looks like your API key is incorrect. Please check your API key and try again.");
        } else {
          throw new Error(`Failed to fetch. Status code: ${response.status}`);
        }
      }
  
      return await response.json();
    } catch (error) {
      // Send a response to the popup script
      chrome.runtime.sendMessage({ error: error.message });
      console.error(error);
    }
  }

