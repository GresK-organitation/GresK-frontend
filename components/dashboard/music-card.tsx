"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MusicCardProps {
  title: string
  artist: string
  coverUrl: string
}

export function MusicCard({ title, artist, coverUrl }: MusicCardProps) {
  return (
    <Card className="group cursor-pointer border-0 bg-transparent transition-all">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={coverUrl}
            alt={`${title} by ${artist}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/0 transition-colors group-hover:bg-background/40">
            <div className="flex h-12 w-12 scale-0 items-center justify-center rounded-full bg-gold text-gold-foreground transition-transform group-hover:scale-100">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h4 className="text-sm font-semibold text-foreground line-clamp-1">{title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-1">{artist}</p>
        </div>
      </CardContent>
    </Card>
  )
}
