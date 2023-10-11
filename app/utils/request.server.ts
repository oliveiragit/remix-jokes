import { json } from "@remix-run/node";

export type FormErrorPayload<T = any> = {
  fieldErrors?: { [field: string]: string | undefined } | null;
  fields?: T;
  formError?: null | string;
};

export type ErrorHandler<T> = {
  type: "VALIDATION_FAILS";
  payload: T;
};

export function errorHandler<T>(error: ErrorHandler<T>) {
  throw error;
}

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });

export const internalServerError = <T>(data: T) =>
  json<T>(data, { status: 500 });
