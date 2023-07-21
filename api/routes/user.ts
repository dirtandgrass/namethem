import { Request, Response, Router } from 'express';
import User from '../model/user';

const router = Router();

/* get the list of sources */
router.get("/", async function (req: Request, res: Response) {

  //const result = await User.getUsers();

  res.json({});
});

router.post("/", async function (req: Request, res: Response) {

  const regResult = await User.Register(req.body.username, req.body.email, req.body.password);

  res.json(regResult);
});

export default router;
