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
import { supabase } from "@/integrations/supabase/client";

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
      
      // Generate real solutions using OpenAI
      try {
        console.log('Calling generate-solutions function...');
        const { data: solutionsData, error: functionsError } = await supabase.functions.invoke('generate-solutions', {
          body: { problemDescription }
        });

        if (functionsError) {
          console.error('Edge function error:', functionsError);
          throw functionsError;
        }

        if (!solutionsData?.solutions) {
          console.error('No solutions returned from API');
          throw new Error('No solutions generated');
        }

        const generatedSolutions = solutionsData.solutions;

        // Save AI-generated solutions to database
        const dbSolutions = await Promise.all(
          generatedSolutions.map((sol: any) => 
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
        const frontendSolutions: Solution[] = dbSolutions.map((sol, index) => {
          const categoryMap: Record<string, string> = {
            'technology': 'Technology',
            'biotechnology': 'Biotechnology', 
            'social_innovation': 'Social Innovation',
            'policy': 'Policy',
            'business_model': 'Business Model'
          };

          return {
            id: sol.id,
            title: sol.title,
            description: sol.description,
            feasibilityScore: sol.feasibility_score / 10,
            costScore: sol.feasibility_score >= 80 ? 9.2 : 
                      sol.feasibility_score >= 70 ? 8.0 : 6.5,
            sustainabilityScore: sol.sustainability_score / 10,
            overallScore: (sol.feasibility_score + sol.sustainability_score + sol.innovation_score) / 30,
            category: categoryMap[sol.agent_type] || 'Innovation',
            estimatedImpact: `Potential high-impact solution (Score: ${sol.innovation_score})`,
            timeframe: sol.feasibility_score >= 80 ? "1-2 years" : 
                      sol.feasibility_score >= 60 ? "2-4 years" : "3-5 years"
          };
        });
          
          setSolutions(frontendSolutions);
          setIsProcessing(false);
          setWorkflowStage('results');
          
          // Update problem status to completed
          await updateProblemStatus(problem.id, 'completed');
          
        toast.success("Analysis complete! Generated " + frontendSolutions.length + " AI-powered solutions.");
      } catch (error) {
        console.error('Error generating solutions:', error);
        toast.error("Failed to generate solutions. Please try again.");
        setIsProcessing(false);
        setWorkflowStage('input');
      }
      
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