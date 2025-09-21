import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Search, Lightbulb, BarChart3, CheckCircle, Clock } from "lucide-react";

interface AgentStep {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'waiting' | 'active' | 'complete';
  progress: number;
  details: string[];
}

interface AgentWorkflowProps {
  isActive: boolean;
}

export const AgentWorkflow = ({ isActive }: AgentWorkflowProps) => {
  const [steps, setSteps] = useState<AgentStep[]>([
    {
      id: 'retrieval',
      name: 'Retrieval Agents',
      description: 'Scanning literature, patents, and recent developments',
      icon: Search,
      color: 'text-agent-retrieval',
      status: 'waiting',
      progress: 0,
      details: []
    },
    {
      id: 'generation', 
      name: 'Idea Generation',
      description: 'Generating innovative solution concepts',
      icon: Lightbulb,
      color: 'text-agent-generation', 
      status: 'waiting',
      progress: 0,
      details: []
    },
    {
      id: 'evaluation',
      name: 'Evaluation Agents',
      description: 'Scoring solutions on feasibility, cost, and sustainability',
      icon: BarChart3,
      color: 'text-agent-evaluation',
      status: 'waiting', 
      progress: 0,
      details: []
    },
    {
      id: 'synthesis',
      name: 'Solution Synthesis',
      description: 'Ranking and preparing final recommendations',
      icon: Brain,
      color: 'text-agent-synthesis',
      status: 'waiting',
      progress: 0,
      details: []
    }
  ]);

  useEffect(() => {
    if (!isActive) return;

    const updateStep = (stepId: string, status: AgentStep['status'], progress: number, details: string[]) => {
      setSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status, progress, details }
          : step
      ));
    };

    // Simulate the workflow progression
    const workflow = async () => {
      // Step 1: Retrieval Agents
      updateStep('retrieval', 'active', 0, ['Initializing search parameters...']);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateStep('retrieval', 'active', 25, ['Scanning scientific literature...']);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateStep('retrieval', 'active', 50, ['Analyzing patent databases...']);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      updateStep('retrieval', 'active', 75, ['Processing recent news and developments...']);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      updateStep('retrieval', 'complete', 100, ['Found 247 relevant sources', 'Extracted 156 key insights']);
      
      // Step 2: Generation
      updateStep('generation', 'active', 0, ['Synthesizing retrieved knowledge...']);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      updateStep('generation', 'active', 30, ['Generating solution concepts...']);
      await new Promise(resolve => setTimeout(resolve, 900));
      
      updateStep('generation', 'active', 70, ['Refining and diversifying ideas...']);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateStep('generation', 'complete', 100, ['Generated 23 unique solutions', 'Categorized by approach type']);
      
      // Step 3: Evaluation
      updateStep('evaluation', 'active', 0, ['Initializing scoring rubrics...']);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      updateStep('evaluation', 'active', 25, ['Assessing technical feasibility...']);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      updateStep('evaluation', 'active', 50, ['Calculating cost implications...']);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      updateStep('evaluation', 'active', 75, ['Evaluating sustainability impact...']);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateStep('evaluation', 'complete', 100, ['Scored all solutions', 'Applied weighted criteria']);
      
      // Step 4: Synthesis
      updateStep('synthesis', 'active', 0, ['Ranking solutions by overall score...']);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateStep('synthesis', 'active', 40, ['Preparing detailed analysis...']);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      updateStep('synthesis', 'active', 80, ['Generating implementation roadmaps...']);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      updateStep('synthesis', 'complete', 100, ['Top 3 solutions identified', 'Analysis complete']);
    };

    workflow();
  }, [isActive]);

  const getStatusIcon = (status: AgentStep['status']) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'active':
        return <div className="h-4 w-4 rounded-full bg-status-processing animate-pulse" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-status-complete" />;
    }
  };

  const getStatusBadge = (status: AgentStep['status']) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="outline">Waiting</Badge>;
      case 'active':
        return <Badge className="bg-status-processing text-black">Processing</Badge>;
      case 'complete':
        return <Badge className="bg-status-complete text-white">Complete</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <Card key={step.id} className={`glass-card transition-all duration-500 ${
            step.status === 'active' ? 'agent-pulse' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Icon className={`h-6 w-6 ${step.color}`} />
                {getStatusIcon(step.status)}
              </div>
              <CardTitle className="text-lg">{step.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                {getStatusBadge(step.status)}
                <span className="text-sm font-medium">{step.progress}%</span>
              </div>
              
              <Progress value={step.progress} className="h-2" />
              
              {step.details.length > 0 && (
                <div className="space-y-1">
                  {step.details.map((detail, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      • {detail}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};