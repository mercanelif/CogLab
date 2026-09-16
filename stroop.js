// ========================================
// DOM ELEMENTS
// ========================================

const startButton =
    document.getElementById("startStroopButton");

const wordStimulus =
    document.getElementById("wordStimulus");

const statusText =
    document.getElementById("status");

const progressText =
    document.getElementById("progress");

const resultsList =
    document.getElementById("resultsList");


// ========================================
// TRIAL DATA
// ========================================

let trials = [];
function generateStroopTrials() {

    const colors = [
        "red",
        "green",
        "blue"
    ];

    const generatedTrials = [];

    // Generate congruent trials.
    for (const color of colors) {

        for (let i = 0; i < 4; i++) {

            generatedTrials.push({
                word: color.toUpperCase(),
                inkColor: color,
                condition: "congruent"
            });
        }
    }

    // Generate incongruent trials.
    for (const word of colors) {

        for (const inkColor of colors) {

            if (word !== inkColor) {

                for (let i = 0; i < 2; i++) {

                    generatedTrials.push({
                        word: word.toUpperCase(),
                        inkColor: inkColor,
                        condition: "incongruent"
                    });
                }
            }
        }
    }

    return shuffleArray(generatedTrials);
}
function shuffleArray(array) {

    const shuffled = [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        const temporary = shuffled[i];

        shuffled[i] = shuffled[j];

        shuffled[j] = temporary;
    }

    return shuffled;
}

// ========================================
// EXPERIMENT STATE
// ========================================

let currentTrial = 0;

let results = [];

let stimulusStartTime = null;

let experimentActive = false;

let waitingForResponse = false;

let timerId = null;


// ========================================
// START EXPERIMENT
// ========================================

function startExperiment() {

    currentTrial = 0;

    results = [];
    
    trials = generateStroopTrials();

    experimentActive = true;

    waitingForResponse = false;

    startButton.disabled = true;

    resultsList.innerHTML = "";

    statusText.textContent =
        "Experiment started.";

    showNextTrial();
}


// ========================================
// SHOW TRIAL
// ========================================

function showNextTrial() {

    const trial = trials[currentTrial];

    wordStimulus.textContent =
        trial.word;

    wordStimulus.style.color =
        trial.inkColor;

    wordStimulus.classList.remove("hidden");

    stimulusStartTime =
        performance.now();

    waitingForResponse = true;

    progressText.textContent =
        `Trial ${currentTrial + 1} / ${trials.length}`;

    statusText.textContent =
        "Respond to the ink color!";
}


// ========================================
// KEYBOARD RESPONSE
// ========================================

function handleKeyDown(event) {

    if (!experimentActive) {
        return;
    }

    if (!waitingForResponse) {
        return;
    }

    if (event.repeat) {
        return;
    }

    const keyMapping = {
        KeyR: "red",
        KeyG: "green",
        KeyB: "blue"
    };

    const response =
        keyMapping[event.code];

    if (!response) {
        return;
    }

    event.preventDefault();

    const responseTime =
        performance.now();

    const trial =
        trials[currentTrial];

    const reactionTime =
        Math.round(
            responseTime - stimulusStartTime
        );

    const correct =
        response === trial.inkColor;

    const trialResult = {
        trial: currentTrial + 1,
        word: trial.word,
        inkColor: trial.inkColor,
        condition: trial.condition,
        response: response,
        correct: correct,
        reactionTime: reactionTime
    };

    results.push(trialResult);

    waitingForResponse = false;

    wordStimulus.classList.add("hidden");

    displayResult(trialResult);

    currentTrial++;

    if (currentTrial < trials.length) {

        timerId = setTimeout(
            showNextTrial,
            750
        );

    } else {

        finishExperiment();
    }
}


// ========================================
// DISPLAY RESULT
// ========================================

function displayResult(result) {

    const listItem =
        document.createElement("li");

    listItem.textContent =
        `Trial ${result.trial} | ` +
        `${result.condition} | ` +
        `${result.correct ? "Correct" : "Incorrect"} | ` +
        `${result.reactionTime} ms`;

    resultsList.appendChild(listItem);
}


// ========================================
// FINISH EXPERIMENT
// ========================================

function finishExperiment() {

    experimentActive = false;

    waitingForResponse = false;

    startButton.disabled = false;

    let correctCount = 0;

    for (const result of results) {

        if (result.correct) {
            correctCount++;
        }
    }

    statusText.textContent =
        `Experiment complete! ` +
        `${correctCount} / ${results.length} correct.`;

    console.log("Stroop results:", results);
}


// ========================================
// EVENT LISTENERS
// ========================================

startButton.addEventListener(
    "click",
    startExperiment
);

document.addEventListener(
    "keydown",
    handleKeyDown
);