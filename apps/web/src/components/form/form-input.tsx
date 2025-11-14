import type { InputHTMLAttributes, ReactNode } from "react";
import { InputGroup, InputGroupInput } from "../ui/input-group";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

type OmitElements = "id" | "name" | "value" | "onChange" | "onBlur" | "children";
type FormInputProps = FormControlProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, OmitElements> & {
    children?: ReactNode;
  };

export function FormInput({
  label,
  description,
  secondaryLabel,
  isRequired,
  horizontal,
  children,
  controlFirst,
  ...inputProps
}: FormInputProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Access formId from field.form instead of useFormContext
  const fieldId = field.form.options.formId
    ? `${field.form.options.formId}-${field.name}`
    : field.name;

  return (
    <FormBase
      controlFirst={controlFirst}
      description={description}
      horizontal={horizontal}
      isRequired={isRequired}
      label={label}
      secondaryLabel={secondaryLabel}
    >
      <InputGroup>
        <InputGroupInput
          {...inputProps}
          aria-invalid={isInvalid}
          id={fieldId}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          value={field.state.value}
        />
        {children}
      </InputGroup>
    </FormBase>
  );
}
