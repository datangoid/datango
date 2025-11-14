import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { FormButton } from "@/components/form/form-button";
import { useAppForm } from "@/components/form/form-hooks";
import { authClient } from "@/integration/auth-client";

const FormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});
type FormData = z.infer<typeof FormSchema>;

export default function SignInForm() {
  const navigate = useNavigate({
    from: "/",
  });

  const form = useAppForm({
    formId: "sign-in-form",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    } satisfies FormData as FormData,
    validators: {
      onSubmit: FormSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/",
            });
            toast.success("Sign in successful");
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
      <form.AppField name="password">
        {(field) => (
          <field.Password
            autoComplete="current-password"
            isRequired
            label="Password"
            secondaryLabel={secondaryLabel}
          />
        )}
      </form.AppField>
      <form.AppField name="rememberMe">
        {(field) => <field.Checkbox label="Keep me signed in" />}
      </form.AppField>
      <form.Subscribe>
        {(state) => (
          <FormButton className="w-full" disabled={!state.canSubmit} isLoading={state.isSubmitting}>
            Sign In
          </FormButton>
        )}
      </form.Subscribe>
    </form>
  );
}

const secondaryLabel = (
  <button
    className="text-muted-foreground text-sm underline underline-offset-2 hover:text-foreground"
    type="button"
  >
    Forgot Password?
  </button>
);
