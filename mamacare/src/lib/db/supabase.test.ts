// MODIFIED: Updated import to new supabase client location.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('isSupabaseConfigured', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns false when env vars are not set', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const { isSupabaseConfigured } = await import('../supabase/client');
    expect(isSupabaseConfigured()).toBe(false);
  });

  it('returns false when only URL is set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const { isSupabaseConfigured } = await import('../supabase/client');
    expect(isSupabaseConfigured()).toBe(false);
  });

  it('returns false when only anon key is set', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key-value';
    const { isSupabaseConfigured } = await import('../supabase/client');
    expect(isSupabaseConfigured()).toBe(false);
  });

  it('returns true when both env vars are set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key-value';
    const { isSupabaseConfigured } = await import('../supabase/client');
    expect(isSupabaseConfigured()).toBe(true);
  });
});
