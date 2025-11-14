import type React from "react";
import type { ReactNode } from "react";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { useFieldContext } from "./form-hooks";

export type FormControlProps = {
  label: string;
  horizontal?: boolean;
  isRequired?: boolean;
  description?: string;
  controlFirst?: boolean;
  secondaryLabel?: React.ReactNode;
};

type FormBaseProps = FormControlProps & {
  children: ReactNode;
};

export function FormBase({
  label,
  children,
  horizontal,
  isRequired,
  description,
  controlFirst,
  secondaryLabel,
}: FormBaseProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const labelElement = (
    <>
      <div className="flex w-full items-center justify-between">
        <FieldLabel className="gap-1" htmlFor={field.name}>
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
        {secondaryLabel && <div>{secondaryLabel}</div>}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );
  const errorElem = isInvalid && <FieldError errors={field.state.meta.errors} />;

  return (
    <Field data-invalid={isInvalid} orientation={horizontal ? "horizontal" : undefined}>
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {errorElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  );
}
