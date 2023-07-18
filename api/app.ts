import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import createHttpError, { HttpError } from 'http-errors';



const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const nameRouter = require('./routes/name');
const sourceRouter = require('./routes/source');

dotenv.config();

const app: Express = express();
const port = process.env.PORT;



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/name', nameRouter);
app.use('/source', sourceRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createHttpError(404));
});

// error handler
app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction): void {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});




app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
