import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
  responsive?: boolean
}

export function MmuGeniusLogo({
  width = 40,
  height = 40,
  className = "",
  priority = false,
  responsive = false,
}: LogoProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", responsive && "mmu-genius-logo-responsive", className)}
      style={{
        minWidth: width,
        minHeight: height,
        width,
        height,
      }}
    >
      <Image
        src="/assets/images/mmu-genius-logo.png"
        alt="MMU Genius Logo"
        fill
        className="object-contain"
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
