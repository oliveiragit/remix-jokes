import * as React from "react";

import type { DefaultValues, Errors } from "~/types/Forms";

type InputProps = {
  label: string;
  name: string;
  error?: Errors;
  defaultValues: DefaultValues;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function InputComponent({ label, name, defaultValues, error, ...rest }, ref) {
    const errorValueFormatted =
      typeof error === "object" ? error?.[name] : error;
    const defaultValueFormatted =
      typeof defaultValues === "object" ? defaultValues[name] : defaultValues;

    return (
      <div>
        <label>
          {label}:{" "}
          <input
            defaultValue={defaultValueFormatted}
            name={name}
            type="text"
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
