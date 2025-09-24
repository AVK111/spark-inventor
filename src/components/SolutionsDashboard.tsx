import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, TrendingUp, Leaf, Clock, ChevronRight, Bot, Brain } from "lucide-react";
import { Solution, LiteratureReview } from "@/pages/Index";

interface SolutionsDashboardProps {
  solutions: Solution[];
  literatureReview?: LiteratureReview | null;
  aiSource?: string;
}

export const SolutionsDashboard = ({ solutions, literatureReview, aiSource }: SolutionsDashboardProps) => {
  const getScoreValue = (scoreStr: string): number => {
    const match = scoreStr.match(/(\d+)\/\d+/);
    return match ? parseInt(match[1]) : 0;
  };

  const sortedSolutions = [...solutions].sort((a, b) => getScoreValue(b.score) - getScoreValue(a.score));

  const getScoreColor = (scoreStr: string) => {
    const score = getScoreValue(scoreStr);
    if (score >= 8) return "text-status-complete";
    if (score >= 6) return "text-status-processing";
    return "text-status-error";
  };

  const getScoreBackground = (scoreStr: string) => {
    const score = getScoreValue(scoreStr);
    if (score >= 8) return "bg-status-complete/10";
    if (score >= 6) return "bg-status-processing/10";
    return "bg-status-error/10";
  };

  const getSourceInfo = (source: string) => {
    switch (source) {
      case 'gemini':
        return {
          name: 'Gemini AI',
          description: 'Research-backed analysis using Google\'s Gemini model with real-time data access',
          color: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20',
          textColor: 'text-blue-600 dark:text-blue-400',
          icon: '🧠'
        };
      case 'openai':
        return {
          name: 'OpenAI GPT',
          description: 'Advanced AI analysis powered by OpenAI\'s language models',
          color: 'bg-gradient-to-r from-green-500/20 to-teal-500/20',
          textColor: 'text-green-600 dark:text-green-400',
          icon: '⚡'
        };
      default:
        return {
          name: 'Demo Mode',
          description: 'Sample solutions for demonstration - Connect AI for real analysis',
          color: 'bg-gradient-to-r from-orange-500/20 to-red-500/20',
          textColor: 'text-orange-600 dark:text-orange-400',
          icon: '🎭'
        };
    }
  };

  const sourceInfo = getSourceInfo(aiSource || 'fallback');

  return (
    <div className="space-y-6">
      {/* AI Source Indicator */}
      <Card className="glass-card border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Analysis Powered By</p>
                <p className="text-sm text-muted-foreground">{sourceInfo.description}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full ${sourceInfo.color} ${sourceInfo.textColor}`}>
              <span className="text-sm font-semibold">{sourceInfo.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  {Math.max(...solutions.map(s => getScoreValue(s.score))).toFixed(0)}/10
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
                  {(solutions.reduce((sum, s) => sum + getScoreValue(s.score), 0) / solutions.length).toFixed(1)}/10
                </p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-agent-retrieval" />
              <div>
                <p className="text-2xl font-bold">RAG</p>
                <p className="text-sm text-muted-foreground">Analysis Mode</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solutions List */}
      <div className="space-y-4">
        {sortedSolutions.map((solution, index) => (
          <Card key={solution.solution_id} className="glass-card hover:scale-[1.02] transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm font-bold">
                      Solution #{solution.solution_id}
                    </Badge>
                    <Badge className="bg-agent-generation/20 text-agent-generation border-agent-generation/30">
                      RAG Solution
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">AI-Generated Solution #{solution.solution_id}</CardTitle>
                </div>
                <div className={`text-right p-3 rounded-lg ${getScoreBackground(solution.score)}`}>
                  <p className={`text-2xl font-bold ${getScoreColor(solution.score)}`}>
                    {solution.score}
                  </p>
                  <p className="text-xs text-muted-foreground">RAG Score</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-agent-generation" />
                  Step-by-Step Solution:
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {solution.explanation}
                </p>
              </div>
              
              {/* References Section */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-agent-retrieval" />
                  Research References:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {solution.references.map((ref, refIndex) => (
                    <div key={refIndex} className="flex items-start gap-2 p-2 bg-muted/30 rounded-md">
                      <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{ref}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button variant="outline" size="sm" className="gap-2">
                  View Analysis Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};