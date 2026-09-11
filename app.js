const startButton = document.getElementById("startButton");
const statusText = document.getElementById("status");
const stimulus = document.getElementById("stimulus");
const progressText = document.getElementById("progress");
const resultsList = document.getElementById("resultsList");
const conditionInfo = document.getElementById("conditionInfo");
const downloadJsonButton =
    document.getElementById("downloadJsonButton");


const TRIALS_PER_CONDITION = 10;

const FIXED_FOREPERIOD = 3000;

const RANDOM_FOREPERIODS = [
    1000,
    2000,
    3000,
    4000,
    5000,
    1000,
    2000,
    3000,
    4000,
    5000
];

const TOTAL_TRIALS =
    TRIALS_PER_CONDITION * 2;


let currentTrial = 0;
let currentTrialInCondition = 0;

let currentBlockIndex = 0;

let currentCondition = null;
let currentForeperiod = null;

let conditionOrder = [];
let randomForeperiods = [];

let results = [];

let stimulusStartTime = null;
let waitingForResponse = false;
let experimentActive = false;
let timerId = null;


function startExperiment() {

    currentTrial = 0;
    currentTrialInCondition = 0;

    currentBlockIndex = 0;

    currentCondition = null;
    currentForeperiod = null;

    results = [];

    experimentActive = true;
    waitingForResponse = false;

    startButton.disabled = true;
    downloadJsonButton.disabled = true;

    resultsList.innerHTML = "";

    progressText.textContent =
        `Trial 0 / ${TOTAL_TRIALS}`;

    statusText.textContent =
        "Experiment started.";

    if (Math.random() < 0.5) {
        conditionOrder = ["fixed", "random"];
    } else {
        conditionOrder = ["random", "fixed"];
    }

    startCondition();
}


function startCondition() {

    currentCondition =
        conditionOrder[currentBlockIndex];

    currentTrialInCondition = 0;

    if (currentCondition === "random") {

        randomForeperiods =
            shuffleArray(RANDOM_FOREPERIODS);
    }

    let conditionLabel;

    if (currentCondition === "fixed") {
        conditionLabel = "Fixed interval";
    } else {
        conditionLabel = "Random interval";
    }

    conditionInfo.textContent =
        `Block ${currentBlockIndex + 1} / 2: ` +
        conditionLabel;

    prepareNextTrial();
}


function prepareNextTrial() {

    stimulus.classList.add("hidden");

    waitingForResponse = false;

    statusText.textContent =
        "Wait for the green circle...";

    currentForeperiod =
        getForeperiod();

    timerId =
        setTimeout(
            showStimulus,
            currentForeperiod
        );
}


function getForeperiod() {

    if (currentCondition === "fixed") {
        return FIXED_FOREPERIOD;
    }

    return randomForeperiods[
        currentTrialInCondition
    ];
}


function showStimulus() {

    currentTrial =
        currentTrial + 1;

    currentTrialInCondition =
        currentTrialInCondition + 1;

    stimulus.classList.remove("hidden");

    stimulusStartTime =
        performance.now();

    waitingForResponse = true;

    progressText.textContent =
        `Trial ${currentTrial} / ${TOTAL_TRIALS}`;

    statusText.textContent =
        "Press SPACE!";
}


function handleKeyDown(event) {

    if (event.code !== "Space") {
        return;
    }

    if (event.repeat) {
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
            "Too early! Experiment stopped.\n" +
            "Press Start Experiment to try again.";

        conditionInfo.textContent =
            "Experiment stopped";

        startButton.disabled = false;
        downloadJsonButton.disabled = true;

        return;
    }

    const responseTime =
        performance.now();

    const reactionTime =
        responseTime - stimulusStartTime;

    const roundedReactionTime =
        Math.round(reactionTime);


    const trialResult = {

        trial: currentTrial,

        block:
            currentBlockIndex + 1,

        trialInBlock:
            currentTrialInCondition,

        condition:
            currentCondition,

        foreperiod:
            currentForeperiod,

        reactionTime:
            roundedReactionTime
    };


    results.push(trialResult);


    stimulus.classList.add("hidden");

    waitingForResponse = false;


    displayTrialResult(trialResult);


    if (
        currentTrialInCondition
        < TRIALS_PER_CONDITION
    ) {

        prepareNextTrial();

    } else if (
        currentBlockIndex
        < conditionOrder.length - 1
    ) {

        currentBlockIndex =
            currentBlockIndex + 1;

        startCondition();

    } else {

        finishExperiment();
    }
}


function displayTrialResult(trialResult) {

    const listItem =
        document.createElement("li");

    listItem.textContent =
        `Trial ${trialResult.trial} | ` +
        `${trialResult.condition} | ` +
        `Foreperiod: ${trialResult.foreperiod} ms | ` +
        `RT: ${trialResult.reactionTime} ms`;

    resultsList.appendChild(listItem);
}


function calculateMeanForCondition(condition) {

    let total = 0;
    let count = 0;

    for (const result of results) {

        if (result.condition === condition) {

            total =
                total + result.reactionTime;

            count =
                count + 1;
        }
    }

    return total / count;
}


function finishExperiment() {

    experimentActive = false;

    startButton.disabled = false;
    downloadJsonButton.disabled = false;

    const fixedMean =
        calculateMeanForCondition("fixed");

    const randomMean =
        calculateMeanForCondition("random");

    const difference =
        randomMean - fixedMean;


    statusText.textContent =
        "Experiment complete!\n" +
        `Fixed mean RT: ${Math.round(fixedMean)} ms\n` +
        `Random mean RT: ${Math.round(randomMean)} ms\n` +
        `Difference (Random - Fixed): ` +
        `${Math.round(difference)} ms`;


    conditionInfo.textContent =
        `Block order: ` +
        `${conditionOrder[0]} → ` +
        `${conditionOrder[1]}`;


    console.log("Results array:");
    console.log(results);

    const resultsJSON =
        JSON.stringify(results, null, 2);

    console.log("Results as JSON:");
    console.log(resultsJSON);
}


function shuffleArray(array) {

    const shuffled =
        array.slice();

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        const temporaryValue =
            shuffled[i];

        shuffled[i] =
            shuffled[j];

        shuffled[j] =
            temporaryValue;
    }

    return shuffled;
}


function downloadResultsAsJSON() {

    if (results.length === 0) {
        return;
    }

    const resultsJSON =
        JSON.stringify(results, null, 2);

    const blob =
        new Blob(
            [resultsJSON],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "variable-foreperiod-results.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


startButton.addEventListener(
    "click",
    startExperiment
);

document.addEventListener(
    "keydown",
    handleKeyDown
);

downloadJsonButton.addEventListener(
    "click",
    downloadResultsAsJSON
);