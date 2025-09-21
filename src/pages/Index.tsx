import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProblemInput } from "@/components/ProblemInput";
import { AgentWorkflow } from "@/components/AgentWorkflow";
import { SolutionsDashboard } from "@/components/SolutionsDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Lightbulb, TrendingUp, Users, LogOut } from "lucide-react";
import { createProblem, updateProblemStatus, createSolution, getSolutionsForProblem, Problem, Solution as DBSolution } from "@/lib/database";
import { toast } from "sonner";

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
  const { user, signOut } = useAuth();
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [workflowStage, setWorkflowStage] = useState<'input' | 'processing' | 'results'>('input');

  const handleProblemSubmit = async (problemDescription: string) => {
    try {
      // Save problem to database
      const problem = await createProblem(problemDescription);
      setCurrentProblem(problem);
      setWorkflowStage('processing');
      setIsProcessing(true);
      
      // Update problem status to processing
      await updateProblemStatus(problem.id, 'processing');
      
      // Simulate agent workflow processing
      setTimeout(async () => {
        try {
          // Create mock solutions and save them to database
          const mockSolutionsData = [
            {
              title: "Ocean Plastic Collection Networks",
              description: "Deploy autonomous underwater drones with collection nets that work in coordination to gather plastic debris from ocean gyres.",
              feasibilityScore: 82,
              costEstimate: "$2.5M initial investment",
              sustainabilityScore: 91,
              innovationScore: 79,
              agentType: "technology"
            },
            {
              title: "Plastic-Eating Enzyme Distribution",
              description: "Scale production and deployment of engineered enzymes that break down PET plastics in marine environments.",
              feasibilityScore: 71,
              costEstimate: "$1.8M development cost",
              sustainabilityScore: 88,
              innovationScore: 80,
              agentType: "biotechnology"
            },
            {
              title: "Incentivized Collection Apps",
              description: "Mobile platform that rewards users with cryptocurrency for collecting and properly disposing of ocean plastic.",
              feasibilityScore: 90,
              costEstimate: "$500K development cost",
              sustainabilityScore: 75,
              innovationScore: 86,
              agentType: "social_innovation"
            }
          ];

          // Save solutions to database
          const dbSolutions = await Promise.all(
            mockSolutionsData.map(sol => 
              createSolution(
                problem.id,
                sol.title,
                sol.description,
                sol.feasibilityScore,
                sol.costEstimate,
                sol.sustainabilityScore,
                sol.innovationScore,
                sol.agentType
              )
            )
          );

          // Convert to frontend format
          const frontendSolutions: Solution[] = dbSolutions.map((sol, index) => ({
            id: sol.id,
            title: sol.title,
            description: sol.description,
            feasibilityScore: sol.feasibility_score / 10,
            costScore: mockSolutionsData[index].feasibilityScore >= 80 ? 9.2 : 
                      mockSolutionsData[index].feasibilityScore >= 70 ? 8.0 : 6.5,
            sustainabilityScore: sol.sustainability_score / 10,
            overallScore: (sol.feasibility_score + sol.sustainability_score + sol.innovation_score) / 30,
            category: sol.agent_type === 'technology' ? 'Technology' : 
                     sol.agent_type === 'biotechnology' ? 'Biotechnology' : 'Social Innovation',
            estimatedImpact: index === 0 ? "Could remove 10,000 tons/year" :
                           index === 1 ? "Accelerate natural breakdown by 600%" :
                           "Engage 1M+ collectors globally",
            timeframe: index === 0 ? "2-3 years" : index === 1 ? "3-5 years" : "6-12 months"
          }));
          
          setSolutions(frontendSolutions);
          setIsProcessing(false);
          setWorkflowStage('results');
          
          // Update problem status to completed
          await updateProblemStatus(problem.id, 'completed');
          
          toast.success("Analysis complete! Generated " + frontendSolutions.length + " solutions.");
        } catch (error) {
          console.error('Error creating solutions:', error);
          toast.error("Failed to save solutions. Please try again.");
          setIsProcessing(false);
        }
      }, 8000);
      
    } catch (error) {
      console.error('Error creating problem:', error);
      toast.error("Failed to save problem. Please try again.");
    }
  };

  const handleReset = () => {
    setWorkflowStage('input');
    setCurrentProblem(null);
    setSolutions([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with sign out */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

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
              <p className="text-muted-foreground mb-8">"{currentProblem?.description}"</p>
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
              <p className="text-muted-foreground mb-4">Problem: "{currentProblem?.description}"</p>
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