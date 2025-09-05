import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
  {
    variants: {
      variant: {
        default: "",
        ghost: "border-transparent bg-transparent hover:bg-muted/50 focus-visible:bg-background focus-visible:border-input",
        filled: "bg-muted border-transparent focus-visible:bg-background focus-visible:border-input"
      },
      size: {
        sm: "h-9 px-2 py-1 text-xs",
        default: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base"
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-primary focus-visible:ring-primary"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default"
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, state, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, state, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Input with label wrapper
interface InputGroupProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ label, error, hint, required, className, children }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {(error || hint) && (
        <p className={cn(
          "text-xs",
          error ? "text-destructive" : "text-muted-foreground"
        )}>
          {error || hint}
        </p>
      )}
    </div>
  )
)
InputGroup.displayName = "InputGroup"

export { Input, InputGroup }