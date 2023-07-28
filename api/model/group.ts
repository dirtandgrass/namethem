import { PrismaClient } from '@prisma/client'
import { AuthUser } from '../middleware/headerauth';
import { randomHash } from '../utility/randomHash';
const prisma = new PrismaClient()


export default class Group {



  static async createGroup(name: string, description: string): Promise<{ message: string, success: boolean, group_id?: number }> {

    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false };


    let group_id = 0;

    try {
      const result = await prisma.group.create({ data: { name: name, description: description, owner_user_id: user_id } });
      group_id = result.group_id;
    } catch (e) {
      console.log(e);
      return { "message": "unable to create group", "success": false };
    }

    return { "message": "success", "success": true, "group_id": group_id };


  }

  static async inviteUser(group_id: number, guest_user_id: number): Promise<{ message: string, success: boolean }> {
    const user_id = AuthUser?.user_id || 0;
    if (user_id === 0) return { "message": "not logged in", "success": false };
    if (!Number.isInteger(group_id) || !Number.isInteger(guest_user_id)) {
      return { "message": "invalid data", "success": false };
    }


    try {
      const lookup = await prisma.group.findFirst({ where: { group_id: group_id, owner_user_id: user_id } });
      console.log(lookup);
    } catch (e) {
      console.log(e);
      return { "message": "unable to invite user, you must be the owner/creator of the group to invite", "success": false };
    }
    const invite_key = randomHash();



    try {
      await prisma.group_user.create({ data: { group_id, user_id: guest_user_id, invite_key } });
    } catch (e) {
      console.log(e);
      return { "message": "unable to invite user", "success": false };
    }

    return { "message": "success", "success": true };
  }

}