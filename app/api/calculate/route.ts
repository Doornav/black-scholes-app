import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase/admin';
import { saveCalculation } from '@/lib/firebase/firestore';

// Black-Scholes Formula implementation
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * x);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * erf);
}

function calculateBlackScholes(
  S: number,  // Stock price
  K: number,  // Strike price
  r: number,  // Risk-free interest rate (in decimal form)
  T: number,  // Time to expiration (in years)
  sigma: number,  // Volatility (in decimal form)
): number {
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const callPrice = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  return callPrice;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stockPrice, strikePrice, interestRate, timeToExpiration, volatility } = body;

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    // Verify token using the Admin SDK
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    const userId = decodedToken.uid;

    // Convert string inputs to numbers and percentages to decimals where needed.
    const S = Number(stockPrice);
    const K = Number(strikePrice);
    const r = Number(interestRate) / 100;
    const T = Number(timeToExpiration);
    const sigma = Number(volatility) / 100;

    // Validate inputs
    if ([S, K, r, T, sigma].some(isNaN)) {
      return NextResponse.json(
        { error: 'Invalid input: All fields must be valid numbers' },
        { status: 400 }
      );
    }

    if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
      return NextResponse.json(
        { error: 'Invalid input: Values must be positive' },
        { status: 400 }
      );
    }

    const optionPrice = calculateBlackScholes(S, K, r, T, sigma);

    // Save calculation to Firestore using the verified user ID.
    // This now writes to users/{userId}/calculations.
    await saveCalculation({
      userId,
      date: new Date().toISOString(),
      optionPrice,
      inputs: {
        stockPrice: S,
        strikePrice: K,
        interestRate: r * 100,
        timeToExpiration: T,
        volatility: sigma * 100,
      },
    });

    return NextResponse.json({ optionPrice });
  } catch (error: any) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate option price' },
      { status: 500 }
    );
  }
} 