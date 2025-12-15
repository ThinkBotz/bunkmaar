import { FormEvent, useEffect, useRef, useState } from "react";
import { sendEphemeralMessage, subscribeEphemeralMessages } from "@/lib/ephemeralSocket";

type Msg = { id: string; text: string; createdAt: number };

const TTL_MS = 30_000; // messages live for 30 seconds

export default function MessagesGlobal() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const timeouts = useRef<Map<string, number>>(new Map());
  const [, setTick] = useState(0);

  useEffect(() => {
    const iv = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      clearInterval(iv);
      // clear any pending timers on unmount
      timeouts.current.forEach((t) => clearTimeout(t));
      timeouts.current.clear();
    };
  }, []);

  // subscribe to messages from other clients over WebSocket
  useEffect(() => {
    const unsub = subscribeEphemeralMessages((m) => {
      setMessages((s) => {
        if (s.find((x) => x.id === m.id)) return s;
        // schedule auto-remove for incoming message
        const timer = window.setTimeout(() => removeMessage(m.id), TTL_MS);
        timeouts.current.set(m.id, timer);
        return [m, ...s];
      });
    });
    return unsub;
  }, []);

  function removeMessage(id: string) {
    setMessages((s) => s.filter((m) => m.id !== id));
    const t = timeouts.current.get(id);
    if (t) {
      clearTimeout(t);
      timeouts.current.delete(id);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const m: Msg = { id: String(Date.now()), text: text.trim(), createdAt: Date.now() };
    setMessages((s) => [m, ...s]);
    setText("");

    // schedule auto-remove
    const timer = window.setTimeout(() => removeMessage(m.id), TTL_MS);
    timeouts.current.set(m.id, timer);

    // broadcast to other connected clients
    try {
      sendEphemeralMessage(m);
    } catch {}
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Global Messages</h1>
      <p className="text-sm text-muted-foreground mb-4">Public announcements are ephemeral and will auto-delete after 30 seconds — no chats are stored.</p>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Post an ephemeral announcement (visible ~30s)..."
          className="flex-1 input bg-transparent"
        />
        <button className="btn" type="submit">Post</button>
      </form>

      <div className="space-y-3">
        {messages.length === 0 && <div className="text-sm text-muted-foreground">No messages right now.</div>}
        {messages.map((m) => {
          const remainingMs = Math.max(0, TTL_MS - (Date.now() - m.createdAt));
          const remainingSec = Math.ceil(remainingMs / 1000);
          const pct = Math.round((remainingMs / TTL_MS) * 100);
          return (
            <div key={m.id} className="p-3 border rounded-md">
              <div className="flex justify-between items-start">
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-muted-foreground ml-3">{remainingSec}s</div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <div>{new Date(m.createdAt).toLocaleTimeString()}</div>
                <button className="text-primary text-xs" onClick={() => removeMessage(m.id)}>Dismiss</button>
              </div>
              <div className="h-1 bg-muted-foreground/10 rounded-full mt-2">
                <div style={{ width: `${pct}%` }} className="h-1 bg-primary rounded-full transition-all duration-300" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


