"use client"

import { Music2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  onConfigureClick?: () => void
}

export function EmptyState({ onConfigureClick }: EmptyStateProps) {
  return (
    <Card className="border border-dashed border-border bg-transparent">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <Music2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-bold text-foreground">
          Personaliza tu experiencia
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Cuéntanos qué géneros te gustan para mostrarte eventos y música que te encantarán
        </p>
        <Button 
          onClick={onConfigureClick}
          className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90 font-semibold"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Configura tus gustos
        </Button>
      </CardContent>
    </Card>
  )
}
