import * as React from "react";
import type { DefaultValues, Errors } from "~/types/Forms";

type TextAreaProps = {
  label: string;
  name: string;
  error?: Errors;
  defaultValues: DefaultValues;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextAreaComponent(
    { label, name, defaultValues, error, ...rest },
    ref
  ) {
    const errorValueFormatted =
      typeof error === "object" ? error?.[name] : error;
    const defaultValueFormatted =
      typeof defaultValues === "object" ? defaultValues[name] : defaultValues;

    return (
      <div>
        <label>
          {label}:{" "}
          <textarea
            defaultValue={defaultValueFormatted}
            name={name}
            aria-invalid={Boolean(errorValueFormatted)}
            aria-errormessage={
              errorValueFormatted ? `${name}-error` : undefined
            }
            ref={ref}
            {...rest}
          />
        </label>
        {!!errorValueFormatted && (
          <p
            className="form-validation-error"
            id={`${name}-error`}
            role="alert"
          >
            {errorValueFormatted}
          </p>
        )}
      </div>
    );
  }
);
