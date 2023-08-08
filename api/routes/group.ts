import { Request, Response, Router } from 'express';
import Group, { Role } from '../model/group';
import cors from 'cors';
const router = Router();

if (process.env.NODE_ENV === "development") {
  router.use(cors());
}

/* create a group */
router.post("/", async function (req: Request, res: Response) {

  const result = await Group.createGroup(req.body.name, req.body.description);

  res.json(result);
});

/* accept invite to group */
router.post("/:group_id(\\d+)/accept", async function (req: Request, res: Response) {

  const key = req.body.key as string;
  const group_id = parseInt(req.params.group_id);

  const result = await Group.acceptInvite(group_id, key);

  res.json(result);
});

/*invite user to group*/
router.post("/:group_id(\\d+)/invite", async function (req: Request, res: Response) {

  const role: Role = req.body.role || "participant";

  const result = await Group.inviteUser(parseInt(req.params.group_id), req.body.user_id, role);

  res.json(result);
});

/*list groups*/
router.get("/", async function (req: Request, res: Response) {
  const result = await Group.getGroups();

  res.json(result);
});

export default router;
