# CogLab Project Context

## Project

CogLab is a Computer Science portfolio project at the intersection of
cognitive science, experimental programming, and behavioral data analysis.

The project focuses on implementing browser-based cognitive experiments,
collecting structured trial-level behavioral data, and analyzing the
resulting datasets with Python.

CogLab is developed as a learning-focused engineering project.
Its purpose is to demonstrate practical skills through a small,
well-documented, and technically meaningful system rather than to compete
with professional cognitive research platforms.

## Primary Goal

The core CogLab workflow is:

Cognitive Question
→ Experimental Design
→ Browser Experiment
→ Trial-Level Behavioral Data
→ JSON / CSV
→ Python / Pandas
→ Data Validation and Cleaning
→ Statistics
→ Visualization
→ Interpretation

The project should demonstrate the connection between experimental software
and behavioral data analysis.

## Core Experiments

CogLab v1.0 focuses on two experiments:

- Reaction Time Experiment
- Stroop Experiment

The goal is depth rather than building a large experiment library.

Each experiment should have:

- a clearly defined experimental question
- explicit experimental conditions
- practice and experimental trial separation where appropriate
- controlled or randomized trial generation
- reaction-time measurement
- accuracy measurement where applicable
- structured trial-level data
- JSON and/or CSV export
- documented analysis methods

## Behavioral Data Analysis

Python-based analysis is a primary part of CogLab rather than an optional
extension.

The analysis workflow will use:

- Python
- Pandas
- Matplotlib
- Jupyter Notebook
- SciPy when appropriate

The analysis layer should include:

- loading exported experiment data
- validating the expected dataset structure
- inspecting missing or invalid values
- filtering data according to documented analysis rules
- condition-based descriptive statistics
- behavioral data visualization
- appropriate statistical comparisons
- effect-size estimation where meaningful
- clear interpretation of results

Statistical methods should be introduced only when they are appropriate for
the experimental design and understood well enough to explain.

## Reproducibility

A key project goal is reproducibility between the browser experiment and the
Python analysis workflow.

Where statistics are calculated in JavaScript, the exported trial-level data
should allow the same values to be independently reproduced in Python.

For example:

Browser Stroop result
→ Export trial-level CSV
→ Analyze with Python
→ Reproduce condition statistics and Stroop effect

This provides both data-analysis practice and an independent validation of
the experiment logic.

## Testing

Testing should focus on scientifically and technically meaningful behavior.

Examples include:

- expected number of generated trials
- correct balance between experimental conditions
- valid trial properties
- correct exclusion of practice trials
- correct accuracy calculations
- correct reaction-time statistics
- correct Stroop-effect calculation
- agreement between browser and Python analysis results

## Out of Scope for v1.0

The following are intentionally outside the CogLab v1.0 scope:

- backend services
- REST APIs
- databases
- authentication
- participant accounts
- researcher dashboards
- large experiment libraries
- AI or machine-learning features
- production-scale research infrastructure

These technologies may be explored in separate portfolio projects where they
solve a more natural problem.

## Development Strategy

The project must be developed incrementally.

### Phase 1 — Reaction Time Experiment

Build a browser-based reaction-time experiment with structured trial data.

Status: Complete

### Phase 2 — Stroop Experiment

Build a balanced Stroop experiment with practice trials, response accuracy,
reaction-time statistics, Stroop-effect calculation, and JSON/CSV export.

Status: Complete

### Phase 3 — Behavioral Data Analysis

Build the initial Python analysis workflow.

Planned work:

- Python analysis environment
- Pandas data loading
- dataset validation
- data cleaning
- condition-based descriptive statistics
- visualization with Matplotlib
- Jupyter analysis notebook
- reproduction of browser-generated statistics

### Phase 4 — Statistical Analysis and Reproducibility

Extend the analysis workflow carefully.

Planned work:

- multiple-session data support
- participant-level summaries
- appropriate inferential statistics
- effect-size estimation
- reproducibility checks
- documented interpretation

### Phase 5 — Quality and Portfolio Finalization

Prepare CogLab as a complete portfolio project.

Planned work:

- automated tests
- code organization and refactoring
- sample datasets
- experimental-design documentation
- analysis-method documentation
- final screenshots and visualizations
- polished README
- v1.0 release

## Development Principles

Prefer depth over feature count.

Do not add a technology unless it supports the CogLab workflow or provides
clear learning value.

Prefer simple and understandable implementations.

Do not introduce unnecessary libraries or infrastructure.

Break complex tasks into small steps.

Prefer readable code over clever code.

Explain architectural and analytical decisions.

Before writing code:

1. Explain what we are going to build.
2. Explain why it belongs in CogLab.
3. Explain the programming or analysis concepts involved.
4. Explain which files will change.
5. Suggest the smallest useful implementation.

After writing code:

1. Explain the code.
2. Explain how to run it.
3. Explain how to test it.
4. Explain how to interpret the result.
5. Explain common errors or limitations.