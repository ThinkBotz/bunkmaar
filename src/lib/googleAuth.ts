export function getGoogleCredential() {
  try {
    return localStorage.getItem('google_credential');
  } catch {
    return null;
  }
}

export function clearGoogleCredential() {
  try {
    localStorage.removeItem('google_credential');
  } catch {}
}

export function decodeGooglePayload(credential?: string) {
  if (!credential) return null;
  try {
    const parts = credential.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}
