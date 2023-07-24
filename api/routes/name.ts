import { Request, Response, Router } from 'express';
import Name, { Sex, NameParams } from '../model/name';
import { AuthUser } from '../middleware/headerauth';
const router = Router();

/* gets a list of random names */
router.get("/", async function (req: Request, res: Response) {

  console.log("AU:", AuthUser);
  const queryParams: NameParams = {};

  if (req.query?.count) { // querystring specified count
    queryParams.count = parseInt(req.query.count.toString()) || 5;
  }

  if (req.query?.sex) { // querystring specified count
    const qs = req.query.sex.toString();
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
