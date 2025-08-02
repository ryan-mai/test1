import sys
import json
import random

def main():
    band_powers = json.loads(sys.argv[1])
    band_to_bpm = {
        "delta": (60, 80),
        "theta": (70, 90),
        "alpha": (80, 110),
        "beta": (110, 140),
        "gamma": (120, 160),
    }
    dominant = max(band_powers, key=band_powers.get)
    bpm_range = band_to_bpm[dominant]
    bpm = random.randint(bpm_range[0], bpm_range[1])
    print(bpm)

if __name__ == "__main__":
    main()