import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { auth_salt } from '../app';

const prisma = new PrismaClient()



export default class User {
  static async getUsers(): Promise<{ count: number, data: User[] }> {




    const users = await prisma.user.findMany(
      { orderBy: { username: 'asc' } }
    );
    const resultObj = { count: users.length, data: users }
    return resultObj;
  }


  static async Register(username: string, email: string, password: string): Promise<{ message: string, user: User, success: boolean } | { message: string, success: boolean } | null> {

    const salt = bcrypt.genSaltSync(auth_salt);
    const hash = bcrypt.hashSync(password, salt);

    let user: User | null = null;
    try {
      user = await prisma.user.create(
        {
          data: {
            username: username,
            email: email,
            hash: hash
          }
        }
      );
    } catch (error) {

      return { message: (error as Error).message, success: false };
    }
    return { user: user, message: "User created", success: true };
  }


  static async EmailPasswordLogin(email: string, password: string): Promise<User | null> {

    const user = await prisma.user.findFirst(
      { where: { email: email } }
    );

    if (user === null) return null;
    const isMatch = bcrypt.compareSync(password, user.hash);
    if (!isMatch) return null;
    return user;
  }


}
