import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit, cleanupRateLimitMap } from '../rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    cleanupRateLimitMap();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanupRateLimitMap();
  });

  it('allows requests within the limit', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '192.168.1.1');

    for (let i = 0; i < 10; i++) {
      const result = rateLimit(headers);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(30 - (i + 1));
    }
  });

  it('blocks requests exceeding the limit', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '192.168.1.2');

    for (let i = 0; i < 30; i++) {
      const result = rateLimit(headers);
      expect(result.allowed).toBe(true);
    }

    const blocked = rateLimit(headers);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('tracks different IPs separately', () => {
    const headers1 = new Headers();
    headers1.set('x-forwarded-for', '10.0.0.1');
    const headers2 = new Headers();
    headers2.set('x-forwarded-for', '10.0.0.2');

    for (let i = 0; i < 30; i++) {
      rateLimit(headers1);
    }

    // IP 1 is blocked, IP 2 should still be allowed
    expect(rateLimit(headers1).allowed).toBe(false);
    expect(rateLimit(headers2).allowed).toBe(true);
  });

  it('resets after the window expires', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '10.0.0.3');

    for (let i = 0; i < 30; i++) {
      rateLimit(headers);
    }
    expect(rateLimit(headers).allowed).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(61 * 1000);

    expect(rateLimit(headers).allowed).toBe(true);
  });
});
