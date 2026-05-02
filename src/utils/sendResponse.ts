import { Response } from 'express';
import httpStatus from 'http-status';

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || '',
    data: data.data,
    ...(data.meta && { meta: data.meta }),
  });
};

export default sendResponse;