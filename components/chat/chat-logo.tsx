import { MmuGeniusLogo } from "@/components/logo"

interface ChatLogoProps {
  size?: "small" | "medium" | "large"
  className?: string
}

export function ChatLogo({ size = "medium", className = "" }: ChatLogoProps) {
  const dimensions = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 },
  }

  const { width, height } = dimensions[size]

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <MmuGeniusLogo width={width} height={height} responsive className="transform scale-110" />
    </div>
  )
}
