import { PrismaClient } from '@prisma/client'
import { GetResult } from '@prisma/client/runtime/library';
const prisma = new PrismaClient()



export default class Source {
  static async getSources(): Promise<{ count: number, data: any }> { //todo specify 'data' type

    const sources = await prisma.source.findMany(
      { orderBy: { name: 'asc' } }
    );

    const resultObj = { count: sources.length, data: sources }
    return resultObj;
  }


}
