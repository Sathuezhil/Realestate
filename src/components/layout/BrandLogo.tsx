import { cn } from "@/lib/utils";
import Image from "next/image";

const sizes = {
  sm: "h-14 w-auto max-w-[9.5rem] sm:h-[4.25rem] sm:max-w-none lg:h-[4.75rem] xl:h-24",
  md: "h-20 w-auto sm:h-28 lg:h-32",
  lg: "h-28 w-auto sm:h-36 lg:h-40",
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
