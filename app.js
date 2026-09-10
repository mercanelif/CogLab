const startButton = document.getElementById("startButton");
const statusText = document.getElementById("status");

function startExperiment() {
    statusText.textContent = "Experiment started.";
}

startButton.addEventListener("click", startExperiment);