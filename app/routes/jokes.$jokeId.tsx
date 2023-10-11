import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { deleteJoke, getJokeById } from "~/models/joke.server";
import JokeDetails from "~/components/JokeDetail";
import { requireUserId } from "~/utils/session.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `Enjoy the "${data.joke.name}" joke and much more`,
        title: `"${data.joke.name}" joke`,
      }
    : { description: "No joke found", title: "No joke" };

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { jokeId } = params;
  if (!jokeId) {
    throw new Error("Joke not found");
  }

  const joke = await getJokeById(jokeId);
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }

  return json({ joke });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(`The intent ${form.get("intent")} is not supported`, {
      status: 400,
    });
  }

  const userId = await requireUserId(request);
  if (typeof params.jokeId !== "string" || !userId) {
    throw new Response("Can't delete what does not exist", {
      status: 401,
    });
  }

  try {
    await deleteJoke(params.jokeId, userId);
    return redirect("/jokes");
  } catch (e) {
    const err = e as Error;
    if (err.message === "404") {
      throw new Response("Can't delete what does not exist", {
        status: 404,
      });
    }

    if (err.message === "403") {
      throw new Response("Pssh, nice try. That's not your joke", {
        status: 403,
      });
    }
  }
};

function JokeRoute() {
  const { joke } = useLoaderData<typeof loader>();
  return (
    <div>
      <JokeDetails joke={joke} />
      <form method="post">
        <button name="intent" type="submit" className="button" value="delete">
          Delete
        </button>
      </form>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();

  if (!isRouteErrorResponse(error)) {
    return (
      <div className="error-container">
        There was an error loading joke by the id "${jokeId}". Sorry.
      </div>
    );
  }

  if (error.status === 400) {
    return (
      <div className="error-container">
        What you're trying to do is not allowed.
      </div>
    );
  }

  if (error.status === 403) {
    return (
      <div className="error-container">
        Sorry, but "{jokeId}" is not your joke.
      </div>
    );
  }

  if (error.status === 404) {
    return (
      <div className="error-container">Huh? What the heck is "{jokeId}"?</div>
    );
  }
}

export default JokeRoute;
