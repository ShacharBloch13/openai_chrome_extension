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
      handleSelection(info.selectionText, 'gpt-3.5-turbo', 0.6);
    } else if (info.menuItemId === "improveEnglishCreative") {
      handleSelection(info.selectionText, 'gpt-3.5-turbo', 0.9);
    } else if (info.menuItemId === "addCommentsToCode") {
      handleCodeComments(info.selectionText);
    } else if (info.menuItemId === "summarizeToSingleParagraph") {
      handleSummarize(info.selectionText);
    } else if (info.menuItemId === "generateQuiz") {
        handleGenerateQuiz(info.selectionText);
      }
  });

  


  Aieverywhere_api_key = 'sk-proj-H6HvgrOCw4Hw9j6QUCWhT3BlbkFJn39bmAtunTcVN55Od4Hx'