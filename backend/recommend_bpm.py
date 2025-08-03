import pandas as pd
import numpy as np

def get_bpm_genre(uploaded_file_path):
    df = pd.read_csv(uploaded_file_path)

    # Extract relative powers for all channels
    alpha_cols = [col for col in df.columns if "alpha_rel_power" in col]
    beta_cols = [col for col in df.columns if "beta_rel_power" in col]
    theta_cols = [col for col in df.columns if "theta_rel_power" in col]
    delta_cols = [col for col in df.columns if "delta_rel_power" in col]
    gamma_cols = [col for col in df.columns if "gamma_rel_power" in col]

    # Calculate mean relative power, replacing NaN with 0
    alpha_mean = df[alpha_cols].mean(axis=1).fillna(0).iloc[0]
    beta_mean = df[beta_cols].mean(axis=1).fillna(0).iloc[0]
    theta_mean = df[theta_cols].mean(axis=1).fillna(0).iloc[0]
    delta_mean = df[delta_cols].mean(axis=1).fillna(0).iloc[0]
    gamma_mean = df[gamma_cols].mean(axis=1).fillna(0).iloc[0]

    # Normalize (avoid extreme scaling issues)
    alpha_norm = np.clip(alpha_mean, 0, 1)
    beta_norm = np.clip(beta_mean, 0, 1)
    theta_norm = np.clip(theta_mean, 0, 1)

    # Weighted calmness score (alpha weight > theta)
    calmness_score = (1.2 * alpha_norm + 0.8 * theta_norm) / (beta_norm + 1e-6)

    # Smooth mapping with sigmoid-like scaling
    bpm_range = (50, 130)
    scaled_score = 1 / (1 + np.exp(- (calmness_score - 1)))
    bpm = bpm_range[0] + (bpm_range[1] - bpm_range[0]) * scaled_score

    # Replace any possible NaN with 0 in wave_data
    wave_data = {
        "alpha_mean": float(np.nan_to_num(alpha_mean)),
        "beta_mean": float(np.nan_to_num(beta_mean)),
        "theta_mean": float(np.nan_to_num(theta_mean)),
        "delta_mean": float(np.nan_to_num(delta_mean)),
        "gamma_mean": float(np.nan_to_num(gamma_mean)),
        "calmness_score": float(np.nan_to_num(calmness_score)),
    }

    return round(float(np.nan_to_num(bpm)), 2), wave_data