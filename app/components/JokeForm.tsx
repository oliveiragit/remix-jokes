import * as React from "react";
import { Form } from "@remix-run/react";

import type { DefaultValues, Errors, FormError } from "~/types/Forms";
import { Input } from "./Input";
import { TextArea } from "./TextArea";

type JokeFormProps = {
  JokeSubmitButton: React.ReactElement;
  formError?: FormError;
  defaultValues: DefaultValues;
  errors?: Errors;
};

export function JokeForm({
  formError,
  defaultValues,
  errors,
  JokeSubmitButton,
}: JokeFormProps) {
  return (
    <Form method="post">
      <Input
        label="Name"
        name="name"
        defaultValues={defaultValues}
        error={errors}
      />
      <TextArea
        label="Content"
        name="content"
        defaultValues={defaultValues}
        error={errors}
      />
      {formError && (
        <p className="form-validation-error" role="alert">
          {formError}
        </p>
      )}
      {JokeSubmitButton}
    </Form>
  );
}
