import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';



import path from 'path';

import cookieParser from 'cookie-parser';
import logger from 'morgan';
import headerauth from './middleware/headerauth';

import nameRouter from './routes/name';
import sourceRouter from './routes/source';
import userRouter from './routes/user';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

let auth_salt: number = 10;
if (process.env.AUTH_SALT) {
  auth_salt = parseInt(process.env.AUTH_SALT) || 10;
}
export { auth_salt };

app.use(logger('dev'));


app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(headerauth);




app.use('/name', nameRouter);
app.use('/source', sourceRouter);



app.use('/user', userRouter);

// app.get('/', (req, res) => {
//   res.send('Express + TypeScript Server');
// });

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response) {
  res.json({ code: 404, message: "Not found", success: false });
});
// error handler
// app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction): void {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.json(err);
// });
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
