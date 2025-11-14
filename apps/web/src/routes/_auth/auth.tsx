import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { AuthTitle } from "@/features/auth/components/auth-title";
import SignInForm from "@/features/auth/sign-in-form";
import SignUpForm from "@/features/auth/sign-up-form";
import VerifyEmail from "@/features/auth/verify-email";

const authSearchSchema = z.object({
  "verify-email": z.string().optional(),
});

export const Route = createFileRoute("/_auth/auth")({
  component: AuthPage,
  validateSearch: authSearchSchema,
});

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";

function AuthPage() {
  const { "verify-email": verifyEmailToken } = Route.useSearch();
  const [selectedTab, setSelectedTab] = useState<Tab>(
    verifyEmailToken ? "email-verification" : "signin"
  );
  return (
    <Card className="flex w-full max-w-md flex-col">
      <Tabs className="w-full" onValueChange={(t) => setSelectedTab(t as Tab)} value={selectedTab}>
        <TabsContent value="signin">
          <AuthTitle>Welcome back</AuthTitle>
          <CardContent className="flex w-full flex-col">
            <SignInForm />
          </CardContent>
          <AuthFooter>
            Need an account?
            <Button className="ml-2 p-0" onClick={() => setSelectedTab("signup")} variant="link">
              Sign Up
            </Button>
          </AuthFooter>
        </TabsContent>
        <TabsContent value="signup">
          <AuthTitle>Create an account</AuthTitle>
          <CardContent className="flex w-full flex-col">
            <SignUpForm />
          </CardContent>
          <AuthFooter>
            Already have an account?
            <Button className="ml-2 p-0" onClick={() => setSelectedTab("signin")} variant="link">
              Sign In
            </Button>
          </AuthFooter>
        </TabsContent>
        <TabsContent value="email-verification">
          <AuthTitle>Verify your email</AuthTitle>
          <CardContent className="flex w-full flex-col">
            <VerifyEmail email={verifyEmailToken} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
