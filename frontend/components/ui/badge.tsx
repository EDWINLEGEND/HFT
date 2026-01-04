import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-[#00A9A0] text-white border-transparent shadow-sm hover:bg-[#008780]",
                secondary:
                    "bg-gray-100 text-gray-900 border-transparent hover:bg-gray-200",
                destructive:
                    "bg-red-50 text-red-800 border border-red-200 hover:bg-red-100",
                outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                success: "bg-green-50 text-green-800 border border-green-200",
                warning: "bg-amber-50 text-amber-800 border border-amber-200",
                info: "bg-blue-50 text-blue-800 border border-blue-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
