import { createServer } from 'http';
import { RequestHandler } from './utils/requestHandler';
import 'dotenv/config';
import * as os from 'os';


const port = parseInt(process.env.PORT!) || 5000;
const host = 'localhost';

const server = createServer((req, res) => {
  const requestHandler = new RequestHandler();
  requestHandler.handleReq(req, res);
});

server.listen(port, () => {
  process.stdout.write(
    `Server is running on http://${host}:${port}.${os.EOL}`,
  );
});
