export async function fetchWithValidation(
  url: string,
  options: RequestInit,
  requiredEnvVars: string[] = []
): Promise<any> {
  // Validate environment variables
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  const response = await fetch(url, options);
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to process the requested URL.");
  }

  return data;
}
