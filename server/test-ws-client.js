import WebSocket from 'ws';

const [, , name, messageToSend] = process.argv;
const url = process.env.WS_URL || 'ws://localhost:8081';

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log(`${name} connected to ${url}`);
  if (messageToSend) {
    const msg = { id: String(Date.now()), text: messageToSend, createdAt: Date.now() };
    console.log(`${name} sending:`, msg);
    ws.send(JSON.stringify(msg));
  }
});

ws.on('message', (data) => {
  try {
    const parsed = JSON.parse(data.toString());
    console.log(`${name} received:`, parsed);
  } catch (e) {
    console.log(`${name} got:`, data.toString());
  }
});

ws.on('close', () => console.log(`${name} closed`));
ws.on('error', (e) => console.error(`${name} error:`, e.message));

// keep process alive
setTimeout(() => {}, 1e6);
