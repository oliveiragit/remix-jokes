import * as React from "react";

type TextAreaProps = {
  label: string;
  name: string;
  error?: { [field: string]: string | undefined } | string;
  defaultValue: { [field: string]: string | undefined } | string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextAreaComponent(
    { label, name, defaultValue, error, ...rest },
    ref
  ) {
    const errorValueFormatted = typeof error === "object" ? error[name] : error;
    const defaultValueFormatted =
      typeof defaultValue === "object" ? defaultValue[name] : defaultValue;

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

export default TextArea;
