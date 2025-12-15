const DEFAULT_WS = (() => {
  if (typeof window === 'undefined') return 'ws://localhost:8081';
  if ((window as any).WS_URL) return (window as any).WS_URL;
  try {
    const loc = window.location;
    const scheme = loc.protocol === 'https:' ? 'wss' : 'ws';
    // use the page host but default to port 8081 for the WS relay
    const host = loc.hostname;
    return `${scheme}://${host}:8081`;
  } catch {
    return 'ws://localhost:8081';
  }
})();

type Incoming = { id: string; text: string; createdAt: number };

class EphemeralSocket {
  private url: string;
  private ws: WebSocket | null = null;
  private listeners = new Set<(m: Incoming) => void>();
  private reconnectTimer = 0;

  constructor(url?: string) {
    this.url = url || DEFAULT_WS;
    this.connect();
  }

  connect() {
    if (this.ws) return;
    try {
      this.ws = new WebSocket(this.url);
    } catch (e) {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.info('[ephemeralSocket] connected', this.url);
      this.clearReconnect();
    };

    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        this.listeners.forEach((l) => l(data));
      } catch {}
    };

    this.ws.onclose = () => {
      console.warn('[ephemeralSocket] disconnected');
      this.ws = null;
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      console.error('[ephemeralSocket] error');
      // swallow — onclose will handle reconnect
    };
  }

  send(msg: Incoming) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
      return;
    }
    try {
      this.ws.send(JSON.stringify(msg));
    } catch {}
  }

  subscribe(fn: (m: Incoming) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = 0;
      this.connect();
    }, 2000) as unknown as number;
  }

  private clearReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = 0;
    }
  }
}

const sock = new EphemeralSocket();

export function sendEphemeralMessage(m: Incoming) {
  sock.send(m);
}

export function subscribeEphemeralMessages(fn: (m: Incoming) => void) {
  return sock.subscribe(fn);
}
