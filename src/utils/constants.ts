export enum ErrorMessages {
  userNotFound = 'User is not found',
  invalidEndpoint = 'Invalid endpoint',
  invalidUuid = 'Invalid uuid',
  invalidBody = 'Invalid body. Body should consist of: username - string, age - number, hobbies - string array',
}
export const endpoint = '/api/users';

export const headers = { 'Content-Type': 'application/json' };

