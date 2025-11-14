import type { ComponentPropsWithoutRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

type OmitElements = "id" | "name" | "checked" | "onCheckedChange" | "onBlur";
type FormCheckboxProps = FormControlProps &
  Omit<ComponentPropsWithoutRef<typeof Checkbox>, OmitElements>;

export function FormCheckbox({
  label,
  description,
  horizontal,
  isRequired,
  secondaryLabel,
  controlFirst,
  ...checkboxProps
}: FormCheckboxProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Access formId from field.form instead of useFormContext
  const fieldId = field.form.options.formId
    ? `${field.form.options.formId}-${field.name}`
    : field.name;

  return (
    <FormBase
      controlFirst={controlFirst ?? true}
      description={description}
      horizontal={true}
      isRequired={isRequired}
      label={label}
      secondaryLabel={secondaryLabel}
    >
      <Checkbox
        {...checkboxProps}
        aria-invalid={isInvalid}
        checked={field.state.value}
        id={fieldId}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
      />
    </FormBase>
  );
}
