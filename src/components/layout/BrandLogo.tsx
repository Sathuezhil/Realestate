import { cn } from "@/lib/utils";
import Image from "next/image";

const sizes = {
  sm: "h-14 sm:h-16",
  md: "h-[4.75rem]",
  lg: "h-24",
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
        alt="Aurelia Realestate Dubai"
        width={1430}
        height={1100}
        className={cn("w-auto object-contain", sizes[size])}
        priority={size === "sm"}
        unoptimized
      />
    </span>
  );
}
