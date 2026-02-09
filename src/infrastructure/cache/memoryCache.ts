type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  constructor(private defaultTtlMs: number) {}

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.store.set(key, { value, expiresAt });
  }

  makeKey(parts: Array<string | number | boolean | null | undefined>): string {
    return parts.map(p => String(p ?? "")).join("|");
  }
}

export const marketDataCache = new MemoryCache(6 * 60 * 60 * 1000); // 6h