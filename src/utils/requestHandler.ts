import { IncomingMessage as IncMsg, ServerResponse as ServResp } from 'http';
import { ErrorMessages, endpoint, headers } from '../utils/constants';
import { UsersController } from '../controllers/usersController';
import { sendResponse } from '../utils/sendResponse';
import { isValidUser, isValidUserId } from './validationChecks';

export class RequestHandler {
  endpoint = endpoint;
  headers = headers;
  usersController = new UsersController();
  
  handleReq(req: IncMsg, res: ServResp) {
    const { method, url } = req;
    let data = '';

    const sendInvalidEndpointResponse = () => {
      sendResponse(req, res, 404, this.headers, {
        message: ErrorMessages.invalidEndpoint,
      })
    }

    const addDataToDB = () => {
      req.on('data', (chunk) => (data += chunk));
      req.on('error', (err) => {
        sendResponse(req, res, 500, this.headers, {
          message: `Error. ${err.message}`
        })
      })
    }

    if (!url?.startsWith(this.endpoint)) {
      sendInvalidEndpointResponse();
      return;
    }

    if (method === 'GET') {
      if (url === this.endpoint) {
        this.usersController.getAllUsers(req, res)
          .then(() => { });
      } else {
        const id = url?.split('/').pop();
        if (!id || !isValidUserId(id)) {
          sendResponse(req, res, 400, this.headers, {
            message: ErrorMessages.invalidUuid,
          });
        } else this.usersController.getUserById(req, res, id).then(() => {});
      }
    }

    if (method === 'POST') {
      if (url !== this.endpoint) {
        sendInvalidEndpointResponse();
      }

      addDataToDB();

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

    if (method === 'PUT') {
      const id = url?.split('/').pop();
      if (!id || !isValidUserId(id)) {
        return sendResponse(req, res, 400, this.headers, { 
          message: ErrorMessages.invalidUuid 
        })
      }

      addDataToDB();

      req.on('end', () => {
        const user = JSON.parse(data);
        if (!isValidUser(user)) {
          sendResponse(req, res, 400, this.headers, {
            message: ErrorMessages.invalidBody
          })
        } else {
          this.usersController
            .updateUser(req, res, { id, ...user })
            .then(() => {});
        }
      })
    }

    if (method === 'DELETE') {
      const id = url?.split('/').pop();
      if (!id || !isValidUserId(id)) {
        sendResponse(req, res, 400, this.headers, { 
          message: ErrorMessages.invalidUuid 
        })
      } else {
        this.usersController.deleteUser(req, res, id).then(() => {});
      }
    }

  }
}