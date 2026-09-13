// ======================================================
// DOM ELEMENTS
// ======================================================

const startButton =
    document.getElementById("startButton");

const statusText =
    document.getElementById("status");

const stimulus =
    document.getElementById("stimulus");

const progressText =
    document.getElementById("progress");

const resultsList =
    document.getElementById("resultsList");

const conditionInfo =
    document.getElementById("conditionInfo");

const downloadJsonButton =
    document.getElementById("downloadJsonButton");

const downloadCsvButton =
    document.getElementById("downloadCsvButton");


// ======================================================
// EXPERIMENT SETTINGS
// ======================================================

const PRACTICE_TRIALS = 3;

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


// ======================================================
// STATE
// ======================================================

let experimentPhase = "ready";

let currentPracticeTrial = 0;

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


// ======================================================
// START BUTTON CONTROLLER
// ======================================================

function handleStartButton() {

    if (
        experimentPhase === "ready"
        ||
        experimentPhase === "complete"
    ) {

        startPractice();

        return;
    }

    if (
        experimentPhase === "practice-complete"
    ) {

        startExperiment();
    }
}


// ======================================================
// START PRACTICE
// ======================================================

function startPractice() {

    experimentPhase = "practice";

    currentPracticeTrial = 0;

    results = [];

    experimentActive = true;

    waitingForResponse = false;

    startButton.disabled = true;

    downloadJsonButton.disabled = true;

    downloadCsvButton.disabled = true;

    resultsList.innerHTML = "";

    conditionInfo.textContent =
        "Practice phase";

    statusText.textContent =
        "Practice trials are starting.";

    progressText.textContent =
        `Practice 0 / ${PRACTICE_TRIALS}`;

    preparePracticeTrial();
}


// ======================================================
// PREPARE PRACTICE TRIAL
// ======================================================

function preparePracticeTrial() {

    stimulus.classList.add("hidden");

    waitingForResponse = false;

    statusText.textContent =
        "Practice: wait for the green circle...";

    const practiceForeperiod =
        Math.floor(
            Math.random() * 2001
        ) + 1000;

    currentForeperiod =
        practiceForeperiod;

    timerId =
        setTimeout(
            showPracticeStimulus,
            practiceForeperiod
        );
}


// ======================================================
// SHOW PRACTICE STIMULUS
// ======================================================

function showPracticeStimulus() {

    currentPracticeTrial =
        currentPracticeTrial + 1;

    stimulus.classList.remove("hidden");

    stimulusStartTime =
        performance.now();

    waitingForResponse = true;

    progressText.textContent =
        `Practice ${currentPracticeTrial} / ` +
        `${PRACTICE_TRIALS}`;

    statusText.textContent =
        "Practice: press SPACE!";
}


// ======================================================
// FINISH PRACTICE
// ======================================================

function finishPractice() {

    experimentActive = false;

    waitingForResponse = false;

    experimentPhase =
        "practice-complete";

    stimulus.classList.add("hidden");

    conditionInfo.textContent =
        "Practice complete";

    statusText.textContent =
        "Practice complete!\n" +
        "When you are ready, begin the real experiment.";

    progressText.textContent =
        `Practice ${PRACTICE_TRIALS} / ` +
        `${PRACTICE_TRIALS}`;

    startButton.textContent =
        "Begin Experiment";

    startButton.disabled = false;
}


// ======================================================
// START REAL EXPERIMENT
// ======================================================

function startExperiment() {

    experimentPhase =
        "experiment";

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

    downloadCsvButton.disabled = true;

    stimulus.classList.add("hidden");

    resultsList.innerHTML = "";

    progressText.textContent =
        `Trial 0 / ${TOTAL_TRIALS}`;

    statusText.textContent =
        "Experiment started.";

    if (Math.random() < 0.5) {

        conditionOrder = [
            "fixed",
            "random"
        ];

    } else {

        conditionOrder = [
            "random",
            "fixed"
        ];
    }

    startCondition();
}


// ======================================================
// START CONDITION / BLOCK
// ======================================================

function startCondition() {

    currentCondition =
        conditionOrder[currentBlockIndex];

    currentTrialInCondition = 0;

    if (
        currentCondition === "random"
    ) {

        randomForeperiods =
            shuffleArray(
                RANDOM_FOREPERIODS
            );
    }

    let conditionLabel;

    if (
        currentCondition === "fixed"
    ) {

        conditionLabel =
            "Fixed interval";

    } else {

        conditionLabel =
            "Random interval";
    }

    conditionInfo.textContent =
        `Block ${currentBlockIndex + 1} / 2: ` +
        conditionLabel;

    prepareNextTrial();
}


// ======================================================
// PREPARE EXPERIMENTAL TRIAL
// ======================================================

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


// ======================================================
// FOREPERIOD
// ======================================================

function getForeperiod() {

    if (
        currentCondition === "fixed"
    ) {

        return FIXED_FOREPERIOD;
    }

    return randomForeperiods[
        currentTrialInCondition
    ];
}


// ======================================================
// SHOW EXPERIMENTAL STIMULUS
// ======================================================

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


// ======================================================
// KEYBOARD RESPONSE
// ======================================================

function handleKeyDown(event) {

    if (
        event.code !== "Space"
    ) {

        return;
    }

    if (
        event.repeat
    ) {

        return;
    }

    event.preventDefault();

    if (
        !experimentActive
    ) {

        return;
    }

    // Premature response.
    if (
        !waitingForResponse
    ) {

        clearTimeout(timerId);

        experimentActive = false;

        stimulus.classList.add("hidden");

        statusText.textContent =
            "Too early!\n" +
            "Please restart this phase.";

        startButton.disabled = false;

        downloadJsonButton.disabled = true;

        downloadCsvButton.disabled = true;

        if (
            experimentPhase === "practice"
        ) {

            experimentPhase = "ready";

            startButton.textContent =
                "Restart Practice";

            conditionInfo.textContent =
                "Practice stopped";

        } else {

            experimentPhase =
                "practice-complete";

            startButton.textContent =
                "Restart Experiment";

            conditionInfo.textContent =
                "Experiment stopped";
        }

        return;
    }


    const responseTime =
        performance.now();

    const reactionTime =
        responseTime
        -
        stimulusStartTime;

    const roundedReactionTime =
        Math.round(
            reactionTime
        );


    // --------------------------------------
    // PRACTICE RESPONSE
    // --------------------------------------

    if (
        experimentPhase === "practice"
    ) {

        stimulus.classList.add("hidden");

        waitingForResponse = false;

        statusText.textContent =
            `Practice RT: ` +
            `${roundedReactionTime} ms`;

        if (
            currentPracticeTrial
            <
            PRACTICE_TRIALS
        ) {

            preparePracticeTrial();

        } else {

            finishPractice();
        }

        return;
    }


    // --------------------------------------
    // EXPERIMENTAL RESPONSE
    // --------------------------------------

    const trialResult = {

        trial:
            currentTrial,

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


    results.push(
        trialResult
    );


    stimulus.classList.add("hidden");

    waitingForResponse = false;


    displayTrialResult(
        trialResult
    );


    if (
        currentTrialInCondition
        <
        TRIALS_PER_CONDITION
    ) {

        prepareNextTrial();

    } else if (
        currentBlockIndex
        <
        conditionOrder.length - 1
    ) {

        currentBlockIndex =
            currentBlockIndex + 1;

        startCondition();

    } else {

        finishExperiment();
    }
}


// ======================================================
// DISPLAY TRIAL RESULT
// ======================================================

function displayTrialResult(
    trialResult
) {

    const listItem =
        document.createElement("li");

    listItem.textContent =
        `Trial ${trialResult.trial} | ` +
        `${trialResult.condition} | ` +
        `Foreperiod: ${trialResult.foreperiod} ms | ` +
        `RT: ${trialResult.reactionTime} ms`;

    resultsList.appendChild(
        listItem
    );
}


// ======================================================
// GET REACTION TIMES BY CONDITION
// ======================================================

function getReactionTimesForCondition(
    condition
) {

    const reactionTimes = [];

    for (
        const result of results
    ) {

        if (
            result.condition
            ===
            condition
        ) {

            reactionTimes.push(
                result.reactionTime
            );
        }
    }

    return reactionTimes;
}


// ======================================================
// MEAN
// ======================================================

function calculateMean(values) {

    if (
        values.length === 0
    ) {

        return 0;
    }

    let total = 0;

    for (
        const value of values
    ) {

        total =
            total + value;
    }

    return (
        total
        /
        values.length
    );
}


// ======================================================
// MEDIAN
// ======================================================

function calculateMedian(values) {

    if (
        values.length === 0
    ) {

        return 0;
    }

    const sortedValues =
        [...values].sort(
            (a, b) => a - b
        );

    const middleIndex =
        Math.floor(
            sortedValues.length / 2
        );

    if (
        sortedValues.length % 2 === 0
    ) {

        return (
            sortedValues[
                middleIndex - 1
            ]
            +
            sortedValues[
                middleIndex
            ]
        ) / 2;
    }

    return sortedValues[
        middleIndex
    ];
}


// ======================================================
// SAMPLE STANDARD DEVIATION
// ======================================================

function calculateSampleStandardDeviation(
    values
) {

    if (
        values.length < 2
    ) {

        return 0;
    }

    const mean =
        calculateMean(
            values
        );

    let squaredDifferenceTotal = 0;

    for (
        const value of values
    ) {

        const difference =
            value - mean;

        const squaredDifference =
            difference
            *
            difference;

        squaredDifferenceTotal =
            squaredDifferenceTotal
            +
            squaredDifference;
    }

    const variance =
        squaredDifferenceTotal
        /
        (values.length - 1);

    return Math.sqrt(
        variance
    );
}


// ======================================================
// FINISH EXPERIMENT
// ======================================================

function finishExperiment() {

    experimentActive = false;

    experimentPhase =
        "complete";

    startButton.disabled = false;

    startButton.textContent =
        "Start New Session";

    downloadJsonButton.disabled = false;

    downloadCsvButton.disabled = false;


    const fixedReactionTimes =
        getReactionTimesForCondition(
            "fixed"
        );

    const randomReactionTimes =
        getReactionTimesForCondition(
            "random"
        );


    const fixedMean =
        calculateMean(
            fixedReactionTimes
        );

    const fixedMedian =
        calculateMedian(
            fixedReactionTimes
        );

    const fixedSD =
        calculateSampleStandardDeviation(
            fixedReactionTimes
        );


    const randomMean =
        calculateMean(
            randomReactionTimes
        );

    const randomMedian =
        calculateMedian(
            randomReactionTimes
        );

    const randomSD =
        calculateSampleStandardDeviation(
            randomReactionTimes
        );


    const difference =
        randomMean
        -
        fixedMean;


    statusText.textContent =
        "Experiment complete!\n\n" +

        "FIXED CONDITION\n" +
        `Mean RT: ${fixedMean.toFixed(1)} ms\n` +
        `Median RT: ${fixedMedian.toFixed(1)} ms\n` +
        `SD: ${fixedSD.toFixed(1)} ms\n\n` +

        "RANDOM CONDITION\n" +
        `Mean RT: ${randomMean.toFixed(1)} ms\n` +
        `Median RT: ${randomMedian.toFixed(1)} ms\n` +
        `SD: ${randomSD.toFixed(1)} ms\n\n` +

        "COMPARISON\n" +
        "Mean difference (Random - Fixed): " +
        `${difference.toFixed(1)} ms`;


    conditionInfo.textContent =
        "Block order: " +
        `${conditionOrder[0]} → ` +
        `${conditionOrder[1]}`;


    console.log(
        "Results array:"
    );

    console.log(
        results
    );
}


// ======================================================
// SHUFFLE ARRAY
// ======================================================

function shuffleArray(array) {

    const shuffled =
        array.slice();

    for (
        let i =
            shuffled.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random()
                *
                (i + 1)
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


// ======================================================
// DOWNLOAD JSON
// ======================================================

function downloadResultsAsJSON() {

    if (
        results.length === 0
    ) {

        return;
    }

    const resultsJSON =
        JSON.stringify(
            results,
            null,
            2
        );

    const blob =
        new Blob(
            [resultsJSON],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        "variable-foreperiod-results.json";

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );

    URL.revokeObjectURL(
        url
    );
}


// ======================================================
// DOWNLOAD CSV
// ======================================================

function downloadResultsAsCSV() {

    if (
        results.length === 0
    ) {

        return;
    }

    const header = [
        "trial",
        "block",
        "trialInBlock",
        "condition",
        "foreperiod",
        "reactionTime"
    ];

    const rows = [];

    rows.push(
        header.join(",")
    );

    for (
        const result of results
    ) {

        const row = [
            result.trial,
            result.block,
            result.trialInBlock,
            result.condition,
            result.foreperiod,
            result.reactionTime
        ];

        rows.push(
            row.join(",")
        );
    }

    const csvContent =
        rows.join("\n");

    const blob =
        new Blob(
            [csvContent],
            {
                type:
                    "text/csv"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        "variable-foreperiod-results.csv";

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );

    URL.revokeObjectURL(
        url
    );
}


// ======================================================
// EVENT LISTENERS
// ======================================================

startButton.addEventListener(
    "click",
    handleStartButton
);

document.addEventListener(
    "keydown",
    handleKeyDown
);

downloadJsonButton.addEventListener(
    "click",
    downloadResultsAsJSON
);

downloadCsvButton.addEventListener(
    "click",
    downloadResultsAsCSV
);