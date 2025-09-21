-- Create problems table to store user problem submissions
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create solutions table to store AI-generated solutions
CREATE TABLE public.solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  feasibility_score INTEGER CHECK (feasibility_score >= 0 AND feasibility_score <= 100),
  cost_estimate TEXT,
  sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
  innovation_score INTEGER CHECK (innovation_score >= 0 AND innovation_score <= 100),
  agent_type TEXT, -- 'retrieval', 'ideation', 'evaluator'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;

-- Create policies for problems table
CREATE POLICY "Users can view their own problems" 
ON public.problems 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own problems" 
ON public.problems 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problems" 
ON public.problems 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own problems" 
ON public.problems 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for solutions table
CREATE POLICY "Users can view solutions for their problems" 
ON public.solutions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create solutions for their problems" 
ON public.solutions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update solutions for their problems" 
ON public.solutions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete solutions for their problems" 
ON public.solutions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_problems_updated_at
BEFORE UPDATE ON public.problems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();