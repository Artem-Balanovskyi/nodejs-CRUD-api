import { IncomingMessage, ServerResponse } from 'http';
import { userModel } from '../models/usersModel';
import { headers } from '../utils/constants';
import { sendResponse } from '../utils/sendResponse';
import { IUser } from 'src/interfaces/userInterface';

export class UsersController {
  usersModel = userModel;

  headers = headers;

  getUsers = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const users = await this.usersModel.getAllUsers();
      sendResponse(req, res, 200, this.headers, users);
    } catch (err) {
      sendResponse(req, res, 500, this.headers, {
        message: 'Error during getAllUsers',
      });
    }
  }

  addUser = async (
    req: IncomingMessage,
    res: ServerResponse,
    user: IUser,
  ) => {
    try {
      const newUser = (await this.usersModel.addUser(user)) as IUser;
      sendResponse(req, res, 201, this.headers, newUser);
    } catch (err) {
      sendResponse(req, res, 500, this.headers, {
        message: 'Error during addUser',
      });
    }
  }

}