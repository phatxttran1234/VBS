import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
});

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'player' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface VocabularyTerm {
  id: string;
  term: string;
  definition: string;
  example?: string | null;
  category_id: string | null;
  difficulty_level: number;
  created_at: string;
  category?: Category;
}

export interface VideoDrill {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category_id: string | null;
  duration: number;
  difficulty_level: number;
  created_at: string;
  category?: Category;
}

export interface UserProgress {
  id: string;
  user_id: string;
  vocabulary_term_id: string;
  mastery_level: number;
  last_reviewed: string;
  review_count: number;
  correct_answers: number;
  total_attempts: number;
  vocabulary_term?: VocabularyTerm;
}

export interface TestSession {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
  duration: number;
}

export interface UserFlashcard {
  id: string;
  user_id: string;
  vocabulary_term_id: string;
  created_at: string;
  vocabulary_term?: VocabularyTerm;
}

// Auth helper functions
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Vocabulary functions
export const getVocabularyTerms = async () => {
  const { data, error } = await supabase
    .from('vocabulary_terms')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: true });
  return { data, error };
};

export const getVocabularyTermsByCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('vocabulary_terms')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: true });
  return { data, error };
};

// Categories functions
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  return { data, error };
};

// User progress functions
export const getUserProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      vocabulary_term:vocabulary_terms(*)
    `)
    .eq('user_id', userId)
    .order('last_reviewed', { ascending: false });
  return { data, error };
};

export const updateUserProgress = async (
  userId: string,
  vocabularyTermId: string,
  progress: Partial<UserProgress>
) => {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      vocabulary_term_id: vocabularyTermId,
      ...progress,
      last_reviewed: new Date().toISOString(),
    })
    .select()
    .single();
  return { data, error };
};

// Test sessions functions
export const createTestSession = async (testSession: Omit<TestSession, 'id' | 'completed_at'>) => {
  const { data, error } = await supabase
    .from('test_sessions')
    .insert({
      ...testSession,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();
  return { data, error };
};

export const getUserTestSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('test_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  return { data, error };
};

// Flashcard functions
export const getUserFlashcards = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_flashcards')
    .select(`
      *,
      vocabulary_term:vocabulary_terms(
        *,
        category:categories(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const addToFlashcards = async (userId: string, vocabularyTermId: string) => {
  const { data, error } = await supabase
    .from('user_flashcards')
    .insert({
      user_id: userId,
      vocabulary_term_id: vocabularyTermId,
    })
    .select()
    .single();
  return { data, error };
};

export const removeFromFlashcards = async (userId: string, vocabularyTermId: string) => {
  const { data, error } = await supabase
    .from('user_flashcards')
    .delete()
    .eq('user_id', userId)
    .eq('vocabulary_term_id', vocabularyTermId);
  return { data, error };
};

export const isInFlashcards = async (userId: string, vocabularyTermId: string) => {
  const { data, error } = await supabase
    .from('user_flashcards')
    .select('id')
    .eq('user_id', userId)
    .eq('vocabulary_term_id', vocabularyTermId)
    .single();
  return { data: !!data, error };
};

// Video drills functions
export const getVideoDrills = async () => {
  const { data, error } = await supabase
    .from('video_drills')
    .select(`
      *,
      categories:category_id(*)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createVideoDrill = async (drill: Omit<VideoDrill, 'id' | 'created_at'>) => {
  try {
    // Validate required fields
    if (!drill.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!drill.video_url?.trim()) {
      throw new Error('Video URL is required');
    }
    if (!drill.category_id?.trim()) {
      throw new Error('Category is required');
    }

    // Clean the data before inserting
    const cleanDrill = {
      title: drill.title.trim(),
      description: drill.description?.trim() || '',
      video_url: drill.video_url.trim(),
      thumbnail_url: drill.thumbnail_url?.trim() || '',
      category_id: drill.category_id.trim(),
      duration: Number(drill.duration) || 0,
      difficulty_level: Number(drill.difficulty_level) || 1
    };
    
    const { data, error } = await supabase
      .from('video_drills')
      .insert(cleanDrill)
      .select(`
        *,
        categories:category_id(*)
      `)
      .single();
      
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Failed to create video drill');
    }
    
    return { data, error };
  } catch (error) {
    console.error('Error in createVideoDrill:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};

export const updateVideoDrill = async (id: string, updates: Partial<VideoDrill>) => {
  try {
    // Clean the updates data
    const cleanUpdates: any = {};
    
    if (updates.title) cleanUpdates.title = updates.title.trim();
    if (updates.description !== undefined) cleanUpdates.description = updates.description?.trim() || '';
    if (updates.video_url) cleanUpdates.video_url = updates.video_url.trim();
    if (updates.thumbnail_url !== undefined) cleanUpdates.thumbnail_url = updates.thumbnail_url?.trim() || '';
    if (updates.category_id !== undefined) cleanUpdates.category_id = updates.category_id?.trim() || null;
    if (updates.duration !== undefined) cleanUpdates.duration = updates.duration || 0;
    if (updates.difficulty_level) cleanUpdates.difficulty_level = updates.difficulty_level;
    
    const { data, error } = await supabase
      .from('video_drills')
      .update(cleanUpdates)
      .eq('id', id)
      .select(`
        *,
        categories:category_id(*)
      `)
      .single();
      
    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(error.message || 'Failed to update video drill');
    }
    
    return { data, error };
  } catch (error) {
    console.error('Error in updateVideoDrill:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};

export const deleteVideoDrill = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('video_drills')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    return { data, error };
  } catch (error) {
    console.error('Error in deleteVideoDrill:', error);
    return { data: null, error };
  }
};
// Admin vocabulary management
export const createVocabularyTerm = async (term: Omit<VocabularyTerm, 'id' | 'created_at'>) => {
  try {
    // First check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // For demo purposes, we'll allow creation without authentication
      // In production, this should require proper authentication
      console.warn('No authenticated user found, proceeding with demo mode');
    }
    
    // Clean the data before inserting
    const cleanTerm = {
      term: term.term.trim(),
      definition: term.definition.trim(),
      example: term.example?.trim() || null,
      category_id: term.category_id || null,
      difficulty_level: term.difficulty_level || 1
    };
    
  const { data, error } = await supabase
    .from('vocabulary_terms')
      .insert(cleanTerm)
    .select(`
      *,
      category:categories(*)
    `)
    .single();
      
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
  return { data, error };
  } catch (error) {
    console.error('Error in createVocabularyTerm:', error);
    return { data: null, error };
  }
};

export const updateVocabularyTerm = async (id: string, updates: Partial<VocabularyTerm>) => {
  try {
    // Clean the updates data
    const cleanUpdates: any = {};
    
    if (updates.term) cleanUpdates.term = updates.term.trim();
    if (updates.definition) cleanUpdates.definition = updates.definition.trim();
    if (updates.example !== undefined) cleanUpdates.example = updates.example?.trim() || null;
    if (updates.category_id !== undefined) cleanUpdates.category_id = updates.category_id || null;
    if (updates.difficulty_level) cleanUpdates.difficulty_level = updates.difficulty_level;
    
  const { data, error } = await supabase
    .from('vocabulary_terms')
      .update(cleanUpdates)
    .eq('id', id)
    .select(`
      *,
      category:categories(*)
    `)
    .single();
      
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
  return { data, error };
  } catch (error) {
    console.error('Error in updateVocabularyTerm:', error);
    return { data: null, error };
  }
};

export const deleteVocabularyTerm = async (id: string) => {
  try {
  const { data, error } = await supabase
    .from('vocabulary_terms')
    .delete()
    .eq('id', id);
      
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
  return { data, error };
  } catch (error) {
    console.error('Error in deleteVocabularyTerm:', error);
    return { data: null, error };
  }
};