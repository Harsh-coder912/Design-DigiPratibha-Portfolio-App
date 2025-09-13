// Mock Supabase configuration for DigiPratibha
// Prevents deployment issues by disabling real Supabase connections

export const projectId = "mock-project-disabled";
export const publicAnonKey = "mock-key-disabled";
export const supabaseUrl = "https://mock-disabled.supabase.co";

// Always use mock data to prevent deployment issues
export const isDevelopment = true;
export const useMockData = true;