import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { createJoke } from "~/models/joke.server";

export const action = async (params: ActionFunctionArgs) => {
  const formData = await params.request.formData();
  const name = formData.get("name");
  const content = formData.get("content");

  if (typeof name !== "string" || typeof content !== "string") {
    throw new Error("invalid");
  }

  const newJoke = await createJoke({ name, content });
  return redirect(`/jokes/${newJoke.id}`);
};
function NewJoke() {
  return (
    <section>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </section>
  );
}

export default NewJoke;
