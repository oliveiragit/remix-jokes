import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useActionData,
  useRouteError,
} from "@remix-run/react";

import type { FormErrorPayload, ErrorHandler } from "~/utils/request.server";
import { badRequest, errorHandler } from "~/utils/request.server";
import { createJoke } from "~/models/joke.server";
import Input from "~/components/Input";
import TextArea from "~/components/TextArea";
import { getUserId } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const content = formData.get("content");
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  try {
    if (typeof content !== "string" || typeof name !== "string") {
      throw errorHandler<FormErrorPayload>({
        type: "VALIDATION_FAILS",
        payload: {
          fieldErrors: null,
          fields: null,
          formError: "Form not submitted correctly.",
        },
      });
    }

    const newJoke = await createJoke({
      name,
      content,
      jokesterId: userId,
    });
    return redirect(`/jokes/${newJoke.id}`);
  } catch (e) {
    const error = e as ErrorHandler<FormErrorPayload>;
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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}

export default NewJoke;
