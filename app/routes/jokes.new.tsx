import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import type { BadRequestPayload, ErrorHandler } from "~/utils/request.server";
import { badRequest, errorHandler } from "~/utils/request.server";
import { createJoke } from "~/models/joke.server";

export const action = async (params: ActionFunctionArgs) => {
  const formData = await params.request.formData();
  const name = formData.get("name");
  const content = formData.get("content");

  try {
    if (typeof content !== "string" || typeof name !== "string") {
      throw errorHandler({
        type: "VALIDATION_FAILS",
        payload: {
          fieldErrors: null,
          fields: null,
          formError: "Form not submitted correctly.",
        },
      });
    }

    const newJoke = await createJoke({ name, content });
    return redirect(`/jokes/${newJoke.id}`);
  } catch (e) {
    const error = e as ErrorHandler<BadRequestPayload>;
    if (error.type === "VALIDATION_FAILS") {
      return badRequest(error.payload);
    }
    throw error;
  }
};

function NewJoke() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
              aria-invalid={Boolean(actionData?.fieldErrors?.name)}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" id="name-error" role="alert">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(actionData?.fieldErrors?.content)}
              aria-errormessage={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewJoke;
