"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  showViewAll?: boolean
  onViewAllClick?: () => void
}

export function SectionHeader({ 
  title, 
  subtitle, 
  showViewAll = true, 
  onViewAllClick 
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {showViewAll && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAllClick}
          className="text-muted-foreground hover:text-foreground group"
        >
          Ver todo
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      )}
    </div>
  )
}
