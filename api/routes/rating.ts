import { Request, Response, Router } from 'express';
import Rating from '../model/rating';
import cors from 'cors';
import { Sex } from '../model/name';
const router = Router();

if (process.env.NODE_ENV === "development") {
  router.use(cors());
}

/* rate a name */
router.post("/:name_id(\\d+)/", async function (req: Request, res: Response) {

  //console.log(parseInt(req.params.name_id), req.body.rating, req.body.group_id);
  const result = await Rating.rateName(parseInt(req.params.name_id), req.body.rating, req.body.group_id);
  res.json(result);
});


/* get the rating for a name */
router.get("/:name_id(\\d+)/", async function (req: Request, res: Response) {
  const result = await Rating.getRating(parseInt(req.params.name_id));
  res.json(result);
});

/* get top rated names for group */
router.get("/top/:group_id(\\d+)/", async function (req: Request, res: Response) {

  let count: number | undefined;
  if (req.query.count) { count = parseInt(req.query.count.toString()) }

  let sex: Sex | undefined;
  if (req.query.sex) { sex = req.query.sex as Sex }


  const result = await Rating.getTopRatedNames(parseInt(req.params.group_id), count, sex);

  res.json(result);
});

export default router;
