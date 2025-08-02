import numpy as np

def calculate_bpm(band_data, baseline=None):
    """
    Improved BPM calculation using normalized EEG band powers and non-linear mapping.
    """
    # Default baseline (could come from calibration)
    baseline = baseline or {
        'delta': 20, 'theta': 20, 'alpha': 20, 'beta': 20, 'gamma': 20
    }
    
    # Z-score normalization
    z_scores = {}
    for band in band_data:
        z_scores[band] = (band_data[band] - baseline.get(band, 0)) / (baseline.get(band, 1) or 1)

    # Weighted combination (more weight to alpha & beta shifts)
    score = (0.2 * z_scores['delta'] +
             0.2 * z_scores['theta'] +
             0.3 * -z_scores['alpha'] +  # negative alpha means more arousal
             0.3 * z_scores['beta'] +
             0.2 * z_scores['gamma'])
    
    # Logistic mapping to BPM range (60–180)
    bpm_min, bpm_max = 60, 180
    bpm = bpm_min + (bpm_max - bpm_min) / (1 + np.exp(-score))
    
    return round(bpm)