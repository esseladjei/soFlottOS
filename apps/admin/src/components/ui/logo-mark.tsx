import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      alt="soFlott"
      className={cn("size-12 object-contain", className)}
      height={1254}
      priority
      src="/logo/soFlott_arrow.png"
      width={1254}
    />
  );
}
