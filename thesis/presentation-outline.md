# Thesis Defense Presentation: Pista - GenAI-Powered Startup Pitch Evaluation

**Duration**: 10 minutes presentation + 5 minutes Q&A
**Target**: Bachelor thesis defense
**Total Slides**: 12-14 slides

---

## Slide 1: Title Slide
**Content:**
- Title: "Pista: A GenAI-Powered System for Automated Startup Pitch Evaluation"
- Subtitle: "A Comparative Analysis with Existing GenAI Evaluation Systems"
- Your name: Maxwell Aboagye
- Supervisor: Prof. Xiaofeng Wang
- Co-supervisor: Triando
- Date: 2024/2025
- Bachelor in Computer Science

**What to say (30 seconds):**
"Good morning everyone. I'm Maxwell Aboagye, and today I'll present my bachelor thesis on Pista, a GenAI-powered system for automated startup pitch evaluation. This research explores how artificial intelligence can make startup evaluation more consistent, accessible, and scalable while comparing different GenAI approaches."

---

## Slide 2: The Problem
**Content:**
- **Traditional Pitch Evaluation Challenges:**
  - Inconsistent evaluations between experts
  - Limited access to quality feedback
  - Geographic barriers for entrepreneurs
  - Time-intensive manual processes
- **Impact:** Unfair disadvantages for underrepresented entrepreneurs

**What to say (60 seconds):**
"Startup pitch evaluation has three major problems. First, different experts often disagree when evaluating the same pitch - research shows significant variation even among experienced investors. Second, quality feedback is hard to access, especially for entrepreneurs outside major investment hubs. Third, traditional evaluation is slow and doesn't scale well. These problems particularly affect underrepresented founders who lack access to expert networks."

---

## Slide 3: Research Question & Objectives
**Content:**
- **Main Research Question:**
  - How do different GenAI evaluation systems compare when assessing identical startup pitches?
- **Objectives:**
  1. Develop a complete GenAI evaluation platform (Pista)
  2. Compare performance with existing system (Winds2Ventures)
  3. Analyze agreement patterns and evaluation differences
  4. Demonstrate technical feasibility and practical benefits

**What to say (45 seconds):**
"My research focuses on understanding how different GenAI systems evaluate startups. I built Pista as a complete evaluation platform and compared it statistically with Winds2Ventures, another GenAI system. The goal was to understand whether different AI approaches produce similar results and what we can learn from their differences."

---

## Slide 4: Solution Overview - Pista System
**Content:**
- **Live Demo Link:** https://pista-app.vercel.app
- **Key Features:**
  - Multi-format input (text, files, audio)
  - Real-time evaluation processing
  - Structured feedback with improvement recommendations
  - Evidence-based scoring (1-10 scale)
- **Performance:** 30-60 seconds evaluation, $0.10-0.15 per assessment

**What to say (60 seconds):**
"I developed Pista as a complete web application that entrepreneurs can use right now. It accepts pitches in multiple formats - text, uploaded files, or audio recordings. The system provides evaluations in 30 to 60 seconds at very low cost. Most importantly, it uses evidence-based scoring that prevents unsupported claims from getting high ratings. The system is deployed and accessible to anyone."

---

## Slide 5: Technical Architecture
**Content:**
- **Technology Stack:**
  - Frontend: Next.js 15, React, TypeScript, Tailwind CSS
  - Backend: Convex (real-time database), Clerk (authentication)
  - AI: OpenAI GPT-4 (evaluation), Whisper (transcription)
- **Architecture Highlights:**
  - Real-time updates during processing
  - Multi-tenant organization support
  - Structured JSON evaluation pipeline

**What to say (45 seconds):**
"The system uses modern web technologies for reliability and performance. Next.js provides the frontend, Convex handles real-time data synchronization, and GPT-4 powers the evaluation engine. The architecture supports multiple users simultaneously and provides live updates throughout the evaluation process. Everything is built with TypeScript for reliability."

---

## Slide 6: Evaluation Framework
**Content:**
- **Four Weighted Dimensions:**
  - Problem-Solution Fit (30%)
  - Business Model & Market (30%)
  - Team & Execution (25%)
  - Pitch Quality (15%)
- **Evidence-Based Scoring Rules:**
  - Scores 1-4: Weak/no evidence
  - Scores 5-6: Mixed evidence
  - Scores 7-10: Strong evidence with validation

**What to say (60 seconds):**
"Pista evaluates pitches across four research-backed dimensions with specific weights. Problem-solution fit and business model get the highest weights because research shows they best predict startup success. The key innovation is evidence-based scoring - pitches can't receive high scores without concrete supporting data. This prevents the common problem where all evaluations cluster around average scores."

---

## Slide 7: Comparative Analysis Setup
**Content:**
- **Dataset:** 22 university startup pitches
- **Comparison Partner:** Winds2Ventures (W2V)
- **Methodology:** Statistical agreement analysis
- **Sectors Covered:** Technology, healthcare, agriculture, consumer services
- **Analysis Focus:** Final overall scores and agreement patterns

**What to say (45 seconds):**
"To validate the system, I compared Pista with Winds2Ventures using 22 university competition pitches across different sectors. Both systems evaluated identical content, allowing direct statistical comparison. The analysis focused on final scores and agreement patterns to understand how different GenAI approaches perform."

---

## Slide 8: Key Results - Statistical Agreement
**Content:**
- **Cohen's Kappa: 0.505** (Moderate Agreement)
- **Observed Agreement: 77.3%** (when categorized as below average/average/good)
- **Score Difference:** Pista averaged 5.36 vs W2V's 5.20
- **Pattern:** Pista more optimistic, W2V more conservative
- **Sector Variations:** Technology showed highest differences, healthcare highest agreement

**What to say (75 seconds):**
"The statistical results show moderate agreement between the systems with a Cohen's kappa of 0.505 - much better than random chance. When categorizing pitches as below average, average, or good, the systems agreed 77% of the time. Pista consistently scored 0.16 points higher on average, indicating a more optimistic evaluation approach compared to W2V's conservative criteria. Interestingly, technology sector pitches showed the largest scoring differences, while healthcare pitches had the highest agreement rates."

---

## Slide 9: System Performance & Benefits
**Content:**
- **Speed:** 30-60 second evaluations
- **Cost:** $0.10-0.15 per assessment
- **Availability:** 24/7 automated processing
- **Consistency:** Eliminates evaluator fatigue and bias
- **Accessibility:** Removes geographic barriers
- **Quality:** Structured feedback with actionable recommendations

**What to say (60 seconds):**
"Pista demonstrates significant practical advantages. Evaluations complete in under a minute at minimal cost, compared to hours or days for traditional expert review. The system runs 24/7 without fatigue, providing consistent evaluations regardless of workload. Most importantly, it removes geographic barriers - an entrepreneur in any location can receive quality feedback instantly. The structured output includes specific improvement recommendations, not just scores."

---

## Slide 10: Sample Evaluation Output
**Content:**
- **Example:** Technology startup evaluation
- **Score Breakdown:** Visual representation of 4 dimensions
- **Strengths:** "Strong technical innovation with clear market demand"
- **Improvements:** "Need customer validation metrics and financial projections"
- **Recommendations:** Specific actionable steps for improvement

**What to say (45 seconds):**
"Here's what entrepreneurs actually receive - detailed breakdowns across all four dimensions, specific strengths to leverage, priority improvement areas, and actionable recommendations. This goes far beyond traditional evaluation that often provides only general feedback. The structured format helps founders understand exactly what to work on next."

---

## Slide 11: Research Contributions
**Content:**
- **Technical Contribution:** Working GenAI evaluation platform with evidence-based framework
- **Empirical Contribution:** First statistical comparison of GenAI evaluation systems
- **Methodological Contribution:** Demonstrated approach for evaluating AI assessment tools
- **Practical Contribution:** Accessible system addressing real entrepreneurial needs

**What to say (60 seconds):**
"This research makes several key contributions. Technically, I built a complete working system that demonstrates GenAI evaluation feasibility. Empirically, this is the first statistical comparison between different GenAI evaluation platforms using standardized metrics. Methodologically, I established an approach for evaluating AI assessment tools. Practically, the system addresses real needs for accessible, consistent startup evaluation."

---

## Slide 12: Limitations & Future Work
**Content:**
- **Current Limitations:**
  - Team assessment relies on limited pitch information
  - Performance varies by industry sector
  - Requires structured pitch content for best results
- **Future Directions:**
  - Integration with additional data sources
  - Multi-model ensemble approaches
  - Long-term startup outcome tracking

**What to say (45 seconds):**
"The system has some limitations. Team evaluation is challenging since pitches contain limited information about founders' backgrounds. Performance varies across industries, with technology evaluations showing more variation. Future work could integrate additional data sources, combine multiple AI models for better accuracy, and track actual startup outcomes to validate evaluation quality."

---

## Slide 13: Conclusion
**Content:**
- **Achievement:** Successfully demonstrated GenAI evaluation feasibility
- **Key Finding:** Different GenAI systems have distinct evaluation characteristics
- **Impact:** Provides accessible, consistent evaluation for underrepresented entrepreneurs
- **Significance:** Opens new research directions in automated business assessment
- **Availability:** System deployed at https://pista-app.vercel.app

**What to say (60 seconds):**
"In conclusion, this research successfully demonstrates that GenAI can provide valuable startup pitch evaluation. The comparison reveals that different AI systems bring distinct perspectives - suggesting that multiple GenAI evaluations may be more valuable than relying on single platforms. Most importantly, the system provides accessible, consistent evaluation that can help level the playing field for entrepreneurs regardless of their geographic location or network access. The platform is live and available for immediate use."

---

## Slide 14: Thank You & Questions
**Content:**
- "Thank you for your attention"
- "Questions & Discussion"
- Contact: [your email]
- Project: https://pista-app.vercel.app
- GitHub: [if public]

**What to say (15 seconds):**
"Thank you for your attention. I'm happy to answer any questions about the technical implementation, research methodology, or practical applications of GenAI evaluation systems."

---

## Q&A Preparation (5 minutes)

### **Likely Questions & Suggested Answers:**

**Q: How did you validate the evaluation criteria?**
A: "The four dimensions and weights are based on venture capital research literature. I also tested different rubric anchors iteratively to solve the central tendency problem where all scores clustered around 7/10."

**Q: What about bias in AI evaluation?**
A: "This is important. The evidence-based scoring helps reduce bias by requiring concrete data for high scores. However, AI systems can still reflect biases in training data. Comparing multiple systems like I did helps identify these patterns."

**Q: How does cost compare to human evaluation?**
A: "Traditional expert evaluation costs $100-500+ and takes days. Pista costs $0.10-0.15 and completes in 60 seconds. The cost reduction is dramatic while maintaining structured, detailed feedback."

**Q: Could this replace human evaluators entirely?**
A: "Not entirely - humans bring contextual judgment and relationship assessment that AI can't replicate. But AI evaluation is excellent for initial screening, educational contexts, and providing accessible feedback where human evaluation isn't available."

**Q: What about security and data privacy?**
A: "The system uses Clerk for authentication with organization-level data isolation. Pitch data is stored securely in Convex with proper access controls. All AI processing uses OpenAI's API with standard data protection practices."

---

## **Timing Guide:**
- **Slides 1-3:** 2.5 minutes (Setup & Problem)
- **Slides 4-6:** 2.5 minutes (Solution & Architecture)
- **Slides 7-8:** 2 minutes (Analysis & Results)
- **Slides 9-11:** 2.5 minutes (Performance & Contributions)
- **Slides 12-13:** 1.5 minutes (Limitations & Conclusion)
- **Total:** ~10 minutes

## **Presentation Tips:**
1. **Practice timing** - aim for 9.5 minutes to allow buffer
2. **Have demo ready** - be prepared to show live system if asked
3. **Emphasize practical impact** - this solves real problems for real entrepreneurs
4. **Stay confident on technical details** - you built this entire system
5. **Connect to broader research** - position within AI evaluation landscape