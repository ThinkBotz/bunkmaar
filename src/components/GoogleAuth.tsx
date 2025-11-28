import { useEffect, useRef, useState } from 'react';

type GooglePayload = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  [k: string]: any;
};

export default function GoogleAuth({ onSuccess, onError }: { onSuccess?: (p: GooglePayload) => void; onError?: (e: any) => void; }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasClientId, setHasClientId] = useState(!!(import.meta as any).env?.VITE_GOOGLE_CLIENT_ID);

  useEffect(() => {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    setHasClientId(!!clientId);
    const win = window as any;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID not set; Google Sign-In will not initialize.');
      return;
    }

    function handleResponse(response: any) {
      try {
        const credential: string = response?.credential;
        if (!credential) throw new Error('No credential returned');
        // JWT payload is the middle part
        const payload = JSON.parse(atob(credential.split('.')[1]));
        // store the credential for later requests if needed
        try { localStorage.setItem('google_credential', credential); } catch {}
        onSuccess?.(payload);
      } catch (err) {
        console.error('GoogleAuth callback error', err);
        onError?.(err);
      }
    }

    if (win.google?.accounts?.id) {
      win.google.accounts.id.initialize({ client_id: clientId, callback: handleResponse });
      if (ref.current) {
        win.google.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large' });
      }
      // optional: auto prompt
      // win.google.accounts.id.prompt();
    } else {
      const onLoad = () => {
        if (win.google?.accounts?.id) {
          win.google.accounts.id.initialize({ client_id: clientId, callback: handleResponse });
          if (ref.current) win.google.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large' });
        }
      };
      window.addEventListener('google-loaded', onLoad);
      // in case script already loaded
      onLoad();
      return () => window.removeEventListener('google-loaded', onLoad);
    }
  }, [onError, onSuccess]);

  if (!hasClientId) {
    return (
      <div className="text-sm text-muted-foreground">
        Google Sign-In is not configured. Set `VITE_GOOGLE_CLIENT_ID` in your environment and restart the dev server.
      </div>
    );
  }

  return <div ref={ref} />;
}
