import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useActionData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";

import type { FormErrorPayload, ErrorHandler } from "~/utils/request.server";
import { badRequest, errorHandler } from "~/utils/request.server";
import { createJoke } from "~/models/joke.server";
import { getUserId } from "~/utils/session.server";
import { JokeComponent } from "~/components/Joke";
import {
  validateJokeContent,
  validateJokeName,
} from "~/utils/validations/joke.server";
import { JokeDelete } from "~/components/JokeDelete";
import { JokeForm } from "~/components/JokeForm";
import { JokeFormCreateButton } from "~/components/JokeFormCreateButton";

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
  const navigation = useNavigation();

  if (navigation.formData) {
    const content = navigation.formData.get("content");
    const name = navigation.formData.get("name");
    if (
      typeof content === "string" &&
      typeof name === "string" &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    ) {
      return (
        <JokeComponent
          joke={{ name, content }}
          Footer={<JokeDelete disabled />}
        />
      );
    }
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <JokeForm
        errors={actionData?.fieldErrors}
        defaultValues={actionData?.fields}
        formError={actionData?.formError}
        JokeSubmitButton={<JokeFormCreateButton />}
      />
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
