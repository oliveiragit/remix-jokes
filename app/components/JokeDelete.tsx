import { Form } from "@remix-run/react";

type JokeDeleteProps = {
  disabled?: boolean;
};

export function JokeDelete({ disabled = false }: JokeDeleteProps) {
  return (
    <Form method="post">
      <button
        disabled={disabled}
        name="intent"
        type="submit"
        className="button"
        value="delete"
      >
        Delete
      </button>
    </Form>
  );
}
