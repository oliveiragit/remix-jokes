import type {
  ActionFunctionArgs,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";

import type { ErrorHandler, FormErrorPayload } from "~/utils/request.server";
import { badRequest, errorHandler } from "~/utils/request.server";
import Input from "~/components/Input";
import styleUrl from "~/styles/login.css";
import { createSession } from "~/models/session.server";
import { validateUrl } from "~/utils/validations/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleUrl },
];

export const meta: MetaFunction = () => {
  const description = "Login to submit your own jokes to Remix Jokes!";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix Jokes | Login" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const loginType = formData.get("loginType");

  const redirectTo = validateUrl(
    (formData.get("redirectTo") as string) || "/jokes"
  );

  try {
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof loginType !== "string"
    ) {
      throw errorHandler<FormErrorPayload>({
        type: "VALIDATION_FAILS",
        payload: {
          formError: "Form not submitted correctly.",
        },
      });
    }

    const session = await createSession({
      user: { username, password },
      loginType,
      redirect: redirectTo,
    });

    return session;
  } catch (e) {
    const error = e as ErrorHandler<FormErrorPayload>;
    if (error.type === "VALIDATION_FAILS") {
      return badRequest(error.payload);
    }
    throw error;
  }
};

function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <section className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          <Input
            defaultValue={actionData?.fields}
            error={actionData?.fieldErrors}
            label="Username"
            name="username"
          />
          <Input
            defaultValue={actionData?.fields}
            error={actionData?.fieldErrors}
            label="Password"
            name="password"
          />
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Login;
