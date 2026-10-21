

export class AppError extends Error {
    constructor(public status: number, public code: string, public message: string, public extra: Record<any, unknown> = {}) {
        super(message);
    }
}