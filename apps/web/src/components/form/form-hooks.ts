import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormCheckbox } from "./form-checkbox";
import { FormInput } from "./form-input";
import { FormPassword } from "./form-password";
import { FormSelect } from "./form-select";
import { FormTextarea } from "./form-textarea";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Select: FormSelect,
    Checkbox: FormCheckbox,
    Textarea: FormTextarea,
    Password: FormPassword,
  },
  formContext,
  fieldContext,
  formComponents: {},
});

export { useAppForm, useFieldContext, useFormContext };
