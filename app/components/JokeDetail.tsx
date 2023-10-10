import { Link } from "@remix-run/react";

type JokeDetailParams = {
  joke: {
    id: string;
    name: string;
    content: string;
  };
};

function JokeDetails({ joke: { id, name, content } }: JokeDetailParams) {
  return (
    <section>
      <p>{name}</p>
      <p>{content}</p>
      <Link to={`/jokes/${id}`}>"{name}" Permalink</Link>
    </section>
  );
}

export default JokeDetails;
