import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import AppError from './appError';


// Type for the error source structure
export type TErrorSources = {
    path: string | number;
    message: string;
}[];

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorSources: TErrorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];

    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorSources = err.issues.map((issue) => ({
            path: issue.path[issue.path.length - 1] as string | number,
            message: issue.message,
        }));
    } else if (err.name === 'PrismaClientKnownRequestError') {
        const prismaErr = err as any;
        statusCode = 400;
        if (prismaErr.code === 'P2002') {
            message = 'Duplicate Key Error';
            errorSources = [
                {
                    path: '',
                    message: 'Duplicate key value violates unique constraint',
                },
            ];
        } else if (prismaErr.code === 'P2025') {
            statusCode = 404;
            message = 'Record Not Found';
            errorSources = [
                {
                    path: '',
                    message: prismaErr.message,
                },
            ];
        } else {
            message = 'Database Error';
            errorSources = [
                {
                    path: '',
                    message: prismaErr.message,
                },
            ];
        }
    } else if (err.name === 'PrismaClientValidationError') {
        statusCode = 400;
        message = 'Database Validation Error';
        errorSources = [
            {
                path: '',
                message: err.message,
            },
        ];
    } else if (err.name === 'PrismaClientInitializationError') {
        statusCode = 500;
        message = 'Database Initialization Error';
        errorSources = [
            {
                path: '',
                message: err.message,
            },
        ];
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err.message,
            },
        ];
    } else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err.message,
            },
        ];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
    });
};

export default globalErrorHandler;
