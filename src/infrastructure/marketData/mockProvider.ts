import type { Candle, MarketDataProvider } from "./MarketDataProvider";

// Mock provider for testing - generates realistic sample data
function generateMockCandles(ticker: string): Candle[] {
  const candles: Candle[] = [];
  const basePrice = ticker === "SAN" ? 4.5 : ticker === "BBVA" ? 9.2 : ticker === "IBE" ? 12.8 : 35.5;
  const today = new Date();
  
  // Generate 500 days of historical data
  for (let i = 500; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Random walk with slight upward bias
    const randomChange = (Math.random() - 0.48) * 0.05;
    const dayPrice = basePrice * (1 + randomChange * i / 100);
    const dailyVolatility = 0.02;
    
    const open = dayPrice * (1 + (Math.random() - 0.5) * dailyVolatility);
    const close = dayPrice * (1 + (Math.random() - 0.5) * dailyVolatility);
    const high = Math.max(open, close) * (1 + Math.random() * dailyVolatility);
    const low = Math.min(open, close) * (1 - Math.random() * dailyVolatility);
    
    candles.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 5000000
    });
  }
  
  return candles;
}

export const mockProvider: MarketDataProvider = {
  id: "stooq", // Using stooq id to be compatible with the existing selector
  
  async getDailyHistory({ ticker }): Promise<Candle[]> {
    console.log(`[MockProvider] Generating data for ${ticker}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return generateMockCandles(ticker);
  }
};