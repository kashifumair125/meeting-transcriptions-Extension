let recognition: SpeechRecognition | null = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    startRecognition();
  } else if (message.action === 'stop') {
    stopRecognition();
  }
});

function startRecognition() {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      
      chrome.runtime.sendMessage({ type: 'transcription', text: transcript });
    };

    recognition.start();
  } else {
    console.error('Speech recognition not supported in this browser.');
  }
}

function stopRecognition() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}