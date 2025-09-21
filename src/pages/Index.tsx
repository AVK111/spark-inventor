import { useState } from "react";
import { ProblemInput } from "@/components/ProblemInput";
import { AgentWorkflow } from "@/components/AgentWorkflow";
import { SolutionsDashboard } from "@/components/SolutionsDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Lightbulb, TrendingUp, Users } from "lucide-react";

export interface Solution {
  id: string;
  title: string;
  description: string;
  feasibilityScore: number;
  costScore: number;
  sustainabilityScore: number;
  overallScore: number;
  category: string;
  estimatedImpact: string;
  timeframe: string;
}

const Index = () => {
  const [currentProblem, setCurrentProblem] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [workflowStage, setWorkflowStage] = useState<'input' | 'processing' | 'results'>('input');

  const handleProblemSubmit = async (problem: string) => {
    setCurrentProblem(problem);
    setWorkflowStage('processing');
    setIsProcessing(true);
    
    // Simulate agent workflow processing
    setTimeout(() => {
      const mockSolutions: Solution[] = [
        {
          id: "sol-1",
          title: "Ocean Plastic Collection Networks",
          description: "Deploy autonomous underwater drones with collection nets that work in coordination to gather plastic debris from ocean gyres.",
          feasibilityScore: 8.2,
          costScore: 6.5,
          sustainabilityScore: 9.1,
          overallScore: 7.9,
          category: "Technology",
          estimatedImpact: "Could remove 10,000 tons/year",
          timeframe: "2-3 years"
        },
        {
          id: "sol-2", 
          title: "Plastic-Eating Enzyme Distribution",
          description: "Scale production and deployment of engineered enzymes that break down PET plastics in marine environments.",
          feasibilityScore: 7.1,
          costScore: 8.0,
          sustainabilityScore: 8.8,
          overallScore: 8.0,
          category: "Biotechnology",
          estimatedImpact: "Accelerate natural breakdown by 600%",
          timeframe: "3-5 years"
        },
        {
          id: "sol-3",
          title: "Incentivized Collection Apps",
          description: "Mobile platform that rewards users with cryptocurrency for collecting and properly disposing of ocean plastic.",
          feasibilityScore: 9.0,
          costScore: 9.2,
          sustainabilityScore: 7.5,
          overallScore: 8.6,
          category: "Social Innovation", 
          estimatedImpact: "Engage 1M+ collectors globally",
          timeframe: "6-12 months"
        }
      ];
      
      setSolutions(mockSolutions);
      setIsProcessing(false);
      setWorkflowStage('results');
    }, 8000);
  };

  const handleReset = () => {
    setWorkflowStage('input');
    setCurrentProblem("");
    setSolutions([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-neural opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="innovation-text">Autonomous Innovation</span>
              <br />
              <span className="text-foreground">Agent</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Harness the power of multi-agent AI to generate, evaluate, and rank innovative solutions 
              to complex problems. Go beyond human brainstorming limitations.
            </p>
            
            {workflowStage === 'input' && (
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center gap-3 glass-card p-4 rounded-lg">
                  <Brain className="h-6 w-6 text-agent-retrieval" />
                  <span className="text-sm font-medium">Literature Scanning</span>
                </div>
                <div className="flex items-center gap-3 glass-card p-4 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-agent-generation" />
                  <span className="text-sm font-medium">Idea Generation</span>
                </div>
                <div className="flex items-center gap-3 glass-card p-4 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-agent-evaluation" />
                  <span className="text-sm font-medium">Smart Evaluation</span>
                </div>
                <div className="flex items-center gap-3 glass-card p-4 rounded-lg">
                  <Users className="h-6 w-6 text-agent-synthesis" />
                  <span className="text-sm font-medium">Solution Synthesis</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {workflowStage === 'input' && (
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl glass-card">
              <CardContent className="p-8">
                <ProblemInput onSubmit={handleProblemSubmit} />
              </CardContent>
            </Card>
          </div>
        )}

        {workflowStage === 'processing' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Processing Problem Statement</h2>
              <p className="text-muted-foreground mb-8">"{currentProblem}"</p>
              <Button variant="neural" onClick={handleReset}>
                Start New Analysis
              </Button>
            </div>
            <AgentWorkflow isActive={isProcessing} />
          </div>
        )}

        {workflowStage === 'results' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Generated Solutions</h2>
              <p className="text-muted-foreground mb-4">Problem: "{currentProblem}"</p>
              <Button variant="neural" onClick={handleReset}>
                Analyze New Problem
              </Button>
            </div>
            <SolutionsDashboard solutions={solutions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;