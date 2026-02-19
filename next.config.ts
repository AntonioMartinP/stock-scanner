import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

/**
 * HTTP security headers applied to every response.
 *
 * CSP is tuned to the exact third-party origins used by this app:
 *   - TradingView  → script + eval from s3.tradingview.com, iframes from *.tradingview.com
 *   - Firebase Auth → XHR/fetch to *.googleapis.com and *.firebaseio.com
 *   - Tailwind CSS  → inline styles required (style-src 'unsafe-inline')
 *
 * Note: 'unsafe-eval' is required by TradingView's charting engine (tv.js uses
 * Function() constructor internally). Removing it breaks the chart render.
 */
const CSP = [
  "default-src 'self'",
  // tv.js is injected via document.createElement; the charting engine needs eval()
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' s3.tradingview.com *.tradingview.com",
  // Tailwind generates inline styles at build time
  "style-src 'self' 'unsafe-inline' *.tradingview.com",
  // TradingView widget creates iframes from multiple *.tradingview.com subdomains
  "frame-src *.tradingview.com",
  // Images: data URIs and TradingView chart assets
  "img-src 'self' data: blob: *.tradingview.com",
  // Firebase Auth REST + websocket; TradingView data streams
  "connect-src 'self' *.googleapis.com *.firebaseio.com *.firebase.com identitytoolkit.googleapis.com wss://*.tradingview.com https://*.tradingview.com",
  // TradingView loads fonts from its own CDN
  "font-src 'self' *.tradingview.com data:",
  // Block Flash and other plugins
  "object-src 'none'",
  // Restrict <base> to same origin
  "base-uri 'self'",
  // Only allow form submissions to same origin
  "form-action 'self'",
  // Allow TradingView workers
  "worker-src 'self' blob: *.tradingview.com",
].join('; ');

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options',            value: 'nosniff' },
  // Allow iframes only from same origin (TradingView embeds outward, not inward)
  { key: 'X-Frame-Options',                   value: 'SAMEORIGIN' },
  // Limit referrer information sent to third parties
  { key: 'Referrer-Policy',                   value: 'strict-origin-when-cross-origin' },
  // Restrict browser feature APIs not used by this app
  { key: 'Permissions-Policy',                value: 'camera=(), microphone=(), geolocation=()' },
  // Force HTTPS for 2 years (set only in production; Vercel handles HTTPS automatically)
  { key: 'Strict-Transport-Security',         value: 'max-age=63072000; includeSubDomains; preload' },
  // Full CSP policy
  { key: 'Content-Security-Policy',           value: CSP },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['yahoo-finance2'],

  async headers() {
    return [
      {
        // Apply security headers to every route
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
