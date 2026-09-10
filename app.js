const startButton = document.getElementById("startButton");
const statusText = document.getElementById("status");
const stimulus = document.getElementById("stimulus");

let stimulusStartTime = null;
let waitingForResponse = false;
let experimentActive = false;
let timerId = null;


function startExperiment() {
    experimentActive = true;
    waitingForResponse = false;

    startButton.disabled = true;

    stimulus.classList.add("hidden");

    statusText.textContent = "Wait for the green circle...";

    const randomDelay = Math.floor(Math.random() * 2000) + 1000;

    timerId = setTimeout(showStimulus, randomDelay);
}


function showStimulus() {
    stimulus.classList.remove("hidden");

    stimulusStartTime = performance.now();

    waitingForResponse = true;

    statusText.textContent = "Press SPACE!";
}


function handleKeyDown(event) {

    if (event.code !== "Space") {
        return;
    }

    event.preventDefault();

    if (!experimentActive) {
        return;
    }

    if (!waitingForResponse) {
        clearTimeout(timerId);

        experimentActive = false;

        statusText.textContent = "Too early! Try again.";

        startButton.disabled = false;

        return;
    }

    const responseTime = performance.now();

    const reactionTime = responseTime - stimulusStartTime;

    stimulus.classList.add("hidden");

    waitingForResponse = false;
    experimentActive = false;

    statusText.textContent =
        `Reaction time: ${Math.round(reactionTime)} ms`;

    startButton.disabled = false;
}


startButton.addEventListener("click", startExperiment);

document.addEventListener("keydown", handleKeyDown);