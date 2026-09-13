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
// EXPERIMENT STATE
// ======================================================

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
// START EXPERIMENT
// ======================================================

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

    downloadCsvButton.disabled = true;

    stimulus.classList.add("hidden");

    resultsList.innerHTML = "";

    progressText.textContent =
        `Trial 0 / ${TOTAL_TRIALS}`;

    statusText.textContent =
        "Experiment started.";

    // Randomize block order.
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

    // Shuffle the balanced foreperiod list
    // when entering the random condition.
    if (currentCondition === "random") {

        randomForeperiods =
            shuffleArray(
                RANDOM_FOREPERIODS
            );
    }

    let conditionLabel;

    if (currentCondition === "fixed") {

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
// PREPARE TRIAL
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

    if (currentCondition === "fixed") {

        return FIXED_FOREPERIOD;
    }

    return randomForeperiods[
        currentTrialInCondition
    ];
}


// ======================================================
// SHOW STIMULUS
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

    // Ignore every key except Space.
    if (event.code !== "Space") {

        return;
    }

    // Prevent a held Space key from generating
    // repeated responses.
    if (event.repeat) {

        return;
    }

    event.preventDefault();

    // Ignore Space if experiment is not active.
    if (!experimentActive) {

        return;
    }

    // Premature response:
    // Space was pressed before stimulus appeared.
    if (!waitingForResponse) {

        clearTimeout(timerId);

        experimentActive = false;

        stimulus.classList.add("hidden");

        statusText.textContent =
            "Too early! Experiment stopped.\n" +
            "Press Start Experiment to try again.";

        conditionInfo.textContent =
            "Experiment stopped";

        startButton.disabled = false;

        downloadJsonButton.disabled = true;

        downloadCsvButton.disabled = true;

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

    // One trial = one object.
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

    // Add this trial object
    // to the results array.
    results.push(
        trialResult
    );

    stimulus.classList.add("hidden");

    waitingForResponse = false;

    displayTrialResult(
        trialResult
    );

    // Continue current block.
    if (
        currentTrialInCondition
        <
        TRIALS_PER_CONDITION
    ) {

        prepareNextTrial();

    // Move to second block.
    } else if (
        currentBlockIndex
        <
        conditionOrder.length - 1
    ) {

        currentBlockIndex =
            currentBlockIndex + 1;

        startCondition();

    // Both blocks are complete.
    } else {

        finishExperiment();
    }
}


// ======================================================
// DISPLAY ONE TRIAL RESULT
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
// GET REACTION TIMES FOR ONE CONDITION
// ======================================================

function getReactionTimesForCondition(
    condition
) {

    const reactionTimes = [];

    for (const result of results) {

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

    if (values.length === 0) {

        return 0;
    }

    let total = 0;

    for (const value of values) {

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

    if (values.length === 0) {

        return 0;
    }

    // Copy the array before sorting,
    // so the original data is not changed.
    const sortedValues =
        [...values].sort(
            (a, b) => a - b
        );

    const middleIndex =
        Math.floor(
            sortedValues.length / 2
        );

    // Even number of values:
    // average the two middle values.
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

    // Odd number of values:
    // return the middle value.
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

    if (values.length < 2) {

        return 0;
    }

    const mean =
        calculateMean(
            values
        );

    let squaredDifferenceTotal = 0;

    for (const value of values) {

        const difference =
            value - mean;

        const squaredDifference =
            difference * difference;

        squaredDifferenceTotal =
            squaredDifferenceTotal
            +
            squaredDifference;
    }

    // Sample variance uses n - 1.
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

    startButton.disabled = false;

    downloadJsonButton.disabled = false;

    downloadCsvButton.disabled = false;


    // Separate reaction times
    // by experimental condition.
    const fixedReactionTimes =
        getReactionTimesForCondition(
            "fixed"
        );

    const randomReactionTimes =
        getReactionTimesForCondition(
            "random"
        );


    // Fixed condition statistics.
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


    // Random condition statistics.
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


    // Show summary statistics.
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
        "Fixed reaction times:"
    );

    console.log(
        fixedReactionTimes
    );

    console.log(
        "Random reaction times:"
    );

    console.log(
        randomReactionTimes
    );

    console.log(
        "Results array:"
    );

    console.log(
        results
    );


    const resultsJSON =
        JSON.stringify(
            results,
            null,
            2
        );

    console.log(
        "Results as JSON:"
    );

    console.log(
        resultsJSON
    );
}


// ======================================================
// SHUFFLE ARRAY
// ======================================================

function shuffleArray(array) {

    // Make a copy so the original
    // array is not modified.
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

    if (results.length === 0) {

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

    if (results.length === 0) {

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

    for (const result of results) {

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

downloadCsvButton.addEventListener(
    "click",
    downloadResultsAsCSV
);