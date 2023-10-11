import * as React from "react";

type InputProps = {
  label: string;
  name: string;
  error?: { [field: string]: string | undefined } | string | null;
  defaultValue: { [field: string]: string | undefined } | string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function InputComponent({ label, name, defaultValue, error, ...rest }, ref) {
    const errorValueFormatted =
      typeof error === "object" ? error?.[name] : error;
    const defaultValueFormatted =
      typeof defaultValue === "object" ? defaultValue[name] : defaultValue;

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

export default Input;
