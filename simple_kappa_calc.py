#!/usr/bin/env python3
"""
Simple Cohen's Kappa Calculation for Inter-Rater Reliability Analysis
Comparing Pista system vs Winds2Ventures evaluation scores
"""

import math

def cohens_kappa(rater1, rater2):
    """Calculate Cohen's kappa given two lists of ratings"""
    n = len(rater1)
    
    # Create confusion matrix
    categories = sorted(set(rater1 + rater2))
    k = len(categories)
    
    # Map categories to indices
    cat_to_idx = {cat: idx for idx, cat in enumerate(categories)}
    
    # Initialize confusion matrix
    confusion = [[0 for _ in range(k)] for _ in range(k)]
    
    # Fill confusion matrix
    for i in range(n):
        r1_idx = cat_to_idx[rater1[i]]
        r2_idx = cat_to_idx[rater2[i]]
        confusion[r1_idx][r2_idx] += 1
    
    # Calculate observed agreement
    observed = sum(confusion[i][i] for i in range(k)) / n
    
    # Calculate expected agreement
    marginal1 = [sum(confusion[i]) / n for i in range(k)]
    marginal2 = [sum(confusion[i][j] for i in range(k)) / n for j in range(k)]
    expected = sum(marginal1[i] * marginal2[i] for i in range(k))
    
    # Calculate Cohen's kappa
    if expected == 1:
        return 1.0
    else:
        kappa = (observed - expected) / (1 - expected)
        return kappa

def scores_to_categories(scores):
    """Convert continuous scores to ordinal categories"""
    categories = []
    for score in scores:
        if score < 4.0:
            categories.append('Poor')
        elif score < 5.0:
            categories.append('Below Average')
        elif score < 6.0:
            categories.append('Average')
        elif score < 7.0:
            categories.append('Good')
        else:
            categories.append('Excellent')
    return categories

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

# Data extracted from Pitch_Comparisons_New_Scores.txt
pitch_names = ['Aerovisio', 'Assistme', 'Assistme2', 'CampoRapido', 'Coontent', 'Corptech',
               'Finnaid', 'Fitly', 'HHCoders', 'MatchIt', 'Math4Me', 'Mediflow', 'Myok',
               'PolyGlobe', 'Prosilta', 'Rideshare', 'saunaYou&Me', 'Serenity', 'Shieldskin',
               'Sundove', 'UnversitAI', 'Whopika']

pista_overall = [5.3, 4.9, 6.2, 4.2, 6.0, 6.3, 5.0, 5.6, 4.8, 5.3, 4.6, 6.1, 6.1, 
                 5.8, 5.8, 4.1, 5.5, 6.0, 5.7, 5.0, 4.0, 5.7]

w2v_investibility = [4.5, 5.4, 4.4, 4.5, 5.3, 6.0, 5.5, 4.7, 4.5, 6.4, 4.5, 4.5, 
                     6.4, 6.4, 5.4, 4.5, 5.5, 6.1, 5.0, 5.0, 4.3, 5.5]

print("=" * 80)
print("COHEN'S KAPPA ANALYSIS: PISTA vs WINDS2VENTURES")
print("=" * 80)
print()

# Convert to categories and calculate kappa
print("OVERALL AGREEMENT ANALYSIS")
print("-" * 40)

pista_overall_cat = scores_to_categories(pista_overall)
w2v_overall_cat = scores_to_categories(w2v_investibility)

overall_kappa = cohens_kappa(pista_overall_cat, w2v_overall_cat)

print(f"Number of pitches evaluated: {len(pista_overall)}")
print(f"Overall Cohen's Kappa: {overall_kappa:.3f}")
print(f"Interpretation: {interpret_kappa(overall_kappa)}")
print()

# Calculate means and standard deviations
pista_mean = sum(pista_overall) / len(pista_overall)
w2v_mean = sum(w2v_investibility) / len(w2v_investibility)

pista_var = sum((x - pista_mean)**2 for x in pista_overall) / (len(pista_overall) - 1)
w2v_var = sum((x - w2v_mean)**2 for x in w2v_investibility) / (len(w2v_investibility) - 1)

pista_sd = math.sqrt(pista_var)
w2v_sd = math.sqrt(w2v_var)

print("DESCRIPTIVE STATISTICS")
print("-" * 40)
print(f"Pista Overall - Mean: {pista_mean:.2f}, SD: {pista_sd:.2f}")
print(f"W2V Investibility - Mean: {w2v_mean:.2f}, SD: {w2v_sd:.2f}")

# Calculate difference
differences = [p - w for p, w in zip(pista_overall, w2v_investibility)]
diff_mean = sum(differences) / len(differences)
print(f"Mean Difference (Pista - W2V): {diff_mean:.2f}")
print()

# Calculate exact agreement
agreements = sum(1 for p, w in zip(pista_overall_cat, w2v_overall_cat) if p == w)
print(f"Exact agreement: {agreements}/{len(pista_overall)} ({agreements/len(pista_overall)*100:.1f}%)")

# Show category distributions
print("\nCategory Distributions:")
pista_dist = {}
w2v_dist = {}
categories = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']

for cat in categories:
    pista_dist[cat] = pista_overall_cat.count(cat)
    w2v_dist[cat] = w2v_overall_cat.count(cat)

print("Pista:", {k: v for k, v in pista_dist.items() if v > 0})
print("W2V:  ", {k: v for k, v in w2v_dist.items() if v > 0})

print()
print("=" * 80)
print("LATEX TABLE FOR THESIS")
print("=" * 80)

print(f"""
\\begin{{table}}[ht]
    \\centering
    \\caption{{Inter-Rater Reliability Analysis Using Cohen's Kappa}}
    \\label{{tab:cohens-kappa}}
    \\begin{{tabular}}{{lcc}}
        \\toprule
        \\textbf{{Measure}} & \\textbf{{Value}} & \\textbf{{Interpretation}} \\\\
        \\midrule
        Cohen's Kappa & {overall_kappa:.3f} & {interpret_kappa(overall_kappa)} \\\\
        Observed Agreement & {sum(1 for p, w in zip(pista_overall_cat, w2v_overall_cat) if p == w)/len(pista_overall):.1%} & -- \\\\
        Mean Score Difference & {diff_mean:.2f} & Pista - W2V \\\\
        \\bottomrule
    \\end{{tabular}}
    \\note{{Interpretation follows Landis and Koch (1977) guidelines. Scores were categorized into ordinal levels for kappa calculation.}}
\\end{{table}}
""")

print()
print("Analysis complete. Results ready for thesis integration.")