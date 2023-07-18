import { Express, Request, Response, NextFunction, Router } from 'express';
import Name, { Sex, NameParams } from '../model/name';
const router = Router();

/* gets a list of random names */
router.get("/", async function (req: Request, res: Response, next: NextFunction) {

  const queryParams: NameParams = {};

  if (req.query?.count) { // querystring specified count
    queryParams.count = parseInt(req.query.count.toString()) || 5;
  }

  if (req.query?.sex) { // querystring specified count
    const qs = req.query.sex.toString();
    queryParams.sex = (<any>Sex)[qs] || Sex.any;
  }

  if (req.query?.source_ids) { // querystring specified source_ids
    if (Array.isArray(req.query.source_ids)) {
      queryParams.source_ids = req.query.source_ids.map((id) => parseInt(id.toString()) || 1);
    } else {
      queryParams.source_ids = parseInt(req.query.source_ids.toString()) || 1;
    }
  }

  const result = await Name.getRandomNames(queryParams);

  res.json(result);
});

router.get("/similar/:id(\\d+)/", async function (req: Request, res: Response, next: NextFunction) {

  const result = await Name.getSimilarNamesForId(parseInt(req.params.id));
  res.json(result);
});

router.get("/similar/:name", async function (req: Request, res: Response, next: NextFunction) {

  const result = await Name.getSimilarNames(req.params.name);
  res.json(result);
});



module.exports = router;