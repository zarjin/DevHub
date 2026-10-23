import type { Request } from "express";
export interface IPayload {
  id: string;
  email: string;
  role: string;
}
export interface IAuthReq extends Request {
  user: IPayload;
}
