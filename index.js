import express from 'express';
const app = express();
import { createServer } from 'http';
const server = createServer(app);
const websitePath = `${process.cwd()}/website`

app.get('/', (req, res) => {
  res.sendFile(websitePath+"/index.html");
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});