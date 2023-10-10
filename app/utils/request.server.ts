import { json } from "@remix-run/node";

export type BadRequestPayload<T = any> = {
  fieldErrors: { [field: string]: string | undefined };
  fields: T;
  formError: null | string;
};

export type ErrorHandler<T> = {
  type: "VALIDATION_FAILS";
  payload: T;
};

export function errorHandler<T>(error: ErrorHandler<T>) {
  throw error;
}

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });
