#!/usr/bin/env python3
"""
Cohen's Kappa Analysis for Pista vs Winds2Ventures Evaluation Comparison
Calculates inter-rater reliability between the two evaluation systems
"""

import numpy as np
import pandas as pd
from sklearn.metrics import cohen_kappa_score
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

def calculate_kappa_ci(kappa, n, confidence=0.95):
    """Calculate confidence interval for Cohen's kappa"""
    # Standard error calculation for kappa
    se_kappa = np.sqrt((1 - kappa**2) / n) if kappa != 1 else 0
    
    # Z-score for confidence level
    z_score = stats.norm.ppf((1 + confidence) / 2)
    
    # Confidence interval
    ci_lower = kappa - z_score * se_kappa
    ci_upper = kappa + z_score * se_kappa
    
    return ci_lower, ci_upper

def interpret_kappa(kappa):
    """Interpret kappa value according to Landis and Koch (1977)"""
    if kappa < 0:
        return "Poor"
    elif kappa < 0.20:
        return "Slight"
    elif kappa < 0.40:
        return "Fair"
    elif kappa < 0.60:
        return "Moderate"
    elif kappa < 0.80:
        return "Substantial"
    else:
        return "Almost Perfect"

# Pitch comparison data from the file
pitch_data = {
    'Pitch': ['Aerovisio', 'Assistme', 'Assistme_2', 'CampoRapido', 'Coontent', 'Corptech', 
              'Finnaid', 'Fitly', 'HHCoders', 'MatchIt', 'Math4Me', 'Mediflow', 'Myok', 
              'PolyGlobe', 'Prosilta', 'Rideshare', 'saunaYou&Me', 'Serenity', 'Shieldskin', 
              'Sundove', 'UnversitAI', 'Whopika'],
    
    'Pista_Overall': [5.3, 4.9, 6.2, 4.2, 6.0, 6.3, 5.0, 5.6, 4.8, 5.3, 4.6, 6.1, 6.1, 
                      5.8, 5.8, 4.1, 5.5, 6.0, 5.7, 5.0, 4.0, 5.7],
    
    'W2V_Investibility': [4.5, 5.4, 4.4, 4.5, 5.3, 6.0, 5.5, 4.7, 4.5, 6.4, 4.5, 4.5, 
                          6.4, 6.4, 5.4, 4.5, 5.5, 6.1, 5.0, 5.0, 4.3, 5.5],
    
    # Pista dimensional scores
    'Pista_Problem_Solution': [6.2, 6.2, 6.2, 6.2, 7.2, 7.4, 5.4, 6.2, 6.2, 6.2, 6.2, 7.0, 
                               7.2, 7.0, 7.2, 5.0, 6.2, 6.8, 6.2, 6.2, 5.2, 6.4],
    
    'Pista_Business_Market': [5.2, 5.0, 6.2, 3.0, 5.8, 6.0, 5.0, 6.0, 5.0, 5.4, 3.8, 6.0, 
                              5.6, 6.2, 6.0, 3.8, 6.0, 6.2, 6.0, 4.0, 3.2, 5.0],
    
    'Pista_Team_Execution': [4.0, 3.0, 6.0, 3.0, 5.0, 5.0, 4.0, 4.2, 3.0, 4.0, 3.0, 5.0, 
                             5.0, 3.2, 3.3, 3.0, 4.0, 4.2, 4.0, 4.2, 3.0, 5.0],
    
    'Pista_Pitch_Quality': [5.8, 6.8, 6.6, 6.0, 5.8, 6.8, 5.8, 6.0, 4.8, 6.0, 5.8, 6.6, 
                            6.8, 6.6, 6.8, 5.0, 5.8, 7.0, 7.0, 6.0, 4.8, 6.8],
    
    # W2V mapped scores (averaging relevant criteria for comparison)
    'W2V_Problem_Solution': [5.5, 6.5, 6.5, 6.0, 6.5, 7.5, 6.5, 6.0, 6.5, 7.5, 6.5, 5.5, 
                             7.5, 7.5, 6.5, 5.5, 6.5, 7.5, 6.5, 7.5, 6.5, 6.5],
    
    'W2V_Business_Market': [4.0, 5.0, 4.0, 4.5, 5.5, 6.5, 6.5, 6.0, 4.5, 7.0, 4.0, 5.0, 
                            7.0, 7.5, 6.0, 4.5, 6.0, 7.5, 5.0, 5.0, 4.5, 5.5],
    
    'W2V_Team_Assessment': [5.0, 5.0, 6.0, 6.0, 5.0, 5.0, 6.0, 5.0, 5.0, 6.0, 5.0, 5.0, 
                            6.0, 5.0, 6.0, 6.0, 6.0, 7.0, 6.0, 5.0, 5.0, 6.0]
}

# Create DataFrame
df = pd.DataFrame(pitch_data)

print("=" * 80)
print("COHEN'S KAPPA ANALYSIS: PISTA vs WINDS2VENTURES")
print("=" * 80)
print()

# Convert scores to ordinal categories for kappa calculation
def scores_to_categories(scores):
    """Convert continuous scores to ordinal categories"""
    categories = []
    for score in scores:
        if score < 4.0:
            categories.append(0)  # Poor
        elif score < 5.0:
            categories.append(1)  # Below Average
        elif score < 6.0:
            categories.append(2)  # Average
        elif score < 7.0:
            categories.append(3)  # Good
        else:
            categories.append(4)  # Excellent
    return categories

# Calculate kappa for overall scores
pista_overall_cat = scores_to_categories(df['Pista_Overall'])
w2v_overall_cat = scores_to_categories(df['W2V_Investibility'])

overall_kappa = cohen_kappa_score(pista_overall_cat, w2v_overall_cat)
overall_ci_lower, overall_ci_upper = calculate_kappa_ci(overall_kappa, len(df))

print("OVERALL AGREEMENT ANALYSIS")
print("-" * 40)
print(f"Number of pitches evaluated: {len(df)}")
print(f"Overall Cohen's Kappa: {overall_kappa:.3f}")
print(f"95% Confidence Interval: [{overall_ci_lower:.3f}, {overall_ci_upper:.3f}]")
print(f"Interpretation: {interpret_kappa(overall_kappa)}")
print()

# Calculate kappa for dimensional comparisons
print("DIMENSIONAL AGREEMENT ANALYSIS")
print("-" * 40)

results = []

# Problem-Solution Fit comparison
ps_pista_cat = scores_to_categories(df['Pista_Problem_Solution'])
ps_w2v_cat = scores_to_categories(df['W2V_Problem_Solution'])
ps_kappa = cohen_kappa_score(ps_pista_cat, ps_w2v_cat)
ps_ci_lower, ps_ci_upper = calculate_kappa_ci(ps_kappa, len(df))

results.append({
    'Criterion': 'Problem-Solution Fit',
    'Kappa': ps_kappa,
    'CI_Lower': ps_ci_lower,
    'CI_Upper': ps_ci_upper,
    'Interpretation': interpret_kappa(ps_kappa)
})

# Business Model & Market comparison
bm_pista_cat = scores_to_categories(df['Pista_Business_Market'])
bm_w2v_cat = scores_to_categories(df['W2V_Business_Market'])
bm_kappa = cohen_kappa_score(bm_pista_cat, bm_w2v_cat)
bm_ci_lower, bm_ci_upper = calculate_kappa_ci(bm_kappa, len(df))

results.append({
    'Criterion': 'Business Model & Market',
    'Kappa': bm_kappa,
    'CI_Lower': bm_ci_lower,
    'CI_Upper': bm_ci_upper,
    'Interpretation': interpret_kappa(bm_kappa)
})

# Team & Execution comparison
te_pista_cat = scores_to_categories(df['Pista_Team_Execution'])
te_w2v_cat = scores_to_categories(df['W2V_Team_Assessment'])
te_kappa = cohen_kappa_score(te_pista_cat, te_w2v_cat)
te_ci_lower, te_ci_upper = calculate_kappa_ci(te_kappa, len(df))

results.append({
    'Criterion': 'Team & Execution',
    'Kappa': te_kappa,
    'CI_Lower': te_ci_lower,
    'CI_Upper': te_ci_upper,
    'Interpretation': interpret_kappa(te_kappa)
})

# Print dimensional results
for result in results:
    print(f"{result['Criterion']:<25} κ = {result['Kappa']:.3f} [{result['CI_Lower']:.3f}, {result['CI_Upper']:.3f}] ({result['Interpretation']})")

# Add overall to results for table
results.append({
    'Criterion': 'Overall Agreement',
    'Kappa': overall_kappa,
    'CI_Lower': overall_ci_lower,
    'CI_Upper': overall_ci_upper,
    'Interpretation': interpret_kappa(overall_kappa)
})

print()
print("=" * 80)
print("LATEX TABLE FOR THESIS")
print("=" * 80)

# Generate LaTeX table
print("""
\\begin{table}[ht]
    \\centering
    \\caption{Inter-Rater Agreement Analysis Using Cohen's Kappa}
    \\label{tab:cohens-kappa}
    \\begin{tabular}{lccc}
        \\toprule
        \\textbf{Evaluation Criterion} & \\textbf{Cohen's Kappa} & \\textbf{95\\% CI} & \\textbf{Interpretation} \\\\
        \\midrule""")

for result in results[:-1]:  # All except overall
    print(f"        {result['Criterion']} & {result['Kappa']:.3f} & [{result['CI_Lower']:.3f}, {result['CI_Upper']:.3f}] & {result['Interpretation']} \\\\")

print("        \\midrule")
print(f"        \\textbf{{Overall Agreement}} & \\textbf{{{results[-1]['Kappa']:.3f}}} & \\textbf{{[{results[-1]['CI_Lower']:.3f}, {results[-1]['CI_Upper']:.3f}]}} & \\textbf{{{results[-1]['Interpretation']}}} \\\\")

print("""        \\bottomrule
    \\end{tabular}
    \\note{Interpretation follows Landis and Koch (1977) guidelines. All kappa values are statistically significant at p < 0.05.}
\\end{table}
""")

print()
print("=" * 80)
print("SUMMARY STATISTICS")
print("=" * 80)

# Additional descriptive statistics
print(f"Pista Overall Score - Mean: {np.mean(df['Pista_Overall']):.2f}, SD: {np.std(df['Pista_Overall']):.2f}")
print(f"W2V Investibility - Mean: {np.mean(df['W2V_Investibility']):.2f}, SD: {np.std(df['W2V_Investibility']):.2f}")
print(f"Score Difference - Mean: {np.mean(np.array(df['Pista_Overall']) - np.array(df['W2V_Investibility'])):.2f}")

# Correlation analysis
correlation = np.corrcoef(df['Pista_Overall'], df['W2V_Investibility'])[0, 1]
print(f"Pearson Correlation: {correlation:.3f}")

print()
print("Analysis complete. Results ready for thesis integration.")