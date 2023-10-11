import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";

import { getJokeById } from "~/models/joke.server";
import JokeDetails from "~/components/JokeDetail";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { jokeId } = params;
  if (!jokeId) {
    throw new Error("Joke not found");
  }

  const joke = await getJokeById(jokeId);

  if (!joke) {
    throw new Error("Joke not found");
  }

  return json({ joke });
};

function JokeRoute() {
  const { joke } = useLoaderData<typeof loader>();
  return <JokeDetails joke={joke} />;
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">
      There was an error loading joke by the id "${jokeId}". Sorry.
    </div>
  );
}

export default JokeRoute;
