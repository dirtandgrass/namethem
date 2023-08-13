import { Request, Response, Router, query } from 'express';
import Name, { Sex, NameParams } from '../model/name';
import { AuthUser } from '../middleware/headerauth';
import cors from 'cors';
import Group from '../model/group';
const router = Router();


if (process.env.NODE_ENV === "development") {
  router.use(cors());
}


let parseSourceAndSex = (req: Request): NameParams => {
  const queryParams: NameParams = {};

  if (AuthUser) {
    if (req.query?.count) { // querystring specified count
      queryParams.count = parseInt(req.query.count.toString()) || 5;
    }

    if (req.query?.sex) { // querystring specified count
      const qs = req.query.sex.toString();
      //console.log("QS:", qs);
      queryParams.sex = qs as Sex || undefined;
    }

    if (req.query?.source_ids) { // querystring specified source_ids

      // allow comma-separated list of source_ids
      if (typeof (req.query.source_ids) === "string" && req.query.source_ids.indexOf(',') > -1) {
        req.query.source_ids = req.query.source_ids.split(',');
      }

      if (Array.isArray(req.query.source_ids)) {
        queryParams.source_ids = req.query.source_ids.map((id) => parseInt(id.toString()) || 1);
      } else {
        queryParams.source_ids = parseInt(req.query.source_ids.toString()) || 1;
      }
    }
  } else {
    queryParams.count = 5;

  }

  return queryParams;
};

/*gets a single unrated name for a user*/
router.get("/unrated", async function (req: Request, res: Response) {
  if (!AuthUser || !AuthUser.user_id) { res.json({ message: "not logged in", success: false }); return; }
  console.log("unrated name 1 ", AuthUser);
  if (!req.query.group_id) { res.json({ message: "no group_id specified", success: false }); return; }
  const group_id = parseInt(req.query.group_id?.toString());
  console.log("unrated name 2 ", AuthUser);
  const { isMember } = await Group.isMember(group_id);

  if (!isMember) { res.json({ message: "not a member of this group", success: false }); return; }
  console.log("unrated name 3 ", AuthUser);
  const { sex, source_ids } = parseSourceAndSex(req);
  console.log("unrated name 4 ", AuthUser);
  const result = await Name.getRandomUnratedName(AuthUser.user_id, group_id, sex, source_ids);

  res.json(result);


});

/* gets a list of random names */
router.get("/", async function (req: Request, res: Response) {

  const queryParams = parseSourceAndSex(req);

  const result = await Name.getRandomNames(queryParams);

  res.json(result);
});

router.get("/similar/:id(\\d+)/", async function (req: Request, res: Response) {

  const result = await Name.getSimilarNamesForId(parseInt(req.params.id));
  res.json(result);
});

router.get("/similar/:name", async function (req: Request, res: Response) {

  const result = await Name.getSimilarNames(req.params.name);
  res.json(result);
});



export default router;
