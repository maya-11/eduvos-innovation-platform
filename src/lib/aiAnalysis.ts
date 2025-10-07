// src/lib/aiAnalysis.ts

export interface AIAnalysis {
  feasibility: number;
  impact: number;
  innovation: number;
  resources: number;
  estimatedCost: 'low' | 'medium' | 'high';
  timeToImplement: 'quick' | 'medium' | 'long';
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  summary: string;
  strengths: string[];
  considerations: string[];
  recommendations: string[];
  generatedAt: Date;
}

export interface AIScores {
  overall: number;
  feasibility: number;
  impact: number;
  innovation: number;
  resources: number;
}

class AIAnalysisService {
  async analyzeIdea(title: string, description: string, tags: string[] = []): Promise<AIAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
    const wordCount = description.split(' ').length;
    const hasTechnicalTerms = /(app|software|platform|system|digital|online|mobile)/i.test(content);
    const hasImpactWords = /(improve|enhance|streamline|optimize|transform|revolutionize)/i.test(content);
    const hasResourceWords = /(budget|cost|funding|team|time|equipment)/i.test(content);
    
    const feasibility = this.calculateScore(content, 60, 30, hasTechnicalTerms);
    const impact = this.calculateScore(content, 70, 25, hasImpactWords);
    const innovation = this.calculateScore(content, 65, 35, !hasTechnicalTerms);
    const resources = this.calculateScore(content, 50, 40, hasResourceWords);
    
    const overall = Math.round((feasibility + impact + innovation + resources) / 4);
    
    const costScore = Math.random();
    const estimatedCost = costScore > 0.7 ? 'high' : costScore > 0.4 ? 'medium' : 'low';
    
    const timeScore = Math.random();
    const timeToImplement = timeScore > 0.7 ? 'long' : timeScore > 0.4 ? 'medium' : 'quick';
    
    const riskScore = (100 - feasibility) / 100;
    const riskLevel = riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low';
    
    const confidence = Math.min(95, 60 + (wordCount / 5));
    
    return {
      feasibility,
      impact,
      innovation,
      resources,
      estimatedCost,
      timeToImplement,
      riskLevel,
      confidence: Math.round(confidence),
      summary: this.generateSummary(title, overall, feasibility, impact),
      strengths: this.generateStrengths(content, impact, innovation),
      considerations: this.generateConsiderations(content, feasibility, resources),
      recommendations: this.generateRecommendations(content, overall, riskLevel),
      generatedAt: new Date()
    };
  }
  
  private calculateScore(content: string, base: number, variance: number, bonus: boolean): number {
    const hash = this.stringHash(content);
    const random = (hash % 100) / 100;
    const score = base + (random * variance - variance / 2);
    const withBonus = bonus ? score + 15 : score;
    return Math.max(10, Math.min(95, Math.round(withBonus)));
  }
  
  private stringHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
  
  private generateSummary(title: string, overall: number, feasibility: number, impact: number): string {
    if (overall >= 80) {
      return `"${title}" shows exceptional potential with high feasibility (${feasibility}%) and significant impact (${impact}%). This idea is strongly recommended for implementation.`;
    } else if (overall >= 60) {
      return `"${title}" demonstrates solid potential with reasonable feasibility. Further refinement could enhance its impact and implementation prospects.`;
    } else {
      return `"${title}" presents interesting concepts but may require substantial development to achieve viable implementation. Consider additional research and planning.`;
    }
  }
  
  private generateStrengths(content: string, impact: number, innovation: number): string[] {
    const strengths = [];
    
    if (impact >= 70) strengths.push("High potential impact on target audience");
    if (innovation >= 70) strengths.push("Innovative approach to problem-solving");
    if (content.includes('student')) strengths.push("Directly addresses student needs");
    if (content.includes('campus') || content.includes('university')) strengths.push("Campus-focused solution");
    if (content.length > 200) strengths.push("Well-articulated concept with clear details");
    if (content.includes('sustainable') || content.includes('green')) strengths.push("Environmentally conscious approach");
    
    if (strengths.length === 0) {
      strengths.push("Addresses identifiable need or opportunity");
    }
    
    return strengths.slice(0, 3);
  }
  
  private generateConsiderations(content: string, feasibility: number, resources: number): string[] {
    const considerations = [];
    
    if (feasibility < 50) considerations.push("May require technical expertise or specialized resources");
    if (resources < 40) considerations.push("Could need significant budget or resource allocation");
    if (content.length < 100) considerations.push("Additional details needed for comprehensive assessment");
    if (!content.includes('how') && !content.includes('implement')) considerations.push("Implementation strategy needs further development");
    
    if (considerations.length === 0) {
      considerations.push("Standard project management practices should be followed");
    }
    
    return considerations.slice(0, 3);
  }
  
  private generateRecommendations(content: string, overall: number, riskLevel: string): string[] {
    const recommendations = [];
    
    if (overall >= 75) {
      recommendations.push("Proceed with detailed implementation planning");
      recommendations.push("Consider pilot program before full deployment");
    } else if (overall >= 50) {
      recommendations.push("Develop more detailed implementation plan");
      recommendations.push("Conduct feasibility study with stakeholders");
    } else {
      recommendations.push("Refine concept with additional research");
      recommendations.push("Seek feedback from potential users");
    }
    
    if (riskLevel === 'high') {
      recommendations.push("Implement risk mitigation strategies");
    }
    
    if (content.includes('app') || content.includes('software')) {
      recommendations.push("Consider technical architecture and platform selection");
    }
    
    return recommendations.slice(0, 3);
  }
  
  calculatePriority(analysis: AIAnalysis): number {
    const { feasibility, impact, innovation, resources } = analysis;
    const weightedScore = (impact * 0.4) + (feasibility * 0.3) + (innovation * 0.2) + (resources * 0.1);
    
    if (weightedScore >= 80) return 1;
    if (weightedScore >= 65) return 2;
    if (weightedScore >= 50) return 3;
    if (weightedScore >= 35) return 4;
    return 5;
  }
  
  getOverallScore(analysis: AIAnalysis): AIScores {
    return {
      overall: Math.round((analysis.feasibility + analysis.impact + analysis.innovation + analysis.resources) / 4),
      feasibility: analysis.feasibility,
      impact: analysis.impact,
      innovation: analysis.innovation,
      resources: analysis.resources
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();
