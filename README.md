# CogLab

**A web-based platform for cognitive experimentation and behavioral data analysis.**

CogLab is an evolving open-source project designed to conduct cognitive experiments, collect trial-level behavioral data, and support statistical analysis.

The project aims to combine software engineering with cognitive science.

## Current Version

**v0.2 — Reaction Time and Stroop Experiment Prototype**

CogLab currently includes two browser-based cognitive experiments:

- Reaction Time Experiment
- Stroop Experiment

The Reaction Time Experiment investigates temporal predictability by comparing fixed and randomized foreperiod conditions.

The Stroop Experiment investigates cognitive interference by comparing congruent and incongruent color-word trials.

Both experiments collect trial-level behavioral data directly in the browser.

The current implementation supports:

- Practice phases
- Randomized experimental trials
- Reaction-time measurement using `performance.now()`
- Condition-specific descriptive statistics
- Trial-level behavioral data collection
- JSON and CSV data export

The project is currently an educational and portfolio-oriented research prototype. It is not intended for clinical or diagnostic use.

## Features

### Reaction Time Experiment

- Visual stimulus presentation
- Keyboard response collection
- Reaction-time measurement using `performance.now()`
- Premature-response detection
- Multiple experimental trials
- Fixed and random foreperiod conditions
- Practice trials
- Condition-specific descriptive statistics
- JSON and CSV export

### Reaction Time Practice Phase

Participants complete 3 practice trials before beginning the experiment.

Practice trials are excluded from experimental results, statistical calculations, and exported datasets.

### Reaction Time Experimental Conditions

The experiment includes two conditions.

#### Fixed Foreperiod

- 10 trials
- Stimulus appears after 3000 ms

#### Random Foreperiod

- 10 trials
- Foreperiod values: 1000, 2000, 3000, 4000, and 5000 ms
- Each value occurs twice
- Trial order is randomized

The order of the two experimental blocks is randomized at the beginning of each session.

The total Reaction Time experimental session contains 20 recorded trials.

---

### Stroop Experiment

The Stroop Experiment measures response accuracy and reaction time under congruent and incongruent color-word conditions.

Participants respond to the **ink color** of the displayed word using the keyboard:

- `R` = Red
- `G` = Green
- `B` = Blue

The experiment includes:

- 6 practice trials
- 24 experimental trials
- 12 congruent trials
- 12 incongruent trials
- Randomized trial order
- Accuracy measurement
- Reaction-time measurement
- Condition-specific descriptive statistics
- Stroop-effect calculation
- JSON and CSV export

### Stroop Practice Phase

Participants complete 6 practice trials before beginning the experimental phase.

The practice set contains:

- 3 congruent trials
- 3 incongruent trials

Participants receive correct or incorrect feedback during practice.

Practice trials are excluded from experimental results, statistical calculations, and exported datasets.

### Stroop Experimental Conditions

#### Congruent

The word meaning and ink color are the same.

Example:

`RED` displayed in red.

#### Incongruent

The word meaning and ink color are different.

Example:

`RED` displayed in blue.

The experimental session contains exactly 24 recorded trials:

- 12 congruent
- 12 incongruent

Trial order is randomized for each session.

## Research Questions

### Reaction Time Experiment

**Research question:**
Does temporal predictability affect reaction time?

**Independent Variable:** Foreperiod predictability

**Dependent Variable:** Reaction time in milliseconds

The experiment compares reaction-time measurements between fixed and random foreperiod conditions.

### Stroop Experiment

**Research question:**
Does color-word incongruence increase reaction time relative to congruent trials?

**Independent Variable:** Stroop condition

- Congruent
- Incongruent

**Dependent Variables:**

- Reaction time in milliseconds
- Response accuracy

The current implementation is an educational research prototype. It is not a validated clinical, diagnostic, or standardized psychological assessment.

## Descriptive Statistics

### Reaction Time Experiment

CogLab calculates the following statistics separately for each experimental condition:

- Mean reaction time
- Median reaction time
- Sample standard deviation

The application also calculates the difference between the two condition means:

```text
Random Mean RT - Fixed Mean RT
```

### Stroop Experiment

CogLab calculates statistics separately for congruent and incongruent conditions.

For each condition, the application reports:

- Accuracy
- Mean reaction time for correct responses
- Median reaction time for correct responses
- Sample standard deviation for correct responses

Incorrect responses are excluded from reaction-time statistics.

The Stroop effect is calculated as:

```text
Mean RT (Incongruent) - Mean RT (Congruent)
```

A positive value indicates that responses were slower, on average, during incongruent trials.

These descriptive statistics summarize individual experimental sessions. They do not establish statistical significance or causal effects.

## Data Collection

CogLab currently stores experimental data in JavaScript arrays during each browser session.

Practice trials are kept separate from experimental datasets.

### Reaction Time Trial Data

Each recorded Reaction Time trial contains information such as:

- `trial`
- `block`
- `trialInBlock`
- `condition`
- `foreperiod`
- `reactionTime`

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

### Stroop Trial Data

Each recorded Stroop trial contains:

- `trial`
- `word`
- `inkColor`
- `condition`
- `response`
- `correct`
- `reactionTime`

Example:

```json
{
  "trial": 4,
  "word": "RED",
  "inkColor": "blue",
  "condition": "incongruent",
  "response": "blue",
  "correct": true,
  "reactionTime": 684
}
```

Practice trials are not included in exported experimental datasets.

## Data Export

CogLab supports JSON and CSV export.

Export controls are displayed after an experiment has been completed.

### JSON

JSON provides structured experimental data suitable for:

- Further software processing
- Programmatic analysis
- Future API integration
- Reproducible research workflows

For the Stroop Experiment, the JSON export includes the experimental trials together with descriptive statistics and the calculated Stroop effect.

### CSV

CSV exports trial-level experimental data in tabular form.

Each row represents one experimental trial and each column represents a recorded variable.

CSV files can be used with tools such as:

- Python
- Pandas
- R
- Excel
- Other spreadsheet applications

Practice trials are excluded from exported datasets.

## Technologies

Current implementation:

- HTML
- CSS
- JavaScript
- Git
- GitHub

The experiments currently run entirely in the browser.

No backend server, database, Python environment, package installation, or build process is required to run the current version.

## Project Structure

```text
CogLab/
├── index.html
├── app.js
├── stroop.html
├── stroop.js
├── style.css
├── README.md
├── PROJECT_CONTEXT.md
└── ARCHITECTURE.md
```

**index.html:** Reaction Time Experiment interface.

**app.js:** Reaction Time Experiment logic, response recording, statistical calculations, and data export.

**stroop.html:** Stroop Experiment interface.

**stroop.js:** Stroop trial generation, participant flow, response recording, descriptive statistics, Stroop-effect calculation, and data export.

**style.css:** Shared visual design and interface styling.

**README.md:** Project overview, implemented features, usage instructions, and development roadmap.

**PROJECT_CONTEXT.md:** Project goals and development principles.

**ARCHITECTURE.md:** Architecture documentation and future design goals.

## Running Locally

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Run the project using a local development server such as the VS Code Live Server extension.
4. Open `index.html` to run the Reaction Time Experiment.
5. Open `stroop.html` to run the Stroop Experiment.
6. Complete the practice phase before beginning the selected experiment.

No package installation or build process is currently required.

## Current Limitations

- Reaction-time measurements depend on browser, operating-system, and device timing.
- Stimulus timing is not independently verified against physical display onset.
- The current implementation is not validated for laboratory-grade timing accuracy.
- Results are stored in browser memory during each session.
- There is no centralized database or participant-management system.
- Inferential statistical analysis is not yet implemented.
- Effect-size estimation is not yet implemented.
- Automated testing is not yet implemented.
- The experiments have not been validated as standardized psychological tests.
- The current implementation should not be used for clinical or diagnostic assessment.

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

- [x] Congruent and incongruent conditions
- [x] Balanced experimental trial generation
- [x] Randomized trial order
- [x] Practice phase
- [x] Response accuracy measurement
- [x] Reaction-time measurement
- [x] Condition-specific descriptive statistics
- [x] Stroop-effect calculation
- [x] JSON export
- [x] CSV export

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

Future versions may support multiple configurable experiments, persistent data storage, participant management, reproducible analysis workflows, and research-oriented configuration tools.

## Project Status

**Active development — educational, research-oriented, and portfolio project.**

The current browser-based prototype includes two functional cognitive experiments and serves as the foundation for future statistical-analysis and full-stack development.