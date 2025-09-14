import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/70 relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-muted-foreground/10 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
