import { CausalTree } from '../../dist/index.js';
import http from 'http';

const PORT = 9000;

const getState = () => causalTree.marshall();

const mergeState = (state) => {
  causalTree.mergeString(state);
  return causalTree.marshall();
}

const requestListener = (req, res) => {
  if (req.url === '/fork') {
    if (req.method === 'GET') {
      const fork = causalTree.forkString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ content: fork }));
      return;
    }

    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
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
        res.writeHead(200);
        res.end(JSON.stringify({ content: newState }));
      });
      return;
    }

    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
}

const server = http.createServer(requestListener);
const causalTree = new CausalTree();

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
