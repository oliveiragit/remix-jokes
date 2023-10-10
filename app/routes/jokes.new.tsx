import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import type { BadRequestPayload, ErrorHandler } from "~/utils/request.server";
import { badRequest, errorHandler } from "~/utils/request.server";
import { createJoke } from "~/models/joke.server";
import Input from "~/components/Input";
import TextArea from "~/components/TextArea";

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
        <Input
          label="Name"
          name="name"
          defaultValue={actionData?.fields}
          error={actionData?.fieldErrors}
        />
        <TextArea
          label="Content"
          name="content"
          defaultValue={actionData?.fields}
          error={actionData?.fieldErrors}
        />
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
