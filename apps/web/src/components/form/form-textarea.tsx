import type { TextareaHTMLAttributes } from "react";
import { Textarea } from "../ui/textarea";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

type OmitElements = "id" | "name" | "value" | "onChange" | "onBlur";
type FormTextareaProps = FormControlProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, OmitElements>;

export function FormTextarea({
  label,
  description,
  horizontal,
  secondaryLabel,
  isRequired,
  controlFirst,
  ...textareaProps
}: FormTextareaProps) {
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
      <Textarea
        {...textareaProps}
        aria-invalid={isInvalid}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
      />
    </FormBase>
  );
}
