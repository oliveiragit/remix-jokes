import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { getRandomJoke } from "~/models/joke.server";
import { JokeDetails } from "~/components/JokeDetail";

export const loader = async () => {
  const joke = await getRandomJoke();
  if (!joke) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }

  return json({ joke });
};

function JokesIndex() {
  const { joke } = useLoaderData<typeof loader>();
  return <JokeDetails joke={joke} />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        <p>There are no jokes to display.</p>
        <Link to="new">Add your own</Link>
      </div>
    );
  }

  return <div className="error-container">I did a whoopsies.</div>;
}

export default JokesIndex;
