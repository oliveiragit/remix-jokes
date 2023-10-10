import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getRandomJoke } from "~/models/joke.server";
import JokeDetails from "~/components/JokeDetail";

export const loader = async () => {
  const joke = await getRandomJoke();
  return json({ joke });
};

function JokesIndex() {
  const { joke } = useLoaderData<typeof loader>();
  return <JokeDetails joke={joke} />;
}
export default JokesIndex;
