// asyncLocalStorage.ts
import { AsyncLocalStorage } from "async_hooks";
import { Request, Response, NextFunction } from "express";

interface StoreType {
    res: Response;
}

export const asyncLocalStorage = new AsyncLocalStorage<StoreType>();

export const asyncLocalMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    asyncLocalStorage.run({ res }, () => {
        next();
    });
};
