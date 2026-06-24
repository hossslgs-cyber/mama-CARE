/**
 * Validates that all required environment variables are present.
 * This is used to ensure the Supabase sync engine is correctly configured.
 */
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter(
    (key) => !process.env[key] || process.env[key] === 'https://example.supabase.co' || process.env[key] === 'anon-key'
  );

  if (missing.length > 0) {
    console.warn(
      `⚠️ MAMA-CARE WARNING: Missing or default environment variables detected: ${missing.join(', ')}. The application will run in Demo Mode (Offline-only, no cloud sync).`
    );
    return false;
  }

  return true;
}
