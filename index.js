import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const RiskCalculator = () => {
  const [formData, setFormData] = useState({
    accountSize: '',
    riskType: 'percentage',
    riskPercentage: '',
    riskUSD: '',
    instrument: 'XAUUSD',
    stopLoss: '',
    customPointValue: ''
  });
  const [result, setResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const instrumentSpecs = {
    // Precious Metals
    'XAUUSD': { defaultValue: 100, name: 'Gold' },
    // Indices
    'US30': { defaultValue: 1, name: 'Dow Jones' },
    'US100': { defaultValue: 1, name: 'NASDAQ' },
    'SPX500': { defaultValue: 1, name: 'S&P 500' },
    // Crypto
    'BTCUSD': { defaultValue: 1, name: 'Bitcoin' }
  };

  const TimeGreeting = () => {
    const [greeting, setGreeting] = useState('');
    
    useEffect(() => {
      const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good morning';
        if (hour >= 12 && hour < 17) return 'Good afternoon';
        return 'Good evening';
      };
      
      setGreeting(getGreeting());
      
      // Update greeting every minute
      const interval = setInterval(() => {
        setGreeting(getGreeting());
      }, 60000);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="text-lg text-center text-gray-600 dark:text-gray-300 mb-2" style={{
        animation: 'fadeIn 1s ease-in'
      }}>
        {greeting}, Trader
      </div>
    );
  };

  const calculatePosition = () => {
    const {
      accountSize,
      riskType,
      riskPercentage,
      riskUSD,
      stopLoss,
      instrument,
      customPointValue
    } = formData;

    if (!accountSize || !stopLoss) return;

    const riskAmount = riskType === 'percentage' 
      ? (accountSize * (riskPercentage / 100))
      : parseFloat(riskUSD);

    const pointValue = customPointValue || instrumentSpecs[instrument].defaultValue;
    const tickValue = stopLoss * pointValue;
    const positionSize = riskAmount / tickValue;

    setResult({
      riskAmount: riskAmount.toFixed(2),
      riskPercentage: ((riskAmount / accountSize) * 100).toFixed(2),
      stopLoss,
      pointValue,
      tickValue: tickValue.toFixed(2),
      positionSize: positionSize.toFixed(3)
    });
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      
      <h1 className="text-3xl font-bold text-center mt-8 mb-2">Trading Risk Calculator</h1>
      <TimeGreeting />
      
      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Position Size Calculator</span>
            <AlertCircle 
              className="text-blue-500 cursor-pointer hover:text-blue-600" 
              onClick={() => setShowInfo(true)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Account Size (USD)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.accountSize}
                  onChange={(e) => setFormData({...formData, accountSize: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Risk Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.riskType}
                  onChange={(e) => setFormData({...formData, riskType: e.target.value})}
                >
                  <option value="percentage">Percentage</option>
                  <option value="usd">Fixed USD</option>
                </select>
              </div>
            </div>

            {formData.riskType === 'percentage' ? (
              <div>
                <label className="block mb-2 text-sm font-medium">Risk Percentage (%)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.riskPercentage}
                  onChange={(e) => setFormData({...formData, riskPercentage: e.target.value})}
                />
                <p className="mt-1 text-sm text-blue-500">Recommended: 1-2% per trade</p>
              </div>
            ) : (
              <div>
                <label className="block mb-2 text-sm font-medium">Risk Amount (USD)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.riskUSD}
                  onChange={(e) => setFormData({...formData, riskUSD: e.target.value})}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Instrument</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.instrument}
                  onChange={(e) => setFormData({...formData, instrument: e.target.value})}
                >
                  {Object.entries(instrumentSpecs).map(([key, value]) => (
                    <option key={key} value={key}>{key} ({value.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Stop Loss (points)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData({...formData, stopLoss: e.target.value})}
                />
              </div>
            </div>

            <button
              className="text-sm text-blue-500 underline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
            </button>

            {showAdvanced && (
              <div>
                <label className="block mb-2 text-sm font-medium">Custom Point Value</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.customPointValue}
                  onChange={(e) => setFormData({...formData, customPointValue: e.target.value})}
                  placeholder={`Default: $${instrumentSpecs[formData.instrument].defaultValue}`}
                />
              </div>
            )}

            <button
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={calculatePosition}
            >
              Calculate Position Size
            </button>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">Position Analysis</h3>
                <div className="space-y-2">
                  <p>Risk Amount: ${result.riskAmount}</p>
                  <p>Risk Percentage: {result.riskPercentage}%</p>
                  <p>Stop Loss: {result.stopLoss} points</p>
                  <p>Point Value: ${result.pointValue}</p>
                  <p>Tick Value: ${result.tickValue}</p>
                  <p className="font-bold">Maximum Position Size: {result.positionSize} lots</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Trading Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Risk Management</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Never risk more than 1-2% of your account on a single trade</li>
              <li>Always set a stop loss before entering a trade</li>
              <li>Don't move your stop loss once a trade is placed</li>
              <li>Ensure your risk-reward ratio is at least 1:2</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Trading Psychology</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Stick to your trading plan and avoid emotional decisions</li>
              <li>Don't revenge trade after a loss</li>
              <li>Keep a trading journal to track and improve your performance</li>
              <li>Focus on consistent small wins rather than hitting home runs</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Market Analysis</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Always check major economic news before trading</li>
              <li>Look for confluence between multiple timeframes</li>
              <li>Don't force trades - wait for clear setups</li>
              <li>Monitor market volatility and adjust position sizes accordingly</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">Remember: Preservation of capital is more important than making profits. A good trader is a surviving trader.</p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showInfo} onOpenChange={setShowInfo}>
        <AlertDialogContent>
          <div className="absolute right-4 top-4">
            <button
              onClick={() => setShowInfo(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Trading Risk Calculator</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>A simple risk calculator for traders that helps you:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Calculate safe position sizes based on your account balance</li>
                <li>Manage risk by setting exact dollar or percentage risk per trade</li>
                <li>Support for major instruments: Gold, Bitcoin, US30, NASDAQ, and S&P500</li>
                <li>Get precise lot sizes based on your stop loss level</li>
              </ul>
              <p className="mt-4 font-semibold">⚠️ Important Notes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Please make sure to edit the contract size according to your broker's settings</li>
                <li>This site doesn't store data - settings need to be adjusted each time you visit</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <footer className="fixed bottom-0 left-0 w-full py-4 text-center bg-white dark:bg-gray-800 border-t shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700">
        by <a 
          href="https://aribrez1.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
        >
          aribrez1.com
        </a>
      </footer>
    </div>
  );
};

export default RiskCalculator;
