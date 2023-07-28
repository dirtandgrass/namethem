import { PrismaClient } from '@prisma/client'
import { AuthUser } from '../middleware/headerauth'

const prisma = new PrismaClient()



export default class Rating {
  static async rateName(name_id: number, rating: number, group_id: number = 1): Promise<{ message: string, success: boolean }> {

    const user_id = AuthUser?.user_id || 0;

    if (user_id === 0) return { "message": "not logged in", "success": false };

    if (!Number.isInteger(name_id) || rating > 1 || rating < 0 || (!Number.isInteger(group_id) && group_id)) {
      return { "message": "invalid data", "success": false };
    }

    try {
      const result = await prisma.rating.upsert({
        where: { user_id_name_id_group_id: { name_id, user_id, group_id } },
        update: { rating },
        create: { name_id, user_id, group_id, rating }
      });
    } catch (e) {
      console.log(e);
      return { "message": "unable to update rating", "success": false };
    }
    return { "message": "success", "success": true };
  }

}
