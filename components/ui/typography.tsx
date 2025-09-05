import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva(
  "text-foreground",
  {
    variants: {
      variant: {
        // Display text - largest headings
        "display-2xl": "text-6xl font-bold tracking-tight lg:text-7xl",
        "display-xl": "text-5xl font-bold tracking-tight lg:text-6xl",
        "display-lg": "text-4xl font-bold tracking-tight lg:text-5xl",
        
        // Headings
        h1: "text-4xl font-semibold tracking-tight lg:text-5xl",
        h2: "text-3xl font-semibold tracking-tight lg:text-4xl",
        h3: "text-2xl font-semibold tracking-tight",
        h4: "text-xl font-semibold tracking-tight",
        h5: "text-lg font-semibold",
        h6: "text-base font-semibold",
        
        // Body text
        "body-lg": "text-lg leading-relaxed",
        "body-default": "text-base leading-normal",
        "body-sm": "text-sm leading-normal",
        
        // Special text
        lead: "text-xl text-muted-foreground leading-relaxed",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-sm text-muted-foreground",
        
        // Inline elements
        code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        kbd: "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
      }
    },
    defaultVariants: {
      variant: "body-default"
    }
  }
)

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    // Map variants to semantic HTML elements
    const getDefaultElement = (variant: string) => {
      if (variant?.startsWith('h')) return variant
      if (variant?.startsWith('display')) return 'h1'
      if (variant === 'lead') return 'p'
      if (variant === 'code') return 'code'
      if (variant === 'kbd') return 'kbd'
      return 'p'
    }

    const Component = as || getDefaultElement(variant || 'body-default')

    return React.createElement(
      Component,
      {
        className: cn(typographyVariants({ variant, className })),
        ref,
        ...props
      }
    )
  }
)
Typography.displayName = "Typography"

// Convenience components for common use cases
const Heading = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant"> & { level: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ level, ...props }, ref) => (
    <Typography
      ref={ref}
      as={`h${level}`}
      variant={`h${level}` as any}
      {...props}
    />
  )
)
Heading.displayName = "Heading"

const Text = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, "as">>(
  ({ ...props }, ref) => (
    <Typography ref={ref} as="p" {...props} />
  )
)
Text.displayName = "Text"

export { Typography, Heading, Text }