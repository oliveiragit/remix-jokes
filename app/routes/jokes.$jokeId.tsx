import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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

export default JokeRoute;
