#!/usr/bin/env python3
"""
Calculate Cohen's kappa for inter-rater reliability between Pista and Winds2Ventures scores.
"""

import numpy as np
import pandas as pd
from sklearn.metrics import cohen_kappa_score
import matplotlib.pyplot as plt
import seaborn as sns

# Data extracted from Pitch_Comparisons_New_Scores.txt
# Overall scores for Pista and Winds2Ventures (Investibility)
data = {
    'Pitch': [
        'Aerovisio', 'Assistme', 'Assistme2', 'CampoRapido', 'Coontent', 'Corptech',
        'Finnaid', 'Fitly', 'HHCoders', 'MatchIt', 'Math4Me', 'Mediflow', 'Myok',
        'PolyGlobe', 'Prosilta', 'Rideshare', 'saunaYou&Me', 'Serenity', 'Shieldskin',
        'Sundove', 'UnversitAI', 'Whopika'
    ],
    'Pista_Overall': [
        5.3, 4.9, 6.2, 4.2, 6.0, 6.3, 5.0, 5.6, 4.8, 5.3, 4.6, 6.1, 6.1, 5.8, 5.8,
        4.1, 5.5, 6.0, 5.7, 5.0, 4.0, 5.7
    ],
    'W2V_Investibility': [
        4.5, 5.4, 4.4, 4.5, 5.3, 6.0, 5.5, 4.7, 4.5, 6.4, 4.5, 4.5, 6.4, 6.4, 5.4,
        4.5, 5.5, 6.1, 5.0, 5.0, 4.3, 5.5
    ]
}

df = pd.DataFrame(data)

def scores_to_categories(scores, thresholds=[4.0, 5.5, 7.0]):
    """
    Convert continuous scores to categorical ratings.
    Default thresholds create 4 categories:
    - Poor (< 4.0)
    - Fair (4.0-5.4)
    - Good (5.5-6.9)
    - Excellent (>= 7.0)
    """
    categories = []
    for score in scores:
        if score < thresholds[0]:
            categories.append('Poor')
        elif score < thresholds[1]:
            categories.append('Fair')
        elif score < thresholds[2]:
            categories.append('Good')
        else:
            categories.append('Excellent')
    return categories

def calculate_weighted_kappa(rater1, rater2):
    """Calculate weighted Cohen's kappa for ordinal data."""
    from sklearn.metrics import cohen_kappa_score
    
    # Convert to numeric for weighted calculation
    mapping = {'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4}
    rater1_num = [mapping[cat] for cat in rater1]
    rater2_num = [mapping[cat] for cat in rater2]
    
    # Calculate weighted kappa (quadratic weights for ordinal data)
    weighted_kappa = cohen_kappa_score(rater1_num, rater2_num, weights='quadratic')
    return weighted_kappa

# Convert scores to categorical ratings
df['Pista_Category'] = scores_to_categories(df['Pista_Overall'])
df['W2V_Category'] = scores_to_categories(df['W2V_Investibility'])

# Calculate Cohen's kappa
kappa = cohen_kappa_score(df['Pista_Category'], df['W2V_Category'])
weighted_kappa = calculate_weighted_kappa(df['Pista_Category'], df['W2V_Category'])

# Calculate correlation
correlation = df['Pista_Overall'].corr(df['W2V_Investibility'])

# Print results
print("=== Inter-Rater Reliability Analysis ===")
print(f"Number of pitches evaluated: {len(df)}")
print(f"Cohen's Kappa (unweighted): {kappa:.3f}")
print(f"Cohen's Kappa (weighted): {weighted_kappa:.3f}")
print(f"Pearson correlation: {correlation:.3f}")

# Interpretation of kappa values
def interpret_kappa(kappa_value):
    if kappa_value < 0:
        return "Poor agreement (worse than chance)"
    elif kappa_value < 0.20:
        return "Slight agreement"
    elif kappa_value < 0.40:
        return "Fair agreement"
    elif kappa_value < 0.60:
        return "Moderate agreement"
    elif kappa_value < 0.80:
        return "Substantial agreement"
    else:
        return "Almost perfect agreement"

print(f"\nInterpretation:")
print(f"Unweighted kappa: {interpret_kappa(kappa)}")
print(f"Weighted kappa: {interpret_kappa(weighted_kappa)}")

# Create confusion matrix
from sklearn.metrics import confusion_matrix
import pandas as pd

categories = ['Poor', 'Fair', 'Good', 'Excellent']
cm = confusion_matrix(df['Pista_Category'], df['W2V_Category'], labels=categories)
cm_df = pd.DataFrame(cm, index=categories, columns=categories)

print(f"\nConfusion Matrix:")
print(cm_df)

# Calculate agreement percentage
total_agreements = np.sum(np.diag(cm))
total_cases = len(df)
agreement_percentage = (total_agreements / total_cases) * 100

print(f"\nExact agreement: {total_agreements}/{total_cases} ({agreement_percentage:.1f}%)")

# Summary statistics
print(f"\nSummary Statistics:")
print(f"Pista scores - Mean: {df['Pista_Overall'].mean():.2f}, Std: {df['Pista_Overall'].std():.2f}")
print(f"W2V scores - Mean: {df['W2V_Investibility'].mean():.2f}, Std: {df['W2V_Investibility'].std():.2f}")

# Show distribution of categories
print(f"\nCategory Distributions:")
pista_dist = df['Pista_Category'].value_counts().sort_index()
w2v_dist = df['W2V_Category'].value_counts().sort_index()
print(f"Pista: {dict(pista_dist)}")
print(f"W2V: {dict(w2v_dist)}")

# Save detailed results
detailed_results = df[['Pitch', 'Pista_Overall', 'W2V_Investibility', 'Pista_Category', 'W2V_Category']].copy()
detailed_results['Agreement'] = detailed_results['Pista_Category'] == detailed_results['W2V_Category']
print(f"\nDetailed Results:")
print(detailed_results.to_string(index=False))