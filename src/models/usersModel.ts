import { IUser } from '../interfaces/userInterface';

class UsersModel {
  users: Array<IUser> = [];

  getAllUsers(): Promise<IUser[]> {
    return new Promise((resolve) => {
      resolve(this.users);
    });
  }
}

export const userModel = new UsersModel();
