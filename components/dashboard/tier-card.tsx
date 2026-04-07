"use client"

import { Crown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TierCardProps {
  tier: string
  currentPoints: number
  nextTierPoints: number
}

export function TierCard({ tier, currentPoints, nextTierPoints }: TierCardProps) {
  const progress = (currentPoints / nextTierPoints) * 100
  const pointsRemaining = nextTierPoints - currentPoints

  return (
    <Card className="border-0 bg-gradient-to-br from-secondary to-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Tu nivel
            </p>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-gold" />
              <span className="text-2xl font-black tracking-tight text-foreground">
                {tier}
              </span>
            </div>
          </div>
          <div className="rounded-full bg-gold/10 px-3 py-1">
            <span className="text-xs font-bold text-gold">
              {currentPoints} pts
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium text-foreground">
              {currentPoints} / {nextTierPoints}
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-2 bg-muted [&>div]:bg-gold"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Te faltan <span className="font-semibold text-gold">{pointsRemaining} pts</span> para el siguiente nivel
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
