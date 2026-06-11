import * as React from "react"
import { cn } from "@/lib/utils"

type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-sm shadow-black/5 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  )
}
