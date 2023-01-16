import supertest from 'supertest';
import { server}  from '../src/index';
import { IUser } from '../src/interfaces/userInterface';
import { ErrorMessages } from '../src/utils/constants';

const endpoint = '/api/users';

let user: IUser = {
  username: 'John',
  age: 31,
  hobbies: ['javascript', 'nodejs'],
};

const secondUser: IUser = {
  username: 'Lola',
  age: 27,
  hobbies: ['games', 'cinema'],
};


  describe('Scenario 1', () => {
    let id = '';
    let secondId = '';
    it('Should return empty array of users', async () => {
      const { body, statusCode } = await supertest(server).get(endpoint);
      expect(statusCode).toEqual(200);
      expect(body).toEqual([]);
    });
    it('Should create user', async () => {
      const { body, statusCode } = await supertest(server)
        .post(endpoint)
        .send(user);
      expect(statusCode).toEqual(201);
      expect(body.username).toEqual(user.username);
      expect(body.age).toEqual(user.age);
      expect(JSON.stringify(body.hobbies)).toEqual(
        JSON.stringify(user.hobbies),
      );
      id = body.id;
    });
    it('Should get user by id', async () => {
      const { body, statusCode } = await supertest(server).get(
        `${endpoint}/${id}`,
      );
      expect(statusCode).toEqual(200);
      expect(JSON.stringify(body)).toEqual(JSON.stringify({ id, ...user }));
    });
    it('Should update user by id', async () => {
      user = { ...user, hobbies: [...user.hobbies, 'testing'] };
      const { body, statusCode } = await supertest(server)
        .put(`${endpoint}/${id}`)
        .send(user);
      expect(statusCode).toEqual(200);
      expect(body.username).toEqual(user.username);
      expect(body.age).toEqual(user.age);
      expect(JSON.stringify(body.hobbies)).toEqual(
        JSON.stringify(user.hobbies),
      );
      expect(body.id).toEqual(id);
    });
    it('Should create second user', async () => {
      const response = await supertest(server).post(endpoint).send(secondUser);
      secondId = response.body.id;
      const { body, statusCode } = await supertest(server).get(endpoint);
      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(2);
      const [user1, user2] = body;
      delete user1.id;
      delete user2.id;
      expect(JSON.stringify(user1)).toEqual(JSON.stringify(user));
      expect(JSON.stringify(user2)).toEqual(JSON.stringify(secondUser));
    });
    it('Should delete first user', async () => {
      const { statusCode } = await supertest(server).delete(`${endpoint}/${id}`);
      expect(statusCode).toEqual(204);
      const { body } = await supertest(server).get(endpoint);
      expect(JSON.stringify(body)).toEqual(
        JSON.stringify([{ id: secondId, ...secondUser }]),
      );
    });
  });

  describe('Scenario 2', () => {
    let id = '';
    it(`Should return message "${ErrorMessages.invalidEndpoint}"`, async () => {
      const { body, statusCode } = await supertest(server).get('/invalid_url');
      expect(statusCode).toEqual(404);
      expect(body.message).toEqual(ErrorMessages.invalidEndpoint);
    });
    it('Should return message about invalid body', async () => {
      const { body, statusCode } = await supertest(server)
        .post(endpoint)
        .send({ ...user, hobbies: null });
      expect(statusCode).toEqual(400);
      expect(body.message).toEqual(ErrorMessages.invalidBody);
    });
    it(`Should return message "${ErrorMessages.invalidUuid}"`, async () => {
      const { body, statusCode } = await supertest(server).get(
        `${endpoint}/invalid_uuid`,
      );
      expect(statusCode).toEqual(400);
      expect(body.message).toEqual(ErrorMessages.invalidUuid);
    });
    it(`Should return message "${ErrorMessages.userNotFound}"`, async () => {
      const res = await supertest(server).post(endpoint).send(user);
      id = res.body.id;
      await supertest(server).delete(`${endpoint}/${id}`);
      const { body, statusCode } = await supertest(server).get(
        `${endpoint}/${id}`,
      );
      expect(statusCode).toEqual(404);
      expect(body.message).toEqual(ErrorMessages.userNotFound);
    });
  });
  
  describe('Scenario 3', () => {
    let id = '';
    // At now one user in users array;
    it('Should return 3 users', async () => {
      const promises : any[] = [];
      for (let i = 0; i < 2; i += 1) {
        promises.push(
          supertest(server)
            .post(endpoint)
            .send({ ...user, age: user.age + i }),
        );
      }
      await Promise.all(promises);
      const { body } = await supertest(server).get(endpoint);
      expect(body.length).toEqual(3);
      id = body[1].id;
    });
    it('Should get updated user with selected id', async () => {
      const response = await supertest(server).get(`${endpoint}/${id}`);
      const updatedUser = { ...response.body, hobbies: [] };
      delete updatedUser.id;
      const { body, statusCode } = await supertest(server)
        .put(`${endpoint}/${id}`)
        .send(updatedUser);
      expect(statusCode).toEqual(200);
      expect(JSON.stringify(body)).toEqual(
        JSON.stringify({ id, ...updatedUser }),
      );
    });
    it('Should return "User is not found"', async () => {
      await supertest(server).delete(`${endpoint}/${id}`);
      const { body, statusCode } = await supertest(server).get(
        `${endpoint}/${id}`,
      );
      expect(statusCode).toEqual(404);
      expect(body.message).toEqual(ErrorMessages.userNotFound);
    });
  });
  afterAll(() => {
    server.close();
  });