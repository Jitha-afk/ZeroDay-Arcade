"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Activity } from 'lucide-react';

interface MoneyIndicatorProps {
  /** Total simulation duration in seconds to match timer (used to map depletion curve). */
  totalDuration: number;
  /** Starting budget value. */
  startingAmount?: number;
  /** Optional custom per-second linear burn override. If not provided we compute based on totalDuration. */
  perSecondBurn?: number;
  /** Non-linear acceleration factor ( >1 accelerates depletion toward end ). */
  acceleration?: number;
}

// Storage keys
const STORAGE_KEY_START = 'cyberwarsim_money_start_ts';
const STORAGE_KEY_AMOUNT = 'cyberwarsim_money_start_amount';

export default function MoneyIndicator({ totalDuration, startingAmount = 10000, perSecondBurn, acceleration = 1.15 }: MoneyIndicatorProps) {
  const [amount, setAmount] = useState(startingAmount);
  const [startTs, setStartTs] = useState<number | null>(null);

  useEffect(() => {
    // Initialize persistent starting state
    try {
      const storedStart = sessionStorage.getItem(STORAGE_KEY_START);
      const storedAmount = sessionStorage.getItem(STORAGE_KEY_AMOUNT);
      if (storedStart && storedAmount) {
        setStartTs(parseInt(storedStart, 10));
      } else {
        const now = Date.now();
        sessionStorage.setItem(STORAGE_KEY_START, now.toString());
        sessionStorage.setItem(STORAGE_KEY_AMOUNT, startingAmount.toString());
        setStartTs(now);
      }
    } catch (e) {
      // fallback: ephemeral timer
      if (!startTs) setStartTs(Date.now());
    }
  }, [startingAmount]);

  useEffect(() => {
    if (!startTs) return;
    const interval = setInterval(() => {
      const elapsedSec = (Date.now() - startTs) / 1000;
      // progress 0..1
      const progress = Math.min(1, elapsedSec / totalDuration);
      // Apply acceleration curve (ease-in) amountRemaining = (1 - p^a)
      const effectiveProgress = Math.pow(progress, acceleration);
      const linearBurnRate = perSecondBurn ?? (startingAmount / totalDuration);
      // base linear burnt
      const linearBurnt = elapsedSec * linearBurnRate;
      // accelerated extra portion to make it feel faster later
      const acceleratedBurnt = startingAmount * effectiveProgress; // ensures full depletion at end
      // Blend: weight accelerated 70%, linear 30%
      const blended = 0.7 * acceleratedBurnt + 0.3 * linearBurnt;
      const remaining = Math.max(0, Math.round(startingAmount - blended));
      setAmount(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTs, totalDuration, startingAmount, perSecondBurn, acceleration]);

  const pct = amount / startingAmount;
  const color = pct > 0.6 ? 'text-emerald-400' : pct > 0.3 ? 'text-amber-400' : 'text-rose-500';
  const barWidth = `${Math.max(2, pct * 100)}%`;

  const formatMoney = (v: number) =>
    v.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <Card data-testid="card-money-indicator">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-mono flex items-center gap-2"><Activity className="w-4 h-4" /> FINANCIAL_IMPACT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-2xl font-mono font-semibold ${color}`}>{formatMoney(amount)}</div>
        <div className="h-2 w-full bg-muted/30 rounded overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-700" style={{ width: barWidth }} />
        </div>
        <p className="text-xs text-muted-foreground font-mono leading-snug">
          // Live cost of ongoing incident. Accelerates as time progresses.
        </p>
      </CardContent>
    </Card>
  );
}
