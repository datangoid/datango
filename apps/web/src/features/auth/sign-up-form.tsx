import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { FormButton } from "@/components/form/form-button";
import { useAppForm } from "@/components/form/form-hooks";
import { authClient } from "@/integration/auth-client";
import { AuthFooter } from "./components/auth-footer";
import { AuthTitle } from "./components/auth-title";

const FormSchema = z.object({
  email: z.email("Invalid email address"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
});
type FormData = z.infer<typeof FormSchema>;
export function SignUpForm({ search }: { search: { redirect?: string } }) {
  const navigate = useNavigate({
    from: "/sign-up",
  });

  const form = useAppForm({
    formId: "sign-up-form",
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: FormSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(value, {
        onSuccess: () => {
          navigate({
            to: "/verify-email",
            search: { email: value.email, redirect: search.redirect },
            viewTransition: true,
          });
        },
        onError: (error) => {
          toast.error(error.error.message || error.error.statusText);
        },
      });
    },
  });

  return (
    <>
      <AuthTitle>Create an account</AuthTitle>
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
        <form.AppField name="phoneNumber">
          {(field) => <field.Input autoComplete="tel" isRequired label="Phone Number" type="tel" />}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.Input autoComplete="new-password" isRequired label="Password" type="password" />
          )}
        </form.AppField>
        <form.Subscribe>
          {(state) => (
            <FormButton
              className="w-full"
              disabled={!state.canSubmit}
              isLoading={state.isSubmitting}
            >
              Sign Up
            </FormButton>
          )}
        </form.Subscribe>
      </form>
      <AuthFooter>
        Already have an account?
        <Link className="ml-1 text-primary" to="/sign-in" viewTransition>
          Sign In
        </Link>
      </AuthFooter>
    </>
  );
}
