# CogLab

**Cognitive Experiments · Behavioral Data · Analysis**

CogLab is a Computer Science portfolio project at the intersection of
cognitive science, experimental programming, and behavioral data analysis.

The project focuses on implementing browser-based cognitive experiments,
collecting structured trial-level behavioral data, and developing a
reproducible Python-based analysis workflow for the resulting datasets.

The current implementation includes Reaction Time and Stroop experiments
built with HTML, CSS, and JavaScript.

## Current Version

**v0.2 — Reaction Time and Stroop Experiment Prototype**

CogLab currently includes two browser-based cognitive experiments:

- Reaction Time Experiment
- Stroop Experiment

The Reaction Time Experiment investigates temporal predictability by
comparing fixed and randomized foreperiod conditions.

The Stroop Experiment investigates cognitive interference by comparing
congruent and incongruent color-word trials.

Both experiments collect trial-level behavioral data directly in the browser.

The current implementation supports:

- Practice phases
- Randomized experimental trials
- Reaction-time measurement using `performance.now()`
- Condition-specific descriptive statistics
- Trial-level behavioral data collection
- JSON and CSV data export

CogLab is currently an educational and portfolio-oriented experimental
prototype. It is not intended for clinical or diagnostic use.

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

Practice trials are excluded from experimental results, statistical
calculations, and exported datasets.

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

The order of the two experimental blocks is randomized at the beginning of
each session.

The total Reaction Time experimental session contains 20 recorded trials.

---

### Stroop Experiment

The Stroop Experiment measures response accuracy and reaction time under
congruent and incongruent color-word conditions.

Participants respond to the **ink color** of the displayed word using the
keyboard:

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

Participants complete 6 practice trials before beginning the experimental
phase.

The practice set contains:

- 3 congruent trials
- 3 incongruent trials

Participants receive correct or incorrect feedback during practice.

Practice trials are excluded from experimental results, statistical
calculations, and exported datasets.

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

The experiment compares reaction-time measurements between fixed and random
foreperiod conditions.

### Stroop Experiment

**Research question:**

Does color-word incongruence increase reaction time relative to congruent
trials?

**Independent Variable:** Stroop condition

- Congruent
- Incongruent

**Dependent Variables:**

- Reaction time in milliseconds
- Response accuracy

The current implementation is an educational experimental prototype. It is
not a validated clinical, diagnostic, or standardized psychological
assessment.

## Descriptive Statistics

### Reaction Time Experiment

CogLab calculates the following statistics separately for each experimental
condition:

- Mean reaction time
- Median reaction time
- Sample standard deviation

The application also calculates the difference between the two condition
means:

```text
Random Mean RT - Fixed Mean RT