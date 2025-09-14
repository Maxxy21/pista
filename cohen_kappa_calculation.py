#!/usr/bin/env python3
"""
Cohen's Kappa Calculation for Pitch Scores
Manual calculation with detailed steps for academic verification
"""

from collections import Counter

def categorize_score(score):
    """Convert continuous score to category"""
    if 1.0 <= score <= 4.9:
        return "Below Average"
    elif 5.0 <= score <= 6.9:
        return "Average"
    elif 7.0 <= score <= 10.0:
        return "Good"
    else:
        return "Unknown"

def calculate_cohen_kappa_manual(rater1_categories, rater2_categories):
    """Calculate Cohen's kappa manually with detailed steps"""
    
    # Create confusion matrix manually
    categories = ["Below Average", "Average", "Good"]
    n = len(rater1_categories)
    
    # Initialize confusion matrix
    confusion = {}
    for cat1 in categories:
        confusion[cat1] = {}
        for cat2 in categories:
            confusion[cat1][cat2] = 0
    
    # Fill confusion matrix
    for r1, r2 in zip(rater1_categories, rater2_categories):
        confusion[r1][r2] += 1
    
    print("=== STEP 1: CONFUSION MATRIX ===")
    print("              W2V")
    print("         B.Avg  Avg  Good  Total")
    print("PISTA:")
    
    totals = {"Below Average": 0, "Average": 0, "Good": 0}
    col_totals = {"Below Average": 0, "Average": 0, "Good": 0}
    
    for r1 in categories:
        row_total = sum(confusion[r1].values())
        totals[r1] = row_total
        print(f"{r1:>8}: {confusion[r1]['Below Average']:4d}  {confusion[r1]['Average']:4d}  {confusion[r1]['Good']:4d}   {row_total:3d}")
        
        for r2 in categories:
            col_totals[r2] += confusion[r1][r2]
    
    print(f"{'Total':>8}: {col_totals['Below Average']:4d}  {col_totals['Average']:4d}  {col_totals['Good']:4d}   {n:3d}")
    print()
    
    # Calculate observed agreement (P₀)
    observed_agreement = 0
    for cat in categories:
        observed_agreement += confusion[cat][cat]
    
    p0 = observed_agreement / n
    
    print("=== STEP 2: OBSERVED AGREEMENT (P₀) ===")
    print(f"Diagonal sum (agreements): {observed_agreement}")
    print(f"Total observations: {n}")
    print(f"P₀ = {observed_agreement}/{n} = {p0:.4f}")
    print()
    
    # Calculate expected agreement (Pₑ)
    print("=== STEP 3: EXPECTED AGREEMENT (Pₑ) ===")
    pe = 0
    for cat in categories:
        marginal_r1 = totals[cat] / n
        marginal_r2 = col_totals[cat] / n
        expected_for_cat = marginal_r1 * marginal_r2
        pe += expected_for_cat
        print(f"{cat}: ({totals[cat]}/{n}) × ({col_totals[cat]}/{n}) = {marginal_r1:.4f} × {marginal_r2:.4f} = {expected_for_cat:.4f}")
    
    print(f"Pₑ = {pe:.4f}")
    print()
    
    # Calculate Cohen's kappa
    if pe == 1.0:
        kappa = 0  # Handle edge case
    else:
        kappa = (p0 - pe) / (1 - pe)
    
    print("=== STEP 4: COHEN'S KAPPA ===")
    print(f"κ = (P₀ - Pₑ) / (1 - Pₑ)")
    print(f"κ = ({p0:.4f} - {pe:.4f}) / (1 - {pe:.4f})")
    print(f"κ = {p0 - pe:.4f} / {1 - pe:.4f}")
    print(f"κ = {kappa:.4f}")
    print()
    
    return kappa, p0, pe, confusion

def interpret_kappa(kappa):
    """Interpret Cohen's kappa value"""
    if kappa < 0:
        return "Poor (worse than chance)"
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

def calculate_kappa_confidence_interval(kappa, n, confidence_level=0.95):
    """
    Calculate confidence interval for Cohen's kappa
    Using the asymptotic standard error method
    """
    import math
    
    # For moderate sample sizes, use asymptotic standard error
    # This is a simplified approximation
    se_kappa = math.sqrt((1 - kappa**2) / n)
    
    # Z-score for confidence level
    if confidence_level == 0.95:
        z = 1.96
    elif confidence_level == 0.90:
        z = 1.645
    elif confidence_level == 0.99:
        z = 2.576
    else:
        z = 1.96  # default to 95%
    
    margin_error = z * se_kappa
    ci_lower = kappa - margin_error
    ci_upper = kappa + margin_error
    
    return ci_lower, ci_upper, se_kappa

def main():
    # Define the data
    data = [
        ("Aerovisio", 5.3, 4.5),
        ("Assistme", 4.9, 5.4),
        ("Assistme", 6.2, 4.4),
        ("CampoRapido", 4.2, 4.5),
        ("Coontent", 6.0, 5.3),
        ("Corptech", 6.3, 6.0),
        ("Finnaid", 5.0, 5.5),
        ("Fitly", 5.6, 4.7),
        ("HHCoders", 4.8, 4.5),
        ("MatchIt", 5.3, 6.4),
        ("Math4Me", 4.6, 4.5),
        ("Mediflow", 6.1, 4.5),
        ("Myok", 6.1, 6.4),
        ("PolyGlobe", 5.8, 6.4),
        ("Prosilta", 5.8, 5.4),
        ("Rideshare", 4.1, 4.5),
        ("saunaYou&Me", 5.5, 5.5),
        ("Serenity", 6.0, 6.1),
        ("Shieldskin", 5.7, 5.0),
        ("Sundove", 5.0, 5.0),
        ("UnversitAI", 4.0, 4.3),
        ("Whopika", 5.7, 5.5)
    ]
    
    print("COHEN'S KAPPA CALCULATION FOR PITCH SCORES")
    print("=" * 50)
    print()
    
    # Show original data
    print("ORIGINAL DATA:")
    print(f"{'Pitch':<15} {'Pista':>6} {'W2V':>6}")
    print("-" * 30)
    for pitch, pista, w2v in data:
        print(f"{pitch:<15} {pista:>6.1f} {w2v:>6.1f}")
    print(f"\nTotal samples: {len(data)}")
    print()
    
    # Categorize scores
    print("CATEGORIZATION RULES:")
    print("Below Average: 1.0-4.9")
    print("Average: 5.0-6.9") 
    print("Good: 7.0-10.0")
    print()
    
    pista_scores = [score for _, score, _ in data]
    w2v_scores = [score for _, _, score in data]
    
    pista_categories = [categorize_score(score) for score in pista_scores]
    w2v_categories = [categorize_score(score) for score in w2v_scores]
    
    # Show categorized data
    print("CATEGORIZED DATA:")
    print(f"{'Pitch':<15} {'Pista':>6} {'P_Cat':<13} {'W2V':>6} {'W_Cat':<13}")
    print("-" * 60)
    for i, (pitch, pista, w2v) in enumerate(data):
        print(f"{pitch:<15} {pista:>6.1f} {pista_categories[i]:<13} {w2v:>6.1f} {w2v_categories[i]:<13}")
    print()
    
    # Calculate Cohen's kappa manually
    kappa, p0, pe, confusion = calculate_cohen_kappa_manual(pista_categories, w2v_categories)
    
    # Results summary
    print("=== FINAL RESULTS ===")
    print(f"Observed Agreement: {p0:.1%}")
    print(f"Expected Agreement: {pe:.4f}")
    print(f"Cohen's Kappa: {kappa:.4f}")
    print(f"Interpretation: {interpret_kappa(kappa)}")
    
    # Calculate confidence interval
    ci_lower, ci_upper, se_kappa = calculate_kappa_confidence_interval(kappa, len(data))
    print(f"Standard Error: {se_kappa:.4f}")
    print(f"95% Confidence Interval: ({ci_lower:.4f}, {ci_upper:.4f})")
    print()
    
    # Additional statistics
    agreements = sum(1 for p, w in zip(pista_categories, w2v_categories) if p == w)
    print(f"Number of exact agreements: {agreements} out of {len(data)}")
    print(f"Percentage agreement: {agreements/len(data):.1%}")
    
    # Distribution of categories
    print("\nCATEGORY DISTRIBUTIONS:")
    pista_dist = Counter(pista_categories)
    w2v_dist = Counter(w2v_categories)
    
    categories = ["Below Average", "Average", "Good"]
    print("Category        PISTA  W2V")
    for cat in categories:
        print(f"{cat:<14} {pista_dist.get(cat, 0):4d}  {w2v_dist.get(cat, 0):4d}")
    
    # Additional analysis
    print("\n=== ADDITIONAL ANALYSIS ===")
    
    # Calculate disagreements by category
    disagreements = []
    for i, (p_cat, w_cat) in enumerate(zip(pista_categories, w2v_categories)):
        if p_cat != w_cat:
            pitch_name = data[i][0]
            pista_score = data[i][1]
            w2v_score = data[i][2]
            disagreements.append((pitch_name, pista_score, p_cat, w2v_score, w_cat))
    
    print(f"\nDisagreements ({len(disagreements)} out of {len(data)}):")
    if disagreements:
        print(f"{'Pitch':<15} {'Pista':<12} {'W2V':<12} {'Diff':<8}")
        print("-" * 50)
        for pitch, p_score, p_cat, w_score, w_cat in disagreements:
            diff = abs(p_score - w_score)
            print(f"{pitch:<15} {p_score:.1f}({p_cat[:4]:<4}) {w_score:.1f}({w_cat[:4]:<4}) {diff:>4.1f}")
    
    print(f"\nSummary Statistics:")
    print(f"- Sample size: {len(data)}")
    print(f"- Agreements: {agreements} ({p0:.1%})")
    print(f"- Disagreements: {len(disagreements)} ({(1-p0):.1%})")
    print(f"- Cohen's κ: {kappa:.4f} ({interpret_kappa(kappa)})")
    print(f"- 95% CI: ({ci_lower:.4f}, {ci_upper:.4f})")

if __name__ == "__main__":
    main()