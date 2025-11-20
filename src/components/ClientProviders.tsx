'use client';  // Marks as client component

import { ReactNode } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Providers } from '@/Store/Provider';  // Your Redux/context provider

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',  // Use NEXT_PUBLIC_ for client env vars
    // currency: 'EUR', etc.
  };

  return (
    <Providers>
      <PayPalScriptProvider options={paypalOptions}>
        {children}
      </PayPalScriptProvider>
    </Providers>
  );
}