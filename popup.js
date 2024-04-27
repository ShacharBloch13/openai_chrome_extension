document.addEventListener('DOMContentLoaded', function() {
  chrome.runtime.sendMessage({ action: "getImprovedText" }, function(response) {
    const commentedCodeContainer = document.getElementById('commentedCode');
    const quizLines = response.text.split('\n');

    quizLines.forEach(line => {
      const lineElement = document.createElement('div');
      lineElement.className = 'code-line';
      const correctAnswerRegex = /(-correct)$/;
      const match = line.match(correctAnswerRegex);
      if (match) {
        const correctAnswerLine = line.replace(correctAnswerRegex, '');
        lineElement.innerHTML = `<span class="correct-answer">${correctAnswerLine}</span>`;
      } else {
        lineElement.textContent = line;
      }
      commentedCodeContainer.appendChild(lineElement);
    });

    setupTextToSpeech(response.text);
  });
});

async function setupTextToSpeech(text) {
  const playButton = document.getElementById('playButton');
  const stopButton = document.getElementById('stopButton');
  const audioElement = document.createElement('audio');
  audioElement.controls = true; // Add if you want to display controls

  playButton.addEventListener('click', async () => {
      if (audioElement.src) {
          audioElement.play();
      } else {
          try {
              const audioContent = await fetchTextToSpeechAudio(text);
              const audioSrc = `data:audio/mp3;base64,${audioContent}`;
              audioElement.src = audioSrc;
              document.body.appendChild(audioElement); // Optional: Append if you want controls
              audioElement.play();
          } catch (error) {
              console.error('Error playing text to speech:', error);
          }
      }
  });

  stopButton.addEventListener('click', () => {
      audioElement.pause();
      audioElement.currentTime = 0;
  });
}

async function fetchTextToSpeechAudio(text) {
  const apiKey = 'AIzaSyDaPaXJmWfl2rPKLbCnLUTIOPRN1GEE02I';
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  const postData = {
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' }
  };

  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
  });

  if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to fetch audio: ${response.status} - ${errorDetails}`);
  }

  const data = await response.json();
  if (data.error) {
      throw new Error(`API Error: ${data.error.message}`);
  }

  return data.audioContent;
}
