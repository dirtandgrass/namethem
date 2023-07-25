import { Request, Response, NextFunction } from 'express';
import User from '../model/user';


export let AuthUser: object | null = null;

export default async function (req: Request, res: Response, next: NextFunction) {

  // if (req.body.login_email && req.body.login_password) {
  //   req.headers["x-namethem-email"] = req.body.login_email;
  //   req.headers["x-namethem-password"] = req.body.login_password;
  // }

  if (req.headers["x-namethem-uid"] && req.headers["x-namethem-sid"] && req.headers["x-namethem-session"]) {
    const result = await User.SessionLogin(parseInt(req.headers["x-namethem-uid"].toString()), parseInt(req.headers["x-namethem-sid"].toString()), req.headers["x-namethem-session"].toString(), true);
    if (result?.user_id) {
      AuthUser = result;
    } else {
      AuthUser = null;
    }
  } else if (req.headers["x-namethem-email"] && req.headers["x-namethem-password"]) {
    const result = await User.EmailPasswordLogin(req.headers["x-namethem-email"].toString(), req.headers["x-namethem-password"].toString());
    //console.log(result);
    if (result?.user_id) {
      AuthUser = result;
    } else {
      AuthUser = null;
    }
  } else {
    AuthUser = null;
  }
  next();
}