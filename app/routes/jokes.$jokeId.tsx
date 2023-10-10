import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getJokeById } from "~/models/joke.server";

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

function JokeDetail(params: any) {
  const { joke } = useLoaderData<typeof loader>();

  return (
    <section>
      <p>{joke.name}</p>
      <p>{joke.content}</p>
      <Link to=".">"{joke.name}" Permalink</Link>
    </section>
  );
}

export default JokeDetail;
