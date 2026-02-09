"use client";

import { useEffect, useRef } from 'react';

export default function TradingViewWidget({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Placeholder content until full implementation
    container.current.innerHTML = `<div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #f1f3f6;">
      TradingView Chart for ${symbol} (Script loading...)
    </div>`;
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}
