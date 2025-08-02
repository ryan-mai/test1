import pandas as pd
import numpy as np

# Load your wide EEG dataset CSV file
df = pd.read_csv("F_Relax_A_feature 3.csv")  # Update path if needed

# Drop unnamed column if it exists
df = df.drop(columns=["Unnamed: 0"], errors='ignore')

num_channels = 8  # Channels 0 to 7

def calculate_stress_score(beta, gamma):
    """
    Stress score as beta/gamma ratio with epsilon to avoid div by zero.
    """
    return beta / (gamma + 1e-6)

def classify_stress_level(score):
    if score < 0.8:
        return "Low"
    elif score < 1.5:
        return "Moderate"
    else:
        return "High"

def classify_stress_type(beta, gamma):
    """
    Simple example focusing on beta and gamma only.
    """
    if beta > gamma:
        return "High mental workload / Anxiety"
    else:
        return "Relaxed / Low stress"

results = []

for i, row in df.iterrows():
    beta_sum = 0
    gamma_sum = 0
    
    for ch in range(num_channels):
        beta_sum += float(row[f"{ch}.psd_beta"])
        gamma_sum += float(row[f"{ch}.psd_gamma"])
    
    stress_score = calculate_stress_score(beta_sum, gamma_sum)
    stress_level = classify_stress_level(stress_score)
    stress_type = classify_stress_type(beta_sum, gamma_sum)
    
    results.append({
        'stress_score': round(stress_score, 3),
        'stress_level': stress_level,
        'stress_type': stress_type,
        'beta_sum': beta_sum,
        'gamma_sum': gamma_sum
    })

results_df = pd.DataFrame(results)
output_df = pd.concat([df.reset_index(drop=True), results_df], axis=1)

# Define slices for first 20 and middle 20 rows
first_20 = output_df.iloc[:20]
middle_start = len(output_df) // 2 - 10
middle_20 = output_df.iloc[middle_start:middle_start + 20]

print("First 20 rows summary:")
print(first_20[['beta_sum', 'gamma_sum', 'stress_score', 'stress_level', 'stress_type']])

print("\nMiddle 20 rows summary:")
print(middle_20[['beta_sum', 'gamma_sum', 'stress_score', 'stress_level', 'stress_type']])

# Optional: Summary statistics to compare distributions
print("\nSummary statistics for beta_sum:")
print(output_df[['beta_sum']].describe())

print("\nSummary statistics for gamma_sum:")
print(output_df[['gamma_sum']].describe())

print("\nSummary statistics for stress_score:")
print(output_df[['stress_score']].describe())

# Save output if needed
output_df.to_csv("wide_scale_classified_stress_beta_gamma.csv", index=False)
