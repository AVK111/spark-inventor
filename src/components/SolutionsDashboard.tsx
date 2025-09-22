import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ExternalLink, TrendingUp, Leaf, Clock, DollarSign, ChevronRight } from "lucide-react";
import { Solution, LiteratureReview } from "@/pages/Index";

interface SolutionsDashboardProps {
  solutions: Solution[];
  literatureReview?: LiteratureReview | null;
}

export const SolutionsDashboard = ({ solutions, literatureReview }: SolutionsDashboardProps) => {
  const sortedSolutions = [...solutions].sort((a, b) => b.overallScore - a.overallScore);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-status-complete";
    if (score >= 6) return "text-status-processing";
    return "text-status-error";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 8) return "bg-status-complete/10";
    if (score >= 6) return "bg-status-processing/10";
    return "bg-status-error/10";
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
        return 'bg-agent-generation/20 text-agent-generation border-agent-generation/30';
      case 'biotechnology':
        return 'bg-agent-synthesis/20 text-agent-synthesis border-agent-synthesis/30';
      case 'social innovation':
        return 'bg-agent-evaluation/20 text-agent-evaluation border-agent-evaluation/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Literature Review Section */}
      {literatureReview && (
        <Card className="glass-card border-agent-retrieval/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-agent-retrieval" />
              Research Analysis & Literature Review
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Key Research Insights:</h4>
                <p className="text-muted-foreground text-sm">{literatureReview.keyFindings}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Search Terms Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {literatureReview.searchTerms.map((term, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Research Sources Analyzed:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {literatureReview.researchSources.map((source, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{source}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-agent-generation mb-2">
              {solutions.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Solutions</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-status-complete" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.max(...solutions.map(s => s.overallScore)).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Highest Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-agent-synthesis" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.max(...solutions.map(s => s.sustainabilityScore)).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Best Sustainability</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-agent-retrieval" />
              <div>
                <p className="text-2xl font-bold">8s</p>
                <p className="text-sm text-muted-foreground">Analysis Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solutions List */}
      <div className="space-y-4">
        {sortedSolutions.map((solution, index) => (
          <Card key={solution.id} className="glass-card hover:scale-[1.02] transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm font-bold">
                      #{index + 1}
                    </Badge>
                    <Badge className={getCategoryColor(solution.category)}>
                      {solution.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{solution.title}</CardTitle>
                </div>
                <div className={`text-right p-3 rounded-lg ${getScoreBackground(solution.overallScore)}`}>
                  <p className={`text-2xl font-bold ${getScoreColor(solution.overallScore)}`}>
                    {solution.overallScore.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall Score</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {solution.description}
              </p>
              
              {/* Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Feasibility
                    </span>
                    <span className="text-sm font-bold">{solution.feasibilityScore.toFixed(1)}</span>
                  </div>
                  <Progress value={solution.feasibilityScore * 10} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Cost Efficiency
                    </span>
                    <span className="text-sm font-bold">{solution.costScore.toFixed(1)}</span>
                  </div>
                  <Progress value={solution.costScore * 10} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      Sustainability
                    </span>
                    <span className="text-sm font-bold">{solution.sustainabilityScore.toFixed(1)}</span>
                  </div>
                  <Progress value={solution.sustainabilityScore * 10} />
                </div>
              </div>
              
              {/* Impact and Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Impact</p>
                  <p className="text-sm font-semibold">{solution.estimatedImpact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Implementation Timeframe</p>
                  <p className="text-sm font-semibold">{solution.timeframe}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="neural" size="sm">
                  View Detailed Analysis
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};