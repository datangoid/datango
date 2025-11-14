import { CardFooter } from "@/components/ui/card";

export function AuthFooter({ children }: { children: React.ReactNode }) {
  return <CardFooter className="justify-center text-center text-sm">{children}</CardFooter>;
}
