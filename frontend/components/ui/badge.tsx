import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Original variants enhanced
        default:
          "border-transparent bg-primary/90 text-primary-foreground shadow-sm hover:bg-primary hover:shadow-md",
        secondary:
          "border-transparent bg-secondary/90 text-secondary-foreground hover:bg-secondary shadow-sm hover:shadow-md",
        destructive:
          "border-transparent bg-destructive/90 text-destructive-foreground shadow-sm hover:bg-destructive hover:shadow-md",
        outline: 
          "border-border hover:bg-accent hover:text-accent-foreground",

        // New variants
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 shadow-sm hover:bg-green-200 dark:hover:bg-green-900/50 hover:shadow-md",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 hover:shadow-md",
        info:
          "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:shadow-md",
        premium:
          "border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm hover:shadow-md hover:scale-105",
        
        // Status variants
        active:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 shadow-sm hover:bg-green-200 dark:hover:bg-green-900/50 hover:shadow-md",
        pending:
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 hover:shadow-md",
        inactive:
          "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md",
        error:
          "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 shadow-sm hover:bg-red-200 dark:hover:bg-red-900/50 hover:shadow-md",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.25 text-[10px]",
        lg: "px-3 py-0.75 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }