'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { handleGoogleCallback } from '@/app/actions/google-integration';
import { Loader2 } from 'lucide-react';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the clientId

    if (code && state) {
      handleGoogleCallback(code, state)
        .then((result) => {
          if (result.success) {
            setStatus('Success! Redirecting...');
            router.push(`/dashboard/clients/${state}/settings`);
          } else {
            setStatus('Error: ' + result.error);
          }
        })
        .catch((err) => {
          setStatus('An unexpected error occurred.');
          console.error(err);
        });
    } else {
      setStatus('Invalid callback parameters.');
    }
  }, [searchParams, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-lg font-medium">{status}</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
