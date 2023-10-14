document.addEventListener("DOMContentLoaded", function () {
    const quotes = [
      "Ineffable obfuscation enshrouds the labyrinthine recesses of the perspicacious polymath's soliloquy, wherein intricate serendipitous cogitations transcend the nebulous vicissitudes of quotidian existence.",
      "A cacophony of mellifluous sonatas emanated from the grandiloquent orchestral crescendo, enveloping the enraptured audience in a symphonic embrace of ethereal reverie.",
      "The labyrinthine corridors of the esoteric library concealed a compendium of abstruse treatises, each an enigmatic testament to the inscrutable wisdom of antiquity.",
      "In the hermetic world of quantum physics, subatomic particles oscillate in a state of superposition, defying classical notions of determinism and confounding even the most erudite physicists.",
      "The enigmatic chiaroscuro of the nocturnal cityscape concealed myriad secrets within its alleys, where eldritch shadows danced in clandestine rituals.",
      "Her mellifluous voice, imbued with ineffable longing, evoked a bittersweet nostalgia that resonated in the deepest recesses of my heart.",
      "Amidst the palimpsest of history, the enigmatic hieroglyphs of ancient civilizations beckon intrepid archaeologists to decipher the cryptic symbols of bygone eras.",
      "The chef's culinary prowess was exemplified in the exquisitely gastronomic fusion of flavors, a culinary mélange that transcended the mundane.",
      "Within the chiaroscuro of the art gallery, a panoply of avant-garde canvases evoked profound contemplation, each stroke a veritable tapestry of abstract expressionism.",
      "The odyssey of the astronaut, a journey through the inky abyss of space, is a testament to humanity's indomitable spirit in the face of cosmic indifference.",
      "In the abstruse realm of quantum computing, qubits entangle in a dance of superposition, promising to unravel the most complex cryptographic conundrums."
    ];
  
    const quote = document.getElementById("quote");
    const input = document.getElementById("input");
    const result = document.getElementById("result");
    const timer = document.getElementById("timer");
    const restartButton = document.getElementById("restart");
  
    let startTime;
    let endTime;
    let timerInterval;
    let isTestRunning = false;
  
    function getRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    }
  
    function startTest() {
      const randomQuote = getRandomQuote();
      quote.innerText = randomQuote;
      input.value = "";
      input.removeAttribute("disabled");
      input.focus();
      result.innerText = "Start typing to begin the test.";
      timer.innerText = "Time: 0s";
      isTestRunning = false;
      restartButton.setAttribute("disabled", "disabled");
    }
  
    function updateTimer() {
      if (isTestRunning) {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // in seconds
        timer.innerText = `Time: ${Math.round(elapsedTime)}s`;
      }
    }
  
    restartButton.addEventListener("click", function () {
      if (!isTestRunning) {
        startTest();
      }
      quote.style.color = "Black";
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Tab" && event.key === "Enter") {
          // If both "Tab" and "Enter" keys are pressed together, restart the test
          startTest();
        }
      });
  
    input.addEventListener("input", function () {
      if (!isTestRunning) {
        // Start the timer when the user starts typing
        startTime = Date.now();
        isTestRunning = true;
        timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
        restartButton.setAttribute("disabled", "disabled");
      }
  
      const typedText = input.value;
      const originalText = quote.innerText;
      const typedLength = typedText.length;
      let correct = true;
  
      for (let i = 0; i < typedLength; i++) {
        if (typedText[i] !== originalText[i]) {
          correct = false;
          break;
        }
      }
  
      if (correct) {
        quote.style.color = "#000";
      } else {
        quote.style.color = "#ff0000"; // Red color for incorrect characters
      }
  
      if (typedText === originalText) {
        endTest();
      }
    });
  
    function endTest() {
      endTime = Date.now();
      clearInterval(timerInterval);
      const elapsedTime = (endTime - startTime) / 1000; // in seconds
      const wordCount = quote.innerText.split(" ").length;
      const speed = Math.round((wordCount / (elapsedTime / 60))); // in words per minute
      const accuracy = calculateAccuracy(quote.innerText, input.value);
  
      result.innerText = `Your typing speed: ${speed} WPM | Accuracy: ${accuracy}%`;
      quote.style.color = "#00cc00"; // Green color for success
      input.setAttribute("disabled", "disabled");
      isTestRunning = false;
      restartButton.removeAttribute("disabled");
    }
  
    function calculateAccuracy(originalText, typedText) {
      const originalWords = originalText.split(" ");
      const typedWords = typedText.split(" ");
      let correctWords = 0;
  
      for (let i = 0; i < originalWords.length; i++) {
        if (originalWords[i] === typedWords[i]) {
          correctWords++;
        }
      }
  
      return ((correctWords / originalWords.length) * 100).toFixed(2);
    }
  
    // Start the test when the page loads
    startTest();
  });
  