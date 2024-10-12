import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Download, Trash2 } from 'lucide-react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'transcription') {
        setTranscript(prevTranscript => prevTranscript + ' ' + message.text);
      }
    });
  }, []);

  const handleStartStop = () => {
    setIsRecording(!isRecording);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { action: isRecording ? 'stop' : 'start' });
    });
  };

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meeting_transcript.txt';
    a.click();
  };

  const handleClear = () => {
    setTranscript('');
    setSummary('');
  };

  const generateSummary = () => {
    // TODO: Implement AI summary generation
    setSummary('AI-generated summary will appear here.');
  };

  return (
    <div className="w-96 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Meeting Transcriber</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleStartStop}
          className={`flex items-center px-4 py-2 rounded-md ${
            isRecording ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {isRecording ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
          {isRecording ? 'Stop' : 'Start'} Meeting
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={!transcript}
        >
          <Download className="mr-2" /> Download
        </button>
        <button
          onClick={handleClear}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md"
          disabled={!transcript && !summary}
        >
          <Trash2 className="mr-2" /> Clear
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Transcript</h2>
        <div className="h-40 overflow-y-auto bg-gray-100 p-2 rounded">
          {transcript || 'Transcript will appear here...'}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
        <div className="h-40 overflow-y-auto bg-gray-100 p-2 rounded mb-2">
          {summary || 'Summary will appear here after the meeting...'}
        </div>
        <button
          onClick={generateSummary}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded-md"
          disabled={!transcript}
        >
          Generate Summary
        </button>
      </div>
    </div>
  );
}

export default App;