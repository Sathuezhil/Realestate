import { cn } from "@/lib/utils";
import Image from "next/image";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", className)}>
      <Image
        src="/whatsapp.png"
        alt=""
        width={50}
        height={50}
        className="h-full w-full object-contain"
        unoptimized
      />
    </span>
  );
}
