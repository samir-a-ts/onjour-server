import AppError from './errors/error';

export default class Fold {
    static execute<T>(res: T | AppError, onUnknown: (res: T) => void, onError: (err: AppError) => void): void {
        if (res instanceof AppError) {
            onError(res);
        }
        else {
            onUnknown(res);
        }
    }
}