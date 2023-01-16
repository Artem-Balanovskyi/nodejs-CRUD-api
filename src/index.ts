import { createServer, IncomingMessage as IncMsg, ServerResponse as ServResp } from 'http';
import { RequestHandler } from './utils/requestHandler';
import 'dotenv/config';
import { EOL } from 'os';


export const port = parseInt(process.env.PORT!) || 5000;
const host = 'localhost';

export const server = createServer((req: IncMsg, res: ServResp) => {
  const requestHandler = new RequestHandler();
  requestHandler.handleReq(req, res);
})

if (!process.argv.slice(2) || process.argv.slice(2)[0] !== '--multi') {
  server.listen(port, () => {
    process.stdout.write(
      `Server is running on http://${host}:${port}${EOL}`
    )
  })
} 
