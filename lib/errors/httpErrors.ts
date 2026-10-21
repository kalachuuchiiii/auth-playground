import { AppError } from "./appError";

export class HttpError extends AppError {
    public kind = "CUSTOM_HTTP_ERROR" as const;

    constructor(
        status: number,
        code: string,
        message: string,
        extra: Record<string, unknown> = {},
    ) {
        super(status, code, message, extra);
        this.name = new.target.name;
    }
}

export class BadRequestError extends HttpError {
    constructor(message = "Bad request", code = "BAD_REQUEST", extra: Record<string, unknown> = {}) {
        super(400, code, message, extra);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized", code = "UNAUTHORIZED", extra: Record<string, unknown> = {}) {
        super(401, code, message, extra);
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = "Forbidden", code = "FORBIDDEN", extra: Record<string, unknown> = {}) {
        super(403, code, message, extra);
    }
}

export class NotFoundError extends HttpError {
    constructor(message = "Not found", code = "NOT_FOUND", extra: Record<string, unknown> = {}) {
        super(404, code, message, extra);
    }
}

export class ConflictError extends HttpError {
    constructor(message = "Conflict", code = "CONFLICT", extra: Record<string, unknown> = {}) {
        super(409, code, message, extra);
    }
}

export class TooManyRequestsError extends HttpError {
    constructor(retryAfter: number, message = "Too many requests", code = "RATE_LIMITED") {
        super(429, code, message, { retryAfter });
    }
}

export class InternalServerError extends HttpError {
    constructor(message = "Something went wrong", code = "INTERNAL_ERROR", extra: Record<string, unknown> = {}) {
        super(500, code, message, extra);
    }
}