// src/lib/deepseekAI.ts
import type { AIAnalysis } from '@/types';

class DeepSeekAIService {
  async analyzeIdea(
    title: string,
    description: string,
    tags: string[] = []
  ): Promise<AIAnalysis> {
    // Simulate AI processing delay
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

    // Ensure all required fields are included
    const scalability = 50;
    const risk = 50;
    const value = 50;
    const alignment = 50;

    const overall = Math.round((feasibility + impact + innovation + resources) / 4);

    const costScore = Math.random();
    const estimatedCost = costScore > 0.7 ? 'high' : costScore > 0.4 ? 'medium' : 'low';

    const timeScore = Math.random();
    const timeToImplement = timeScore > 0.7 ? 'long' : timeScore > 0.4 ? 'medium' : 'quick';

    const riskLevel = (100 - feasibility) / 100 > 0.7 ? 'high' : (100 - feasibility) / 100 > 0.4 ? 'medium' : 'low';
    const confidence = Math.min(95, 60 + wordCount / 5);

    // Return complete AIAnalysis object with ALL required properties
    return {
      // Core scores (1-100)
      feasibility,
      impact,
      innovation,
      resources,
      scalability,
      risk,
      value,
      alignment,
      
      // Categorical assessments
      estimatedCost,
      timeToImplement,
      riskLevel,
      
      // Metadata
      confidence: Math.round(confidence),
      summary: this.generateSummary(title, overall, feasibility, impact),
      strengths: this.generateStrengths(content, impact, innovation),
      considerations: this.generateConsiderations(content, feasibility, resources),
      recommendations: this.generateRecommendations(content, overall, riskLevel),
      generatedAt: new Date(),
    };
  }

  // ... rest of your methods remain the same
  private calculateScore(content: string, base: number, variance: number, bonus: boolean): number {
    const hash = this.stringHash(content);
    const random = (hash % 100) / 100;
    const score = base + (random * variance - variance / 2);
    return Math.max(10, Math.min(95, Math.round(bonus ? score + 15 : score)));
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
    if (overall >= 80) return `"${title}" shows exceptional potential with high feasibility (${feasibility}%) and significant impact (${impact}%).`;
    if (overall >= 60) return `"${title}" demonstrates solid potential with reasonable feasibility.`;
    return `"${title}" presents interesting concepts but may require substantial development.`;
  }

  private generateStrengths(content: string, impact: number, innovation: number): string[] {
    const strengths: string[] = [];
    if (impact >= 70) strengths.push("High potential impact on target audience");
    if (innovation >= 70) strengths.push("Innovative approach to problem-solving");
    if (content.includes('student')) strengths.push("Directly addresses student needs");
    if (content.includes('campus') || content.includes('university')) strengths.push("Campus-focused solution");
    if (strengths.length === 0) strengths.push("Addresses identifiable need or opportunity");
    return strengths.slice(0, 3);
  }

  private generateConsiderations(content: string, feasibility: number, resources: number): string[] {
    const considerations: string[] = [];
    if (feasibility < 50) considerations.push("May require technical expertise or specialized resources");
    if (resources < 40) considerations.push("Could need significant budget or resource allocation");
    if (considerations.length === 0) considerations.push("Standard project management practices should be followed");
    return considerations.slice(0, 3);
  }

  private generateRecommendations(content: string, overall: number, riskLevel: string): string[] {
    const recommendations: string[] = [];
    if (overall >= 75) recommendations.push("Proceed with detailed implementation planning");
    else if (overall >= 50) recommendations.push("Develop more detailed implementation plan");
    else recommendations.push("Refine concept with additional research");
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

  getOverallScore(analysis: AIAnalysis): number {
    return Math.round((analysis.feasibility + analysis.impact + analysis.innovation + analysis.resources) / 4);
  }
}

export const deepSeekAIService = new DeepSeekAIService();