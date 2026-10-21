import { HttpError } from "@/lib/errors/httpErrors";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";

type Handler<T> = (req: NextRequest) => Promise<NextResponse<T>>;

type ErrorResponse = {
    message: string,
    code: string,
    success: boolean;
}


export const catchErrors = <T>(fn: Handler<T>): Handler<T | ErrorResponse> => {
    return async (req) => {
        try {
            return await fn(req);
        } catch (e: unknown) {
            console.log('SERVER ERROR: ', JSON.stringify(e));
            if (e instanceof HttpError) {
                return NextResponse.json({
                    code: e.code,
                    success: false,
                    kind: e.kind,
                    extra: e.extra,
                    message: e.message,
                }, {
                    status: e.status
                });
            }

            if (e instanceof ZodError) {
                const errors = z.flattenError(e);
                return NextResponse.json(
                    { success: false, code: "VALIDATION_ERROR", message: "Invalid input", errors },
                    { status: 400 },
                );
            }

            return NextResponse.json({
                success: false,
                message: (e as Error)?.message || 'Internal Server Error',
                code: 'INTERNAL_SERVER_ERROR'
            }, {
                status: 500
            })
        }
    }
} 