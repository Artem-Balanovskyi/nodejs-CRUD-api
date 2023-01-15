import { IncomingMessage, ServerResponse } from 'http';
import { userModel } from '../models/usersModel';
import { headers } from '../utils/constants';
import { sendResponse } from '../utils/sendResponse'

export class UsersController {
  usersModel = userModel;

  headers = headers;

  getUsers = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const users = await this.usersModel.getAllUsers();
      sendResponse(req, res, 200, this.headers, users);
    } catch (err) {
      sendResponse(req, res, 500, this.headers, {
        message: 'Error has been occurs during get users',
      });
    }
  };
}