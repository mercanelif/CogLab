import json
import math

import pandas as pd


DATA_PATH = "data/sample/stroop_session_sample.csv"
JSON_PATH = "data/sample/stroop_session_sample.json"


df = pd.read_csv(DATA_PATH)

print("First five rows:")
print(df.head())

print("\nDataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nDataset information:")
df.info()

print("\nMissing values:")
print(df.isna().sum())

required_columns = {
    "trial",
    "word",
    "inkColor",
    "condition",
    "response",
    "correct",
    "reactionTime",
}

missing_columns = required_columns - set(df.columns)

if missing_columns:
    raise ValueError(f"Missing required columns: {missing_columns}")

if len(df) != 24:
    raise ValueError(f"Expected 24 experimental trials, found {len(df)}")

print("\nValidation passed:")
print("- All required columns are present.")
print("- Dataset contains 24 experimental trials.")

valid_conditions = {"congruent", "incongruent"}

unexpected_conditions = set(df["condition"].unique()) - valid_conditions

if unexpected_conditions:
    raise ValueError(
        f"Unexpected conditions found: {unexpected_conditions}"
    )

condition_counts = df["condition"].value_counts()

if condition_counts.get("congruent", 0) != 12:
    raise ValueError(
        f"Expected 12 congruent trials, found "
        f"{condition_counts.get('congruent', 0)}"
    )

if condition_counts.get("incongruent", 0) != 12:
    raise ValueError(
        f"Expected 12 incongruent trials, found "
        f"{condition_counts.get('incongruent', 0)}"
    )

print("\nCondition validation passed:")
print(condition_counts)

accuracy_by_condition = (
    df.groupby("condition")["correct"].mean() * 100
)

print("\nAccuracy by condition:")
print(accuracy_by_condition)

correct_trials = df[df["correct"]].copy()

print("\nCorrect trials:")
print(f"{len(correct_trials)} / {len(df)}")

rt_stats = (
    correct_trials
    .groupby("condition")["reactionTime"]
    .agg(["count", "mean", "median", "std"])
)

print("\nReaction-time statistics for correct responses:")
print(rt_stats.round(2))

stroop_effect = (
    rt_stats.loc["incongruent", "mean"]
    - rt_stats.loc["congruent", "mean"]
)

print("\nStroop effect:")
print(f"{stroop_effect:.2f} ms")

with open(JSON_PATH, "r", encoding="utf-8") as file:
    browser_data = json.load(file)

browser_stats = browser_data["statistics"]

browser_congruent = browser_stats["congruent"]
browser_incongruent = browser_stats["incongruent"]
browser_stroop_effect = browser_stats["stroopEffect"]

print("\nBrowser vs Python comparison:")

print(
    f"Congruent mean RT: "
    f"browser={browser_congruent['meanRT']:.2f} ms, "
    f"python={rt_stats.loc['congruent', 'mean']:.2f} ms"
)

print(
    f"Incongruent mean RT: "
    f"browser={browser_incongruent['meanRT']:.2f} ms, "
    f"python={rt_stats.loc['incongruent', 'mean']:.2f} ms"
)

print(
    f"Stroop effect: "
    f"browser={browser_stroop_effect:.2f} ms, "
    f"python={stroop_effect:.2f} ms"
)

checks = {
    "Congruent accuracy": (
        browser_congruent["accuracy"],
        accuracy_by_condition.loc["congruent"],
    ),
    "Incongruent accuracy": (
        browser_incongruent["accuracy"],
        accuracy_by_condition.loc["incongruent"],
    ),
    "Congruent mean RT": (
        browser_congruent["meanRT"],
        rt_stats.loc["congruent", "mean"],
    ),
    "Incongruent mean RT": (
        browser_incongruent["meanRT"],
        rt_stats.loc["incongruent", "mean"],
    ),
    "Congruent median RT": (
        browser_congruent["medianRT"],
        rt_stats.loc["congruent", "median"],
    ),
    "Incongruent median RT": (
        browser_incongruent["medianRT"],
        rt_stats.loc["incongruent", "median"],
    ),
    "Congruent sample SD": (
        browser_congruent["sdRT"],
        rt_stats.loc["congruent", "std"],
    ),
    "Incongruent sample SD": (
        browser_incongruent["sdRT"],
        rt_stats.loc["incongruent", "std"],
    ),
    "Stroop effect": (
        browser_stroop_effect,
        stroop_effect,
    ),
}

all_checks_passed = True

print("\nReproducibility checks:")

for label, (browser_value, python_value) in checks.items():
    passed = math.isclose(
        browser_value,
        python_value,
        rel_tol=1e-9,
        abs_tol=1e-6,
    )

    status = "PASS" if passed else "FAIL"
    print(f"- {label}: {status}")

    if not passed:
        print(f"  Browser: {browser_value}")
        print(f"  Python:  {python_value}")
        all_checks_passed = False

if not all_checks_passed:
    raise AssertionError(
        "Browser and Python analysis results do not match."
    )

print("\nOverall reproducibility check: PASS")