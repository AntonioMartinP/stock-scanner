"use client";

import { useEffect, useRef } from 'react';
import {useLocale} from "next-intl";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewWidget({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const locale = useLocale();

  useEffect(() => {
    if (!container.current) return;

    const loadScript = () => {
      if (scriptLoaded.current) {
        initWidget();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        initWidget();
      };
      document.head.appendChild(script);
    };

    const initWidget = () => {
      if (!container.current || typeof window.TradingView === 'undefined') return;

      container.current.innerHTML = '';

      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: 'D',
        timezone: 'Europe/Madrid',
        theme: 'light',
        style: '0',
        locale,
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: false,
        container_id: container.current.id,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
      });
    };

    if (!container.current.id) {
      container.current.id = `tradingview_${Math.random().toString(36).substr(2, 9)}`;
    }

    loadScript();
  }, [symbol, locale]);

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: "100%", width: "100%" }}
    />
  );
}
