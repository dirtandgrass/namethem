import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { auth_salt } from '../app';

const prisma = new PrismaClient()


export type UserData = {
  user_id?: number;
  username?: string;
  email?: string;
  message: string;
  success: boolean;
}


export default class User {

  static randomHash(): string {
    const salt = bcrypt.genSaltSync(auth_salt);
    return bcrypt.hashSync(Math.random().toString(), salt);
  }

  static async getUsers(): Promise<{ count: number, data: User[] }> {

    const users = await prisma.user.findMany(
      { orderBy: { username: 'asc' } }
    );
    const resultObj = { count: users.length, data: users }
    return resultObj;
  }


  static async Register(username: string, email: string, password: string): Promise<{ message: string, user: User, success: boolean } | { message: string, success: boolean } | null> {

    //console.log("Register", username, email, password);
    const salt = bcrypt.genSaltSync(auth_salt);
    const hash = bcrypt.hashSync(password, salt);
    const validation_code = this.randomHash();

    let user: User | null = null;
    try {
      user = await prisma.user.create(
        {
          data: {
            username: username,
            email: email,
            hash: hash,
            validation_code: validation_code
          }
        }
      );
    } catch (error) {

      return { message: (error as Error).message, success: false };
    }


    return { user: user, message: "User created", success: true };
  }


  static async ValidateUser(user_id: number, code: string): Promise<{ message: string, user?: User, success: boolean }> {

    let user: User | null = null;

    try {
      user = await prisma.user.update(
        { where: { user_id: user_id, validation_code: code, validated: false }, data: { validated: true, validation_code: null } }
      );
    } catch (error) {
      return { message: "User not validated", success: false };
    }

    return { user: user, message: "User validated", success: true };

  }

  static async EmailPasswordLogin(email: string, password: string): Promise<{ user_id?: number, username?: string, email?: string, message: string, success: boolean }> {

    const user = await prisma.user.findFirst(
      { where: { email: email } }
    );

    if (user === null) return { message: "User not logged in", success: false };
    const isMatch = bcrypt.compareSync(password, user.hash);
    if (!isMatch) return { message: "User not logged in", success: false }

    return { user_id: user.user_id, username: user.username, email: user.email, message: "User logged in", success: true };
  }

  static async SessionLogin(user_id: number, session_id: number, user_hash: string, extend: boolean = false): Promise<{ user_id?: number, username?: string, email?: string, message: string, success: boolean }> {

    const session = await prisma.session.findFirst(
      { where: { session_id: session_id, user_id: user_id, expires: { gt: new Date() } } }
    );

    if (session === null) return { message: "User not logged in", success: false };
    const isMatch = bcrypt.compareSync(user_hash, session.hash);

    if (!isMatch) return { message: "User not logged in", success: false }

    if (extend) {
      await prisma.session.update({ where: { session_id: session_id }, data: { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) } })
    }

    return { user_id: user_id, message: "User logged in", success: true };
  }

  static async CreateSession(user_id: number): Promise<{ message: string; success: boolean; session?: string, session_id?: number }> {

    const user_hash = this.randomHash();
    const hash = bcrypt.hashSync(user_hash, auth_salt);

    const session = await prisma.session.create(
      { data: { user_id: user_id, hash } }
    );

    if (session == null) return { message: "Session not started", success: false };

    return { message: "Session started", success: true, session: user_hash, session_id: session.session_id };
  }

}
