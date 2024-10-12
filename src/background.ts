chrome.runtime.onInstalled.addListener(() => {
  console.log('Meeting Transcriber extension installed');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('meet.google.com') || tab.url.includes('zoom.us')) {
      chrome.action.enable(tabId);
    } else {
      chrome.action.disable(tabId);
    }
  }
});