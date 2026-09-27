# CogLab Architecture

## Architecture Goal

CogLab uses a deliberately small architecture focused on the complete
workflow from browser-based cognitive experimentation to behavioral data
analysis.

The architecture should remain simple enough to understand, test, and
explain while still demonstrating meaningful software and data-analysis
concepts.

## Core Workflow

Cognitive Question
↓
Experimental Design
↓
Browser Experiment
↓
Trial-Level Behavioral Data
↓
JSON / CSV Export
↓
Python Analysis
↓
Statistics and Visualization
↓
Interpretation

## Experiment Layer

The cognitive experiments run directly in the browser.

Current technologies:

- HTML
- CSS
- JavaScript

Current experiments:

- Reaction Time Experiment
- Stroop Experiment

The browser layer is responsible for:

- presenting instructions and stimuli
- managing experiment phases
- generating and randomizing trials
- recording participant responses
- measuring reaction time
- determining response accuracy where applicable
- calculating immediate descriptive statistics
- generating structured trial-level data
- exporting results as JSON and CSV

## Behavioral Data Layer

Trial-level behavioral data forms the connection between the experiment
and the analysis workflow.

A trial record may contain fields such as:

- trial number
- experimental condition
- stimulus properties
- participant response
- response accuracy
- reaction time

Practice trials should remain separate from experimental data where
appropriate.

Exported datasets should contain enough information to reproduce the
experiment's reported statistics independently.

## Analysis Layer

Python will be used to analyze exported behavioral data.

Planned tools:

- Python
- Pandas
- Matplotlib
- Jupyter Notebook
- SciPy when statistically appropriate

The analysis layer will be responsible for:

- loading exported datasets
- validating dataset structure
- inspecting missing or invalid values
- applying documented data-cleaning rules
- grouping trials by experimental condition
- calculating descriptive statistics
- visualizing behavioral data
- performing appropriate statistical comparisons
- estimating effect sizes where meaningful
- interpreting results

## Reproducibility

The browser experiment and Python analysis should remain independent enough
to validate one another.

For example:

Browser Stroop Experiment
↓
Trial-Level CSV
↓
Python / Pandas
↓
Recalculate Congruent Statistics
↓
Recalculate Incongruent Statistics
↓
Recalculate Stroop Effect
↓
Compare with Browser Result

Agreement between the JavaScript and Python calculations provides an
additional check on both the experiment logic and analysis workflow.

## Testing

Automated tests should focus on important experiment and analysis behavior.

Examples:

- correct number of generated trials
- balanced experimental conditions
- valid randomized trials
- practice data excluded from experimental results
- correct accuracy calculation
- correct descriptive statistics
- correct effect calculations
- reproducible results between JavaScript and Python

## Scope Boundary

CogLab v1.0 does not require:

- backend services
- REST APIs
- databases
- authentication
- participant account systems
- researcher dashboards
- production-scale infrastructure

The project intentionally prioritizes depth in cognitive experimentation
and behavioral data analysis over full-stack complexity.

## Target v1.0 Architecture

Browser
│
├── Reaction Time Experiment
│
└── Stroop Experiment
        │
        ▼
Structured Trial-Level Data
        │
        ├── JSON
        │
        └── CSV
               │
               ▼
          Python / Pandas
               │
        ┌──────┼──────┐
        ▼      ▼      ▼
   Validation Stats  Visualization
        │      │      │
        └──────┴──────┘
               │
               ▼
         Interpretation