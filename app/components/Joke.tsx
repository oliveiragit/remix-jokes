import * as React from "react";

import type { Joke } from "~/types/Joke";
import { JokeDetails } from "./JokeDetail";

type JokeProps = {
  joke: Joke;
  Footer?: React.ReactElement;
};

export  function JokeComponent({ joke, Footer }: JokeProps) {
  return (
    <div>
      <JokeDetails joke={joke} />
      {Footer}
    </div>
  );
}


