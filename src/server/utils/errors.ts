export class ServerError extends Error {
    constructor(message: string, context: Record<string, unknown>) {
        super(message);

        Object.assign(this, context);
        Error.captureStackTrace(this, ServerError);

        this.name = this.constructor.name;
    }
}
