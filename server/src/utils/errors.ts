import type { NextFunction, Request, RequestHandler, Response } from 'express';

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public code: string = 'error',
    public details?: unknown,
  ) {
    super(message);
  }
}

export const badRequest = (msg = 'Bad request', details?: unknown) => new AppError(400, msg, 'bad_request', details);
export const unauthorized = (msg = 'Authentication required') => new AppError(401, msg, 'unauthorized');
export const forbidden = (msg = 'You do not have permission to do that') => new AppError(403, msg, 'forbidden');
export const notFound = (msg = 'Not found') => new AppError(404, msg, 'not_found');
export const conflict = (msg = 'Conflict') => new AppError(409, msg, 'conflict');

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/** Wraps an async route handler so rejected promises reach the central error handler (Express 4). */
export const asyncHandler =
  (fn: AsyncFn): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
