import { IncomingMessage as IncMsg, ServerResponse as ServResp } from 'http';
import { userModel } from '../models/usersModel';
import { ErrorMessages, headers } from '../utils/constants';
import { sendResponse } from '../utils/sendResponse';
import { IUser } from 'src/interfaces/userInterface';
import { showRequestStatus } from '../utils/showRequestStatus';
export class UsersController {
  usersModel = userModel;

  headers = headers;

  getAllUsers = async (req: IncMsg, res: ServResp) => {
    try {
      const users = await this.usersModel.getAllUsers();
      sendResponse(req, res, 200, this.headers, users);
    } catch (err) {
      sendResponse(req, res, 500, this.headers, {
        message: 'Error during getAllUsers'
      })
    }
  }

  addUser = async (req: IncMsg, res: ServResp, user: IUser) => {
    try {
      const newUser = (await this.usersModel.addUser(user)) as IUser;
      sendResponse(req, res, 201, this.headers, newUser);
    } catch (err) {
      sendResponse(req, res, 500, this.headers, {
        message: 'Error during addUser'
      })
    }
  }

  getUserById = async (req: IncMsg, res: ServResp, id: string) => {
    try {
      const user = (await this.usersModel.getUserById(id)) as IUser;
      if (user) {
        sendResponse(req, res, 200, this.headers, user);
      } else {
        sendResponse(req, res, 404, this.headers, {
          message: ErrorMessages.userNotFound
        })
      }
    } catch (err) {
      sendResponse(req, res, 500, this.headers, {
        message: 'Error during getUser'
      })
    }
  }

  updateUser = async (req: IncMsg, res: ServResp, user: IUser) => {
    try {
      const updatedUser = (await this.usersModel.updateUser(user)) as IUser;
      if (updatedUser) {
        sendResponse(req, res, 200, this.headers, updatedUser);
      } else {
        sendResponse(req, res, 404, this.headers, {
          message: ErrorMessages.userNotFound
        })
      }
    } catch (err) {
      sendResponse(req, res, 500, this.headers, {
        message: 'Error during updateUser'
      })
    }
  }

  deleteUser = async (req: IncMsg, res: ServResp, id: string) => {
    try {
      const statusCode = await this.usersModel.deleteUser(id);
      if (statusCode === 404) {
        sendResponse(req, res, 404, this.headers, {
          message: ErrorMessages.userNotFound,
        })
      }
      if (statusCode === 204) {
        res.writeHead(204);
        res.end();
        showRequestStatus(req, statusCode);
      }
    } catch (err) {
      sendResponse(req, res, 500, this.headers, {
        message: 'Error during deleteUser'
      })
    }
  }

}