import type { Joke } from "~/types/Joke";

import { Link } from "@remix-run/react";

type JokeDetailParams = {
  joke: Joke;
};

export function JokeDetails({ joke: { id, name, content } }: JokeDetailParams) {
  return (
    <section>
      <p>{name}</p>
      <p>{content}</p>
      <Link to={`/jokes/${id}`}>"{name}" Permalink</Link>
    </section>
  );
}
