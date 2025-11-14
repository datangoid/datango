import { CardTitle } from "@/components/ui/card";

export function AuthTitle({ children }: { children: React.ReactNode }) {
  return <CardTitle className="mb-6 text-center font-bold text-3xl">{children}</CardTitle>;
}
