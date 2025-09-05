import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const stackVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        column: "flex-col",
        "row-reverse": "flex-row-reverse",
        "column-reverse": "flex-col-reverse"
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline"
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly"
      },
      gap: {
        none: "gap-0",
        xs: "gap-1",
        sm: "gap-2", 
        default: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12"
      },
      wrap: {
        nowrap: "flex-nowrap",
        wrap: "flex-wrap",
        "wrap-reverse": "flex-wrap-reverse"
      }
    },
    defaultVariants: {
      direction: "column",
      align: "stretch",
      justify: "start",
      gap: "default",
      wrap: "nowrap"
    }
  }
)

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, align, justify, gap, wrap, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stackVariants({ direction, align, justify, gap, wrap, className }))}
      {...props}
    />
  )
)
Stack.displayName = "Stack"

// Convenience components
const HStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  ({ ...props }, ref) => (
    <Stack ref={ref} direction="row" {...props} />
  )
)
HStack.displayName = "HStack"

const VStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  ({ ...props }, ref) => (
    <Stack ref={ref} direction="column" {...props} />
  )
)
VStack.displayName = "VStack"

export { Stack, HStack, VStack }