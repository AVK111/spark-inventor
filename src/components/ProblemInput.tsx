import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Lightbulb } from "lucide-react";

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
}

export const ProblemInput = ({ onSubmit }: ProblemInputProps) => {
  const [problem, setProblem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    await onSubmit(problem.trim());
    setProblem(""); // Clear input after successful submission
    setIsSubmitting(false);
  };

  const exampleProblems = [
    "Reduce ocean plastic pollution",
    "Improve urban air quality",
    "Increase renewable energy adoption",
    "Combat food waste in restaurants",
    "Enhance remote learning engagement"
  ];

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-6">
        <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse-glow" />
        <h2 className="text-2xl font-bold mb-2">Describe Your Challenge</h2>
        <p className="text-muted-foreground">
          Our AI agents will analyze literature, generate solutions, and rank them by feasibility, cost, and sustainability.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g., Reduce ocean plastic pollution by developing innovative collection and recycling methods..."
            className="min-h-[120px] resize-none text-base"
            disabled={isSubmitting}
          />
        </div>
        
        <Button 
          type="submit" 
          variant="hero" 
          size="lg" 
          className="w-full"
          disabled={!problem.trim() || isSubmitting}
        >
          <Send className="h-5 w-5 mr-2" />
          {isSubmitting ? "Initializing Agents..." : "Launch Innovation Analysis"}
        </Button>
      </form>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">Or try one of these examples:</p>
        <div className="grid grid-cols-1 gap-2">
          {exampleProblems.map((example, index) => (
            <Button
              key={index}
              variant="neural"
              size="sm"
              className="justify-start text-left h-auto py-3 px-4"
              onClick={() => setProblem(example)}
              disabled={isSubmitting}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};