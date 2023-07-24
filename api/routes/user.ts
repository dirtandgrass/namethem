import { NextFunction, Request, Response, Router } from 'express';
import User from '../model/user';
import cors from 'cors';

const router = Router();

if (process.env.NODE_ENV === "development") {
  router.use(cors());
}

/* get the list of users */
router.get("/", async function (req: Request, res: Response) {

  //const result = await User.getUsers();

  res.json({});
});

//login with user_id, session_id, and hash
router.post("/login", async function (req: Request, res: Response, next: NextFunction) {
  if (!req.body.user_id || !req.body.session_id || !req.body.hash) { next(); return; }


  let extend_session = false;
  if (req.body.extend_session) {
    extend_session = true;
  }

  const result = await User.SessionLogin(parseInt(req.body.user_id), parseInt(req.body.session_id), req.body.hash, extend_session);

  if (result && result.user_id) {
    res.json({ message: "User logged in", success: true, user: result });
  } else {
    res.json({ message: "User not logged in", success: false });
  }
});


//login with email and password
router.post("/login", async function (req: Request, res: Response, next: NextFunction) {
  if (!req.body.email || !req.body.password) { next(); return; }

  let create_session = false;
  if (req.body.create_session) {
    create_session = true;
  }
  const result = await User.EmailPasswordLogin(req.body.email, req.body.password);


  if (result && result.user_id) {

    if (create_session) {

      const session = await User.CreateSession(result.user_id);
      //console.log(session);
      res.json({ message: "User logged in", success: true, user: result, session: session });
      return;
    }

    res.json({ message: "User logged in", success: true, user: result });


  } else {
    res.json({ message: "User not logged in", success: false });
  }
});


//register
router.post("/", async function (req: Request, res: Response) {

  const regResult = await User.Register(req.body.username, req.body.email, req.body.password);

  if (regResult?.success) {
    // send validation email
    res.json({ message: "User created", success: true });
  }

  res.json({ message: "User not created", success: false });

});


router.put("/valid/:user_id", async function (req: Request, res: Response, next: NextFunction) {
  if (!req.query.code) { next(); return; }
  const result = await User.ValidateUser(parseInt(req.params.user_id), req.query.code.toString());

  res.json({ message: result.message, success: result.success });
});




export default router;
