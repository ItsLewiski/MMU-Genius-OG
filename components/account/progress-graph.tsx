"use client"

import { useEffect, useRef } from "react"

interface ProgressGraphProps {
  progressHistory: {
    date: string
    value: number
  }[]
}

export function ProgressGraph({ progressHistory }: ProgressGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || progressHistory.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Set graph dimensions
    const padding = 40 // Increased padding for better label visibility
    const graphWidth = rect.width - padding * 2
    const graphHeight = rect.height - padding * 2

    // Sort progress history by date
    const sortedHistory = [...progressHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Find min and max dates
    const minDate = new Date(sortedHistory[0].date).getTime()
    const maxDate = new Date(sortedHistory[sortedHistory.length - 1].date).getTime()
    const dateRange = maxDate - minDate || 1 // Avoid division by zero

    // Draw axes
    ctx.strokeStyle = "#e2e8f0" // Tailwind slate-200
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, rect.height - padding)
    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, rect.height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0" // Tailwind slate-200
    ctx.lineWidth = 0.5

    // Horizontal grid lines (every 20%)
    for (let i = 0; i <= 5; i++) {
      const y = rect.height - padding - graphHeight * (i * 0.2)

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(rect.width - padding, y)
      ctx.stroke()

      // Add percentage labels
      ctx.fillStyle = "#94a3b8" // Tailwind slate-400
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${i * 20}%`, padding - 5, y + 3)
    }

    // Draw progress line
    ctx.strokeStyle = "#8b5cf6" // Tailwind purple-500
    ctx.lineWidth = 2
    ctx.beginPath()

    sortedHistory.forEach((point, index) => {
      const dateTime = new Date(point.date).getTime()
      const x = padding + ((dateTime - minDate) / dateRange) * graphWidth
      const y = rect.height - padding - graphHeight * (point.value / 100)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points and value labels
    ctx.fillStyle = "#8b5cf6" // Tailwind purple-500

    sortedHistory.forEach((point) => {
      const dateTime = new Date(point.date).getTime()
      const x = padding + ((dateTime - minDate) / dateRange) * graphWidth
      const y = rect.height - padding - graphHeight * (point.value / 100)

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Add value label above point
      ctx.fillStyle = "#6b7280" // Tailwind gray-500
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${point.value}%`, x, y - 10)
      ctx.fillStyle = "#8b5cf6" // Reset fill color for next point
    })

    // Add date labels (first, middle, last)
    ctx.fillStyle = "#94a3b8" // Tailwind slate-400
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    // First date
    const firstDate = new Date(sortedHistory[0].date)
    const firstX = padding
    ctx.fillText(firstDate.toLocaleDateString(), firstX, rect.height - padding + 15)

    // Middle date
    if (sortedHistory.length > 2) {
      const middleIndex = Math.floor(sortedHistory.length / 2)
      const middleDate = new Date(sortedHistory[middleIndex].date)
      const middleX = padding + ((new Date(middleDate).getTime() - minDate) / dateRange) * graphWidth
      ctx.fillText(middleDate.toLocaleDateString(), middleX, rect.height - padding + 15)
    }

    // Last date
    const lastDate = new Date(sortedHistory[sortedHistory.length - 1].date)
    const lastX = rect.width - padding
    ctx.fillText(lastDate.toLocaleDateString(), lastX, rect.height - padding + 15)
  }, [progressHistory])

  return (
    <div className="w-full h-[200px] md:h-[250px]">
      {progressHistory.length > 0 ? (
        <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No progress data available yet</p>
        </div>
      )}
    </div>
  )
}
