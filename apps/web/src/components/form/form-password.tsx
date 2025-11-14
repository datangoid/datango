import { Eye, EyeClosed } from "lucide-react";
import { type InputHTMLAttributes, type ReactNode, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

type OmitElements = "id" | "name" | "value" | "onChange" | "onBlur" | "children";
type FormPasswordProps = FormControlProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, OmitElements> & {
    children?: ReactNode;
  };

export function FormPassword({
  label,
  description,
  secondaryLabel,
  isRequired,
  horizontal,
  children,
  controlFirst,
  ...inputProps
}: FormPasswordProps) {
  const field = useFieldContext<string>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
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
          type={isVisible ? "text" : "password"}
          value={field.state.value}
        />
        {children}
        <InputGroupAddon align="inline-end">
          <button
            aria-controls="password"
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            className="flex h-full w-5 rounded-full text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={toggleVisibility}
            tabIndex={-1}
            type="button"
          >
            {isVisible ? (
              <EyeClosed aria-hidden="true" size={16} strokeWidth={2} />
            ) : (
              <Eye aria-hidden="true" size={16} strokeWidth={2} />
            )}
          </button>
        </InputGroupAddon>
      </InputGroup>
    </FormBase>
  );
}
