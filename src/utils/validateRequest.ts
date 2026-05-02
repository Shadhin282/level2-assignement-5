import { Request, Response, NextFunction } from 'express';

const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
        headers: req.headers,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;