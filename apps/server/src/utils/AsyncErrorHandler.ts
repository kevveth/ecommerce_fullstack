import { Request, Response, NextFunction } from "express";

interface AsyncHandler<T> {
  (req: Request<any>, res: Response<any>, next: NextFunction): T;
}

const asyncErrorHandler = (
  func: AsyncHandler<Promise<any>>,
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err) => next(err));
  };
};

export default asyncErrorHandler;
