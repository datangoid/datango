import { env } from "cloudflare:workers";
import type { CreateDbClient } from "@datango/db";
import * as schema from "@datango/db/schema/auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, organization, twoFactor } from "better-auth/plugins";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { passkey } from "better-auth/plugins/passkey";
import { getAuthConfig } from "./auth-config";
import { maxPasswordLength, minPasswordLength, organizationTypeEnum } from "./constant";

export const createAuth = (db: CreateDbClient): ReturnType<typeof betterAuth> =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    ...getAuthConfig(env),
    user: {
      additionalFields: {
        phoneNumber: {
          type: "string",
          required: true,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength,
      maxPasswordLength,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        console.info(`Send reset password email to ${user.email} with URL: ${url}`);
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      expiresIn: 60 * 5, // 5 minutes
    },
    socialProviders: {
      google: {
        clientId: "asd",
        clientSecret: "asd",
      },
    },
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          if (type === "email-verification") {
            console.info(`Send email verification OTP to ${email}: ${otp}`);
          }
        },
        overrideDefaultEmailVerification: true,
      }),
      twoFactor(),
      passkey(),
      adminPlugin(),
      organization({
        schema: {
          organization: {
            additionalFields: {
              description: {
                type: "string",
                input: true,
                required: false,
              },
              type: {
                type: "string",
                input: true,
                required: true,
                options: organizationTypeEnum,
              },
              status: {
                type: "boolean",
                input: true,
                required: false,
                defaultValue: true,
              },
              subscriptionPlan: {
                type: "string",
                input: true,
                required: false,
                options: "string",
              },
            },
          },
        },
        sendInvitationEmail: async ({ email, organization, inviter, invitation }) => {
          console.info(
            `Send invitation email to ${email} to join organization ${organization.name} with invitation link: ${invitation} from inviter: ${inviter.user.email}`
          );
        },
      }),
    ],
  } as BetterAuthOptions);

export type BetterAuth = ReturnType<typeof createAuth>;
export type AuthData = BetterAuth["$Infer"]["Session"];
export type User = BetterAuth["$Infer"]["Session"]["user"];
export type Session = BetterAuth["$Infer"]["Session"]["session"];
