# CogLab

**Cognitive Experiments · Behavioral Data · Reproducible Analysis**

CogLab is a Computer Science portfolio project at the intersection of
cognitive science, experimental programming, and behavioral data analysis.

The project focuses on implementing browser-based cognitive experiments,
collecting structured trial-level behavioral data, and developing a
reproducible Python-based analysis workflow for the resulting datasets.

CogLab currently includes Reaction Time and Stroop experiments implemented
with HTML, CSS, and JavaScript, together with a Python/Pandas analysis
workflow for exported Stroop data.

---

## Current Version

**v1.0 — CogLab Portfolio MVP**

CogLab v1.0 combines browser-based cognitive experimentation with a
reproducible behavioral-data analysis workflow.

The project currently includes:

- Reaction Time Experiment
- Stroop Experiment
- Practice and experimental phases
- Trial-level behavioral data collection
- Reaction-time and accuracy measurements
- Condition-specific descriptive statistics
- JSON and CSV data export
- Python/Pandas analysis pipeline for Stroop data
- Browser-to-Python reproducibility checks
- Matplotlib behavioral-data visualizations
- Jupyter Notebook analysis report

The browser experiments are implemented with:

- HTML
- CSS
- JavaScript

The analysis workflow uses:

- Python
- Pandas
- Matplotlib
- Jupyter Notebook

to validate, summarize, visualize, and interpret exported behavioral data.

CogLab is an educational, research-oriented, and portfolio-focused project.
It is not intended for clinical or diagnostic use.

---

# Experiments

## Reaction Time Experiment

The Reaction Time Experiment investigates whether temporal predictability
affects response speed.

Participants respond to a visual stimulus as quickly as possible.

The experiment includes:

- visual stimulus presentation
- keyboard response collection
- reaction-time measurement using `performance.now()`
- premature-response detection
- practice trials
- fixed and random foreperiod conditions
- randomized experimental structure
- condition-specific descriptive statistics
- JSON and CSV export

---

## Reaction Time Practice Phase

Participants complete **3 practice trials** before beginning the experiment.

Practice trials are excluded from:

- experimental results
- statistical calculations
- exported datasets

---

## Reaction Time Experimental Conditions

The experiment contains two experimental conditions.

### Fixed Foreperiod

- 10 trials
- stimulus appears after 3000 ms

### Random Foreperiod

- 10 trials
- foreperiod values:

  - 1000 ms
  - 2000 ms
  - 3000 ms
  - 4000 ms
  - 5000 ms

- each foreperiod value occurs twice
- trial order is randomized

The order of the two experimental blocks is randomized at the beginning of
each session.

The complete Reaction Time experimental session therefore contains:

**20 recorded experimental trials**

---

# Stroop Experiment

The Stroop Experiment investigates cognitive interference by comparing
congruent and incongruent color-word trials.

Participants are instructed to respond to the **ink color** of the displayed
word rather than the meaning of the word.

Keyboard responses:

- `R` = Red
- `G` = Green
- `B` = Blue

The experiment includes:

- 6 practice trials
- 24 experimental trials
- 12 congruent trials
- 12 incongruent trials
- randomized trial order
- response-accuracy measurement
- reaction-time measurement
- descriptive statistics
- Stroop-effect calculation
- JSON export
- CSV export

---

## Stroop Practice Phase

Participants complete **6 practice trials** before beginning the experimental
phase.

The practice phase contains:

- 3 congruent trials
- 3 incongruent trials

Participants receive immediate correct or incorrect feedback during practice.

Practice trials are excluded from:

- experimental results
- statistical calculations
- exported datasets

---

## Stroop Experimental Conditions

### Congruent

The word meaning and ink color are the same.

Example:

`RED` displayed in red.

### Incongruent

The word meaning and ink color are different.

Example:

`RED` displayed in blue.

The experimental session contains exactly:

- 12 congruent trials
- 12 incongruent trials

for a total of:

**24 recorded experimental trials**

Trial order is randomized for each experimental session.

---

# Research Questions

## Reaction Time Experiment

### Research Question

**Does temporal predictability affect reaction time?**

### Independent Variable

Foreperiod predictability:

- Fixed
- Random

### Dependent Variable

Reaction time in milliseconds.

The experiment compares reaction-time measurements between the fixed and
random foreperiod conditions.

---

## Stroop Experiment

### Research Question

**Does color-word incongruence increase reaction time relative to congruent
trials?**

### Independent Variable

Stroop condition:

- Congruent
- Incongruent

### Dependent Variables

- reaction time in milliseconds
- response accuracy

---

# Behavioral Data Collection

CogLab collects behavioral data at the individual-trial level.

This allows each experimental response to be inspected and analyzed
independently.

For the Stroop experiment, exported trial-level data contains:

```text
trial
word
inkColor
condition
response
correct
reactionTime