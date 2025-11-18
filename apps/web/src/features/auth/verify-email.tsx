import { useNavigate } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient, refetchSessionQuery } from "@/integration/auth-client";
import { AuthTitle } from "./components/auth-title";

export default function VerifyEmail({ search }: { search: { redirect?: string; email: string } }) {
  const navigate = useNavigate({
    from: "/sign-up",
  });
  const [isPending, startTransition] = useTransition();
  const [otp, setOtp] = useState("");

  const handleVerifyEmail = useEffectEvent(() => {
    if (isPending) {
      return;
    }
    startTransition(async () => {
      await authClient.emailOtp.verifyEmail(
        { email: search.email, otp },
        {
          onSuccess: async () => {
            await refetchSessionQuery();
            navigate({
              to: search.redirect || "/",
            });
          },
          onError: (ctx) => {
            if (ctx.error.code === "TOO_MANY_ATTEMPTS") {
              navigate({
                to: search.redirect || "/sign-in",
                viewTransition: true,
                search: search.redirect,
              });
              toast.error("Too many attempts. Please request a new OTP.");
            } else if (ctx.error.code === "OTP_EXPIRED") {
              navigate({
                to: search.redirect || "/sign-in",
                viewTransition: true,
                search: search.redirect,
              });
              toast.error("OTP has expired. Please sign in to request a new OTP.");
            } else {
              toast.error(ctx.error.message);
            }
            setOtp("");
          },
        }
      );
    });
  });
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyEmail();
    }
  }, [otp]);
  return (
    <>
      <AuthTitle>Verify Your Email</AuthTitle>
      <div className="flex w-full flex-col items-center justify-center gap-6 text-center">
        <div className="block">
          <p>We have sent a 6-digit verification code to</p>
          <b>{search.email}</b>
        </div>
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <InputOTP disabled={true} maxLength={6} value={otp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={4} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <span>Verifying...</span>
          </div>
        ) : (
          <InputOTP
            autoFocus
            disabled={isPending}
            maxLength={6}
            onChange={(otp) => setOtp(otp)}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={4} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        )}

        <p>
          If you did not receive the email, please <b>check your spam folder</b>.
        </p>
      </div>
    </>
  );
}
