import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 8081;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('BunkMaar WS server\n');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    let parsed;
    try {
      parsed = JSON.parse(data.toString());
    } catch (e) {
      return;
    }

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsed));
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});

server.listen(PORT, () => {
  console.log(`BunkMaar WS server listening on ws://localhost:${PORT}`);
});
