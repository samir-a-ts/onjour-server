class AppError {
    code: string;
    message: string;

    constructor({ code, message }: { code: string, message: string }) {
        this.code = code;
        this.message = message;
    }

    toJSON(): Record<string, unknown> {
        return {
            code: this.code,
            message: this.message,
        };
    }
}

export default AppError;