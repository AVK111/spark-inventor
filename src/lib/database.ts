import { supabase } from "@/integrations/supabase/client";

export interface Problem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category?: string;
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Solution {
  id: string;
  problem_id: string;
  user_id: string;
  title: string;
  description: string;
  feasibility_score: number;
  cost_estimate: string;
  sustainability_score: number;
  innovation_score: number;
  agent_type?: string;
  created_at: string;
}

// Problem operations
export const createProblem = async (description: string, title?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('problems')
    .insert([
      {
        user_id: user.id,
        title: title || description.slice(0, 100) + (description.length > 100 ? '...' : ''),
        description,
        status: 'pending' as const
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Problem;
};

export const getUserProblems = async (): Promise<Problem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Problem[];
};

export const updateProblemStatus = async (problemId: string, status: 'pending' | 'processing' | 'completed'): Promise<Problem> => {
  const { data, error } = await supabase
    .from('problems')
    .update({ status })
    .eq('id', problemId)
    .select()
    .single();

  if (error) throw error;
  return data as Problem;
};

// Solution operations
export const createSolution = async (
  problemId: string,
  title: string,
  description: string,
  feasibilityScore: number,
  costEstimate: string,
  sustainabilityScore: number,
  innovationScore: number,
  agentType?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('solutions')
    .insert([
      {
        problem_id: problemId,
        user_id: user.id,
        title,
        description,
        feasibility_score: feasibilityScore,
        cost_estimate: costEstimate,
        sustainability_score: sustainabilityScore,
        innovation_score: innovationScore,
        agent_type: agentType
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSolutionsForProblem = async (problemId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('solutions')
    .select('*')
    .eq('problem_id', problemId)
    .eq('user_id', user.id)
    .order('innovation_score', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteProblem = async (problemId: string) => {
  const { error } = await supabase
    .from('problems')
    .delete()
    .eq('id', problemId);

  if (error) throw error;
};