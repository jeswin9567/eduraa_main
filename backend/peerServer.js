const { PeerServer } = require('peer');

const peerServer = PeerServer({
  port: 3001,
  path: '/',
  allow_discovery: true
});

peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
}); 