export class ProviderRateLimitError extends Error {
  readonly providerId: string;

  constructor(providerId: string, message = "Rate limit exceeded") {
    super(message);
    this.name = "ProviderRateLimitError";
    this.providerId = providerId;
  }
}

export class ProviderConfigError extends Error {
  readonly providerId: string;

  constructor(providerId: string, message = "Provider not configured") {
    super(message);
    this.name = "ProviderConfigError";
    this.providerId = providerId;
  }
}