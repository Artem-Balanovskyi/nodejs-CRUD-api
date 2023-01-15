import { IUser } from '../interfaces/userInterface';
import { v4 as uuid } from 'uuid';

class UsersModel {
  users: Array<IUser> = [];

  getAllUsers(): Promise<IUser[]> {
    return new Promise((resolve) => {
      resolve(this.users);
    })
  }

  addUser(newUser: IUser): Promise<IUser> {
    return new Promise((resolve) => {
      const id = uuid();
      const user = { id, ...newUser };
      this.users.push(user);
      resolve(user);
    })
  }

  getUserById(id: string): Promise<IUser | undefined> {
    return new Promise((resolve) => {
      const foundUser = this.users.find((user) => user.id === id);
      resolve(foundUser);
    })
  }

  updateUser(user: IUser): Promise<IUser | null> {
    return new Promise((resolve) => {
      const userToUpdate = this.users.find(
        (userFromDB) => userFromDB.id === user.id
      )
      if (!userToUpdate) resolve(null);
      else {
        const userIdx = this.users.findIndex(
          (userFromDB) => userFromDB.id === user.id
        )
        this.users[userIdx] = user;
        resolve(user);
      }
    })
  }

}

export const userModel = new UsersModel();
