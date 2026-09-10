const startButton = document.getElementById("startButton");
const statusText = document.getElementById("status");
const stimulus = document.getElementById("stimulus");
const progressText = document.getElementById("progress");
const resultsList = document.getElementById("resultsList");


const TOTAL_TRIALS = 5;

let currentTrial = 0;
let results = [];

let stimulusStartTime = null;
let waitingForResponse = false;
let experimentActive = false;
let timerId = null;


function startExperiment() {
    currentTrial = 0;
    results = [];

    experimentActive = true;
    waitingForResponse = false;

    startButton.disabled = true;

    resultsList.innerHTML = "";

    progressText.textContent =
        `Trial ${currentTrial} / ${TOTAL_TRIALS}`;

    statusText.textContent = "Experiment started.";

    prepareNextTrial();
}


function prepareNextTrial() {
    stimulus.classList.add("hidden");

    waitingForResponse = false;

    statusText.textContent = "Wait for the green circle...";

    const randomDelay =
        Math.floor(Math.random() * 2000) + 1000;

    timerId = setTimeout(showStimulus, randomDelay);
}


function showStimulus() {
    currentTrial = currentTrial + 1;

    stimulus.classList.remove("hidden");

    stimulusStartTime = performance.now();

    waitingForResponse = true;

    progressText.textContent =
        `Trial ${currentTrial} / ${TOTAL_TRIALS}`;

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

        statusText.textContent =
            "Too early! Experiment stopped.";

        startButton.disabled = false;

        return;
    }

    const responseTime = performance.now();

    const reactionTime =
        responseTime - stimulusStartTime;

    const roundedReactionTime =
        Math.round(reactionTime);


    const trialResult = {
        trial: currentTrial,
        reactionTime: roundedReactionTime
    };


    results.push(trialResult);


    stimulus.classList.add("hidden");

    waitingForResponse = false;


    displayTrialResult(trialResult);


    if (currentTrial < TOTAL_TRIALS) {
        prepareNextTrial();
    } else {
        finishExperiment();
    }
}


function displayTrialResult(trialResult) {
    const listItem = document.createElement("li");

    listItem.textContent =
        `Trial ${trialResult.trial}: ` +
        `${trialResult.reactionTime} ms`;

    resultsList.appendChild(listItem);
}


function finishExperiment() {
    experimentActive = false;

    startButton.disabled = false;

    const meanReactionTime =
        calculateMeanReactionTime();

    statusText.textContent =
        `Experiment complete! Mean reaction time: ` +
        `${Math.round(meanReactionTime)} ms`;
}


function calculateMeanReactionTime() {
    let total = 0;

    for (const result of results) {
        total = total + result.reactionTime;
    }

    return total / results.length;
}


startButton.addEventListener(
    "click",
    startExperiment
);

document.addEventListener(
    "keydown",
    handleKeyDown
);