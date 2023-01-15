import { IncomingMessage, ServerResponse } from 'http';
import { IUser } from 'src/interfaces/userInterface';
import { IErrorMsg } from 'src/interfaces/errorMsgInterface';
import { showRequestStatus } from './showRequestStatus'; 

export const sendResponse = (
  req: IncomingMessage,
  res: ServerResponse,
  statusCode: number,
  headers: Record<string, string>,
  result: IUser | IUser[] | IErrorMsg
) => {
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(result));
  showRequestStatus(req, statusCode);
};