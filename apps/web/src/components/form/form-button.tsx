import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { Spinner } from "../ui/spinner";

export function FormButton({
  children,
  disabled,
  isLoading,
  className,
  size,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { isLoading: boolean; type?: string }) {
  return (
    <Button
      disabled={isLoading || disabled}
      size={size}
      type={props.type || "submit"}
      {...props}
      className={cn("flex cursor-pointer justify-center gap-2 px-3", className)}
    >
      {isLoading && <Spinner />}
      {size === "icon" && isLoading ? null : children}
    </Button>
  );
}
