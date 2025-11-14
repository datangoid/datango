import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { FormButton } from "@/components/form/form-button";
import { useAppForm } from "@/components/form/form-hooks";
import { authClient } from "@/integration/auth-client";

const FormSchema = z.object({
  email: z.email("Invalid email address"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  // phoneNumber: z.string().min(10, "Nomor telepon minimal 10 karakter"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
});
type FormData = z.infer<typeof FormSchema>;
export default function SignUpForm() {
  const navigate = useNavigate({
    from: "/",
  });

  const form = useAppForm({
    formId: "sign-up-form",
    defaultValues: {
      email: "",
      password: "",
      name: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: FormSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="email">
        {(field) => <field.Input autoComplete="email" isRequired label="Email" type="email" />}
      </form.AppField>
      <form.AppField name="name">
        {(field) => <field.Input autoComplete="name" isRequired label="Name" type="text" />}
      </form.AppField>
      <form.AppField name="password">
        {(field) => (
          <field.Input autoComplete="new-password" isRequired label="Password" type="password" />
        )}
      </form.AppField>
      <form.Subscribe>
        {(state) => (
          <FormButton className="w-full" disabled={!state.canSubmit} isLoading={state.isSubmitting}>
            Sign Up
          </FormButton>
        )}
      </form.Subscribe>
    </form>
  );
}
