import { IncomingMessage, ServerResponse } from 'http';
import { ErrorMessages, endpoint, headers } from '../utils/constants';
import { UsersController } from '../controllers/usersController';
import { sendResponse } from '../utils/sendResponse';

export class RequestHandler {
  endpoint = endpoint;
  headers = headers;
  usersController = new UsersController();

  handleReq(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;

    if (!url?.startsWith(this.endpoint)) {
      sendResponse(req, res, 404, this.headers, {
        message: ErrorMessages.invalidEndpoint,
      });
      return;
    }

    if (method === 'GET') {
      if (url === this.endpoint) {
        this.usersController.getUsers(req, res).then(() => {});
      }
    }
    
  }
}