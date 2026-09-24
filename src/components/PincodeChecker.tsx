'use client';

import { useState, useEffect, useCallback } from 'react';
import { Truck, Check, AlertCircle } from 'lucide-react';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{
    status: 'idle' | 'success' | 'invalid';
    message?: string;
    estimate?: string;
  }>({ status: 'idle' });

  const validateAndSet = useCallback((code: string) => {
    const trimmed = code.trim();
    if (!/^[1-9][0-9]{5}$/.test(trimmed)) {
      setResult({
        status: 'invalid',
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    // Metro regions: 11 (Delhi/NCR), 40 (Mumbai), 56 (Bangalore), 70 (Kolkata), 60 (Chennai), 50 (Hyderabad)
    const isMetro = /^(11|40|56|70|60|50)/.test(trimmed);
    const estimate = isMetro
      ? '3–5 Business Days (Express Metro Transit)'
      : '5–7 Business Days (Standard Insured Courier)';

    setResult({
      status: 'success',
      message: `Delivery available to ${trimmed}`,
      estimate,
    });

    try {
      sessionStorage.setItem('zorodoor-delivery-pincode', trimmed);
    } catch {
      // ignore
    }
  }, []);

  // Read saved pincode from sessionStorage if customer already checked it earlier
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('zorodoor-delivery-pincode');
      if (saved && /^[1-9][0-9]{5}$/.test(saved)) {
        setPincode(saved);
        validateAndSet(saved);
      }
    } catch {
      // ignore storage access restrictions
    }
  }, [validateAndSet]);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSet(pincode);
  };

  return (
    <div className="border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <Truck size={15} className="text-black" />
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-black">
          Check Delivery Availability
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2 mb-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setPincode(val);
            if (result.status !== 'idle') setResult({ status: 'idle' });
          }}
          placeholder="Enter 6-digit PIN code"
          className="flex-1 bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-sans text-black placeholder-neutral-400 outline-none focus:border-black"
          aria-label="Enter PIN code"
        />
        <button
          type="submit"
          disabled={pincode.length < 6}
          className="bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
        >
          Check
        </button>
      </form>

      {result.status === 'success' && (
        <div className="bg-neutral-50 border border-neutral-200 p-2.5 space-y-1 animate-in fade-in duration-200">
          <p className="text-xs font-sans font-bold text-black flex items-center gap-1.5">
            <Check size={14} className="text-black" />
            <span>{result.message}</span>
          </p>
          <p className="text-[11px] font-sans text-neutral-600 pl-5">
            Estimated dispatch &amp; arrival: <strong className="text-black">{result.estimate}</strong>
          </p>
          <p className="text-[10px] font-sans text-neutral-500 pl-5">
            Reinforced wooden crate packaging with full transit insurance included.
          </p>
        </div>
      )}

      {result.status === 'invalid' && (
        <div className="text-xs font-sans text-neutral-800 flex items-center gap-1.5 mt-1">
          <AlertCircle size={13} className="text-neutral-600" />
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
