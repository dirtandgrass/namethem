import { Express, Request, Response, NextFunction, Router } from 'express';
import Source from '../model/source';

const router = Router();

/* get the list of sources */
router.get("/", async function (req: Request, res: Response, next: NextFunction) {

  const result = await Source.getSources();

  res.json(result);
});

router.get("/name/:id(\\d+)/", async function (req: Request, res: Response, next: NextFunction) {

  const result = await Source.getSourcesForNameId(parseInt(req.params.id));
  res.json(result);
});

module.exports = router;
