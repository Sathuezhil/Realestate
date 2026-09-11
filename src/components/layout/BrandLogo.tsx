import { cn } from "@/lib/utils";
import Image from "next/image";

const sizes = {
  sm: "h-[4.75rem] sm:h-24",
  md: "h-32",
  lg: "h-40",
} as const;

export function BrandLogo({
  size = "sm",
  className,
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="Aurelia Estates"
        width={188}
        height={150}
        className={cn("w-auto object-contain", sizes[size])}
        priority={size === "sm"}
        unoptimized
      />
    </span>
  );
}
