import pandas as pd
import json

def calculate_stress_json(file_path):
    # Load single-row EEG dataset
    df = pd.read_csv(file_path).head(1)
    
    # Drop unnamed column if it exists
    df = df.drop(columns=["Unnamed: 0"], errors='ignore')
    
    num_channels = 8
    
    # Extract row
    row = df.iloc[0]
    
    # Calculate sums
    beta_sum = sum(float(row[f"{ch}.psd_beta"]) for ch in range(num_channels))
    gamma_sum = sum(float(row[f"{ch}.psd_gamma"]) for ch in range(num_channels))
    
    # Calculate stress values
    stress_score = beta_sum / (gamma_sum + 1e-6)
    stress_level = "Low" if stress_score < 0.8 else "Moderate" if stress_score < 1.5 else "High"
    stress_type = "High mental workload / Anxiety" if beta_sum > gamma_sum else "Relaxed / Low stress"
    
    # Create JSON data (Python dictionary)
    result_data = {
        "stress_score": round(stress_score, 3),
        "stress_level": stress_level,
        "stress_type": stress_type,
        "beta_sum": beta_sum,
        "gamma_sum": gamma_sum
    }
    
    return result_data  # returns dictionary

# Example usage
json_data = calculate_stress_json("F_Relax_A_feature 3.csv")
print(json_data)