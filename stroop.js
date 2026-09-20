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

// ========================================
// PRACTICE TRIAL GENERATOR
// ========================================

function generatePracticeTrials() {

    const colors = [
        "red",
        "green",
        "blue"
    ];

    const practiceTrials = [];

    for (let i = 0; i < colors.length; i++) {

        const color = colors[i];

        // Congruent trial
        practiceTrials.push({
            word: color.toUpperCase(),
            inkColor: color,
            condition: "congruent"
        });

        // Incongruent trial
        const differentColor =
            colors[(i + 1) % colors.length];

        practiceTrials.push({
            word: color.toUpperCase(),
            inkColor: differentColor,
            condition: "incongruent"
        });
    }

    return shuffleArray(practiceTrials);
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

// Current phase of the application.
let experimentPhase = "ready";

// Practice trials are stored separately.
let practiceTrials = [];

// Current trial index.
let currentTrial = 0;

// Only real experimental results go here.
let results = [];

let stimulusStartTime = null;

let experimentActive = false;

let waitingForResponse = false;

let timerId = null;

// ========================================
// START PRACTICE
// ========================================

function startPractice() {

    clearTimeout(timerId);

    experimentPhase = "practice";

    practiceTrials = generatePracticeTrials();

    currentTrial = 0;

    results = [];

    experimentActive = true;

    waitingForResponse = false;

    startButton.disabled = true;

    wordStimulus.classList.add("hidden");

    resultsList.innerHTML = "";

    statusText.textContent =
        "Practice started. Respond to the ink color!";

    progressText.textContent =
        `Practice 0 / ${practiceTrials.length}`;

    showNextTrial();
}


// ========================================
// START BUTTON CONTROLLER
// ========================================

function handleStartButton() {

    if (
        experimentPhase === "ready" ||
        experimentPhase === "complete"
    ) {

        startPractice();

    } else if (
        experimentPhase === "practice-complete"
    ) {

        startExperiment();
    }
}

// ========================================
// START EXPERIMENT
// ========================================

function startExperiment() {
   
    experimentPhase = "experiment";

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
// GET CURRENT TRIAL LIST
// ========================================

function getCurrentTrials() {

    if (experimentPhase === "practice") {

        return practiceTrials;

    }

    return trials;
}

// ========================================
// SHOW TRIAL
// ========================================

function showNextTrial() {

    const activeTrials = getCurrentTrials();

    const trial = activeTrials[currentTrial];

    wordStimulus.textContent =
        trial.word;

    wordStimulus.style.color =
        trial.inkColor;

    wordStimulus.classList.remove("hidden");

    stimulusStartTime =
        performance.now();

    waitingForResponse = true;

    progressText.textContent =
    experimentPhase === "practice"
        ? `Practice ${currentTrial + 1} / ${activeTrials.length}`
        : `Trial ${currentTrial + 1} / ${activeTrials.length}`;

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

    const response = keyMapping[event.code];

    if (!response) {
        return;
    }

    event.preventDefault();

    const responseTime = performance.now();

    // Select the correct trial list.
    const activeTrials = getCurrentTrials();

    const trial = activeTrials[currentTrial];

    const reactionTime = Math.round(
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

    // Stop accepting responses.
    waitingForResponse = false;

    // Hide stimulus.
    wordStimulus.classList.add("hidden");


    // ====================================
    // PRACTICE RESPONSE
    // ====================================

    if (experimentPhase === "practice") {

        if (correct) {

            statusText.textContent =
                "Correct!";

        } else {

            statusText.textContent =
                `Incorrect! Correct color: ${trial.inkColor}`;
        }

    }


    // ====================================
    // EXPERIMENTAL RESPONSE
    // ====================================

    else if (experimentPhase === "experiment") {

        results.push(trialResult);

        displayResult(trialResult);
    }


    // ====================================
    // MOVE TO NEXT TRIAL
    // ====================================

    currentTrial++;

    if (currentTrial < activeTrials.length) {

        timerId = setTimeout(
            showNextTrial,
            750
        );

    } else if (experimentPhase === "practice") {

        // Allow final practice feedback
        // to remain visible for 750 ms.

        timerId = setTimeout(
            finishPractice,
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
// FINISH PRACTICE
// ========================================

function finishPractice() {

    experimentPhase = "practice-complete";

    experimentActive = false;

    waitingForResponse = false;

    wordStimulus.classList.add("hidden");

    startButton.disabled = false;

    startButton.textContent =
        "Begin Experiment";

    statusText.textContent =
        "Practice complete! " +
        "You are ready to begin the experiment.";

    progressText.textContent =
        `Practice ${practiceTrials.length} / ` +
        `${practiceTrials.length}`;
}
// ========================================
// FINISH EXPERIMENT
// ========================================

function finishExperiment() {

    experimentPhase = "complete";
    
    experimentActive = false;

    waitingForResponse = false;

    startButton.disabled = false;

    startButton.textContent = "Start New Session";

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
    handleStartButton
);

document.addEventListener(
    "keydown",
    handleKeyDown
);