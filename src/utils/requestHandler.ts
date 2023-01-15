import { IncomingMessage, ServerResponse } from 'http';
import { ErrorMessages, endpoint, headers } from '../utils/constants';
import { UsersController } from '../controllers/usersController';
import { sendResponse } from '../utils/sendResponse';
import { isValidUser } from './validationChecks';

export class RequestHandler {
  endpoint = endpoint;
  headers = headers;
  usersController = new UsersController();
  
  handleReq(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;

    const sendInvalidEndpointResponse = () => {
      sendResponse(req, res, 404, this.headers, {
        message: ErrorMessages.invalidEndpoint,
      })
    }

    if (!url?.startsWith(this.endpoint)) {
      sendInvalidEndpointResponse();
      return;
    }

    if (method === 'GET') {
      if (url === this.endpoint) {
        this.usersController.getUsers(req, res)
          .then(() => { });
      } else {
        sendInvalidEndpointResponse();
      }
    }

    if (method === 'POST') {
      if (url !== this.endpoint) {
        sendInvalidEndpointResponse();
      }
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('error', (err) => {
        sendResponse(req, res, 500, this.headers, {
          message: `Error. ${err.message}`
        })
      })
      req.on('end', () => {
        const user = JSON.parse(data);
        if (!isValidUser(user)) {
          sendResponse(req, res, 400, this.headers, {
            message: ErrorMessages.invalidBody
          })
        } else {
          this.usersController.addUser(req, res, user)
            .then(() => { });
        }
      })
    }

  }
}