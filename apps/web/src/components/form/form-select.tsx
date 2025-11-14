import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

type FormSelectProps = FormControlProps & {
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Select>, "onValueChange" | "value">;

export function FormSelect({
  children,
  label,
  description,
  secondaryLabel,
  isRequired,
  horizontal,
  controlFirst,
  ...selectProps
}: FormSelectProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase
      controlFirst={controlFirst}
      description={description}
      horizontal={horizontal}
      isRequired={isRequired}
      label={label}
      secondaryLabel={secondaryLabel}
    >
      <Select
        {...selectProps}
        onValueChange={(e) => field.handleChange(e)}
        value={field.state.value}
      >
        <SelectTrigger aria-invalid={isInvalid} id={field.name} onBlur={field.handleBlur}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </FormBase>
  );
}
