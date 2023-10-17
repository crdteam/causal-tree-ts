import { CausalTree } from '../../dist/index.js';
import http from 'http';

const PORT = 9000;

const getState = () => causalTree.marshall();

const mergeState = (state) => {
  causalTree.mergeString(state);
  return causalTree.marshall();
}

const requestListener = (req, res) => {
  // Set up CORS headers to allow all origins. You might want to restrict this in production.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // If it's a preflight OPTIONS request, respond with OK
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; // No Content
    res.end();
    return;
  }

  if (req.url === '/content') {
    if (req.method === 'GET') {
      const value = causalTree.toString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ content: value }));
      return;
    }
  }


  if (req.url === '/fork') {
    if (req.method === 'POST') {
      const fork = causalTree.forkString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ content: fork }));
      return;
    }
  }


  if (req.url === '/sync') {
    if (req.method === 'GET') {
      const state = getState();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ content: state }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { content: state } = JSON.parse(body);
        const newState = mergeState(state);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: newState }));
      });
      return;
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
}

const server = http.createServer(requestListener);
const causalTree = new CausalTree();

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
