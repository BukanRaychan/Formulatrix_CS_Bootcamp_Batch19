import * as React from "react"
import { cn } from "@/lib/utils"

type FormProps = React.FormHTMLAttributes<HTMLFormElement>

type FormItemProps = React.HTMLAttributes<HTMLDivElement>

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

type FormControlProps = React.HTMLAttributes<HTMLDivElement>

type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>

export function Form({ className, ...props }: FormProps) {
  return <form className={cn("space-y-4", className)} {...props} />
}

export function FormItem({ className, ...props }: FormItemProps) {
  return <div className={cn("grid gap-2", className)} {...props} />
}

export function FormLabel({ className, ...props }: FormLabelProps) {
  return <label className={cn("text-sm font-medium text-foreground", className)} {...props} />
}

export function FormControl({ className, ...props }: FormControlProps) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />
}

export function FormMessage({ className, ...props }: FormMessageProps) {
  return <p className={cn("text-sm text-destructive/90", className)} {...props} />
}
