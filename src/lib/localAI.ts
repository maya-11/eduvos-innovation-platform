// src/lib/localAI.ts

export interface AIAnalysis {
  summary: string;
  confidence: number;
  feasibility: number;
  impact: number;
  innovation: number;
  resources: number;
  scalability: number;
  risk: number;
  value: number;
  alignment: number;
}

export class LocalAIService {
  async analyzeIdea(title: string, description: string, tags: string[]): Promise<AIAnalysis> {
    console.log("🧠 Using Local AI Analysis");
    
    // Simple keyword-based analysis
    const analysis = this.generateAnalysis(title, description, tags);
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(analysis), 1000); // Simulate API delay
    });
  }

  private generateAnalysis(title: string, description: string, tags: string[]): AIAnalysis {
    const content = `${title} ${description}`.toLowerCase();
    
    // Score based on content quality and keywords
    let feasibility = 3;
    let impact = 3;
    let innovation = 3;
    let resources = 3;
    let scalability = 3;
    let risk = 3;
    let value = 3;
    let alignment = 3;
    
    // Analyze based on keywords
    if (content.includes('app') || content.includes('software') || content.includes('digital')) {
      feasibility += 1;
      scalability += 1;
    }
    
    if (content.includes('campus') || content.includes('all students') || content.includes('university')) {
      impact += 2;
      value += 1;
    }
    
    if (content.includes('wireless') || content.includes('upgrade') || content.includes('modern')) {
      innovation += 1;
      alignment += 1;
    }
    
    if (content.includes('simple') || content.includes('easy') || content.includes('low cost')) {
      resources += 1;
      risk -= 1;
    }
    
    if (content.includes('complex') || content.includes('expensive') || content.includes('difficult')) {
      resources -= 1;
      risk += 1;
    }
    
    // Generate summary based on analysis
    const summary = this.generateSummary(title, feasibility, impact, innovation);
    
    return {
      summary,
      confidence: 75 + Math.floor(Math.random() * 20), // 75-95% confidence
      feasibility: this.clampScore(feasibility),
      impact: this.clampScore(impact),
      innovation: this.clampScore(innovation),
      resources: this.clampScore(resources),
      scalability: this.clampScore(scalability),
      risk: this.clampScore(risk),
      value: this.clampScore(value),
      alignment: this.clampScore(alignment)
    };
  }

  private generateSummary(title: string, feasibility: number, impact: number, innovation: number): string {
    const feasibilityText = feasibility >= 4 ? 'high feasibility' : feasibility >= 3 ? 'reasonable feasibility' : 'challenging feasibility';
    const impactText = impact >= 4 ? 'significant impact' : impact >= 3 ? 'moderate impact' : 'limited impact';
    const innovationText = innovation >= 4 ? 'innovative approach' : innovation >= 3 ? 'practical solution' : 'conventional approach';
    
    return `"${title}" demonstrates ${innovationText} with ${feasibilityText} and potential for ${impactText} on campus. The idea addresses current needs and shows good potential for implementation.`;
  }

  private clampScore(score: number): number {
    return Math.max(1, Math.min(5, score));
  }

  getOverallScore(analysis: AIAnalysis): number {
    const weights = {
      feasibility: 0.15,
      impact: 0.20,
      innovation: 0.15,
      resources: 0.10,
      scalability: 0.10,
      risk: 0.10,
      value: 0.10,
      alignment: 0.10
    };

    const weightedScore = 
      (analysis.feasibility * weights.feasibility) +
      (analysis.impact * weights.impact) +
      (analysis.innovation * weights.innovation) +
      (analysis.resources * weights.resources) +
      (analysis.scalability * weights.scalability) +
      ((6 - analysis.risk) * weights.risk) + // Invert risk score
      (analysis.value * weights.value) +
      (analysis.alignment * weights.alignment);

    return Math.round((weightedScore / 5) * 100);
  }

  calculatePriority(analysis: AIAnalysis): number {
    const score = this.getOverallScore(analysis);
    if (score >= 80) return 5;
    if (score >= 70) return 4;
    if (score >= 60) return 3;
    if (score >= 50) return 2;
    return 1;
  }
}

export const localAIService = new LocalAIService();