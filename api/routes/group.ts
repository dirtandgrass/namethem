import { Request, Response, Router } from 'express';
import Group from '../model/group';
import cors from 'cors';
const router = Router();

if (process.env.NODE_ENV === "development") {
  router.use(cors());
}

/* get the list of sources */
router.post("/", async function (req: Request, res: Response) {

  const result = await Group.createGroup(req.body.name, req.body.description);

  res.json(result);
});

// router.get("/name/:id(\\d+)/", async function (req: Request, res: Response) {

//   const result = await Source.getSourcesForNameId(parseInt(req.params.id));
//   res.json(result);
// });

export default router;
