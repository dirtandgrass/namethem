import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



export enum Sex {
  male = "male", female = "female", unisex = "unisex", all = "all"
}

export type NameParams = { count?: number, source_ids?: number | Array<number>, sex?: Sex }



export default class Name {

  static async getSimilarNamesForId(name_id: number): Promise<{ count: number, data: string[] }> {

    const similar = await prisma.similar.findMany({
      where: { name_id: name_id }, select: { similar_name_id: true, name_similar_similar_name_idToname: { select: { name: true } } }
    });

    const data: string[] = similar.map((item) => item.name_similar_similar_name_idToname.name);

    const resultObj = { count: similar.length, data: data }
    return resultObj;
  }
  static async getSimilarNames(name: string): Promise<{ count: number, data: string[] }> {

    const name_id = await prisma.name.findFirst({ where: { name: { equals: name, mode: 'insensitive' } }, select: { name_id: true } });

    //console.log(name_id);
    if (name_id === null) return { count: 0, data: [] };

    return this.getSimilarNamesForId(name_id.name_id);

  }
  static async getRandomNames({ count = 5, source_ids = -1, sex = Sex.all }: NameParams)
    : Promise<{ count?: number, source_id?: number | Array<number>, sex?: string, data: Record<string, unknown> }> {
    count = Math.round(count);
    if (count < 1) { count = 1 } else if (count > 20) { count = 20 }

    let source_clause = "";
    if (source_ids !== -1) {
      if (Array.isArray(source_ids)) {
        source_clause = `where sn.source_id in (${source_ids.join(",")})`;
      } else {
        source_clause = `where sn.source_id in (${source_ids})`;
      }
    }


    let sex_clause = "";


    if (sex !== Sex.all) {
      sex_clause = (source_clause.length > 0 ? "and " : "where ");
      if (sex == Sex.unisex) {
        sex_clause += 'n.male = true AND n.female = true ' // unisex
      } else {
        sex_clause += `n.${Sex[sex]} = true ` // one sex
      }

    }

    const query = `select n.name_id, n.name, n.male, n.female from source_name sn join name n on n.name_id=sn.name_id ${source_clause} ${sex_clause} order by random() limit ${count}`;

    //console.log(query);
    const data: Record<string, unknown> = await prisma.$queryRawUnsafe(query);

    const resultObj = { count, source_ids, sex: Sex[sex], data }

    return resultObj
  }
}
