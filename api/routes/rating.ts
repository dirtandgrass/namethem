import { Request, Response, Router } from 'express';
import Rating from '../model/rating';
import cors from 'cors';
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

export default router;
