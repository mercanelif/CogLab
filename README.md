# CogLab

**A web-based platform for cognitive experimentation and behavioral data analysis.**

CogLab is an evolving open-source project designed to conduct cognitive experiments, collect trial-level behavioral data, and support statistical analysis.

The project aims to combine software engineering with cognitive science.

## Current Version

**v0.1 — Reaction Time Experiment Prototype**

The current implementation focuses on reaction-time measurement and temporal predictability.

Participants respond to a visual stimulus by pressing the Space key.

The experiment compares reaction times under two foreperiod conditions.

## Features

### Reaction Time Experiment

- Visual stimulus presentation
- Keyboard response collection
- Reaction-time measurement using `performance.now()`
- Premature-response detection
- Multiple experimental trials

### Practice Phase

Participants complete 3 practice trials before beginning the experiment.

Practice trials are excluded from experimental results, statistical calculations, and exported datasets.

### Experimental Conditions

The experiment includes two conditions.

**Fixed Foreperiod**

- 10 trials
- Stimulus appears after 3000 ms

**Random Foreperiod**

- 10 trials
- Foreperiod values: 1000, 2000, 3000, 4000, and 5000 ms
- Each value occurs twice
- Trial order is randomized

The order of the two experimental blocks is randomized at the beginning of each session.

The total experimental session contains 20 recorded trials.

## Research Question

Does temporal predictability affect reaction time?

**Independent Variable:** Foreperiod predictability

**Dependent Variable:** Reaction time (milliseconds)

The experiment compares reaction-time measurements between fixed and random foreperiod conditions.

The current implementation is an educational research prototype. It is not a validated clinical or diagnostic assessment.

## Descriptive Statistics

CogLab calculates the following statistics separately for each experimental condition:

- Mean reaction time
- Median reaction time
- Sample standard deviation

The application also calculates the difference between the two condition means:

Random Mean RT - Fixed Mean RT

These descriptive results summarize individual sessions. They do not establish statistical significance or causal effects.

## Data Collection

Each experimental trial generates a JavaScript object containing:

- trial
- block
- trialInBlock
- condition
- foreperiod
- reactionTime

Example:

```json
{
  "trial": 7,
  "block": 1,
  "trialInBlock": 7,
  "condition": "random",
  "foreperiod": 4000,
  "reactionTime": 281
}
```

All experimental trial objects are stored in a JavaScript array during the session.

Practice trials are not included in the exported research dataset.

## Data Export

CogLab supports two export formats.

### JSON

Exports structured trial-level experimental data.

The JSON format is suitable for further software processing and future API integration.

### CSV

Exports experimental data as a table.

Each row represents one experimental trial, and each column represents a recorded variable.

The CSV format can be used with analysis tools such as Python Pandas, R, and spreadsheet applications.

## Technologies

Current implementation:

- HTML
- CSS
- JavaScript
- Git
- GitHub

The experiment currently runs entirely in the browser.

No backend server, database, or Python environment is required to run the current version.

## Project Structure

```text
CogLab/
├── index.html
├── style.css
├── app.js
├── README.md
├── PROJECT_CONTEXT.md
└── ARCHITECTURE.md
```

**index.html:** Application structure and interface elements.

**style.css:** Visual design and responsive layout.

**app.js:** Experiment logic, response recording, statistical calculations, and data export.

**PROJECT_CONTEXT.md:** Project goals and development principles.

**ARCHITECTURE.md:** Architecture documentation and future design goals.

## Running Locally

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using a local development server such as the VS Code Live Server extension.
4. Open the local page in a web browser.
5. Complete the practice trials and begin the experiment.

No package installation or build process is currently required.

## Current Limitations

- Reaction-time measurements depend on browser and device timing.
- Stimulus timing is not independently verified against physical display onset.
- The current implementation is not validated for laboratory-grade timing accuracy.
- Results are stored in browser memory during the session and can be exported as files.
- There is no centralized database or participant management system.
- Inferential statistical analysis is not yet implemented.
- The experiment has not been validated as a standardized psychological test.

## Development Roadmap

### Phase 1 — Reaction Time Foundations

- [x] Simple reaction-time measurement
- [x] Multiple trials
- [x] Fixed and random foreperiod conditions
- [x] Practice trials
- [x] Trial-level data collection
- [x] Descriptive statistics
- [x] JSON export
- [x] CSV export
- [x] Interface improvements

### Phase 2 — Scientific Stroop Experiment

- [ ] Congruent and incongruent conditions
- [ ] Randomized trial generation
- [ ] Response accuracy measurement
- [ ] Stroop-effect calculation

### Phase 3 — Research Analysis

- [ ] Python data analysis
- [ ] Pandas
- [ ] Statistical visualization
- [ ] Hypothesis testing
- [ ] Effect-size estimation

### Phase 4 — Full-Stack Development

- [ ] FastAPI backend
- [ ] PostgreSQL database
- [ ] REST API

### Phase 5 — Platform Development

- [ ] Additional cognitive experiments
- [ ] Shared experiment engine
- [ ] Automated tests
- [ ] Researcher mode
- [ ] Experiment configuration
- [ ] Docker deployment
- [ ] Continuous integration

## Long-Term Goal

CogLab aims to become a modular behavioral experimentation and analysis platform supporting research on:

- Attention
- Working memory
- Executive control
- Human decision-making

Future versions will support multiple experiments, configurable experimental parameters, persistent data storage, and reproducible analysis workflows.

## Project Status

Active development — educational and portfolio project.