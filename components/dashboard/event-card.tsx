"use client"

import Image from "next/image"
import { MapPin, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EventCardProps {
  title: string
  date: string
  venue: string
  imageUrl: string
}

export function EventCard({ title, date, venue, imageUrl }: EventCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden border-0 bg-card transition-all hover:bg-secondary">
      <CardContent className="p-0">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 text-gold mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-bold uppercase tracking-wide">{date}</span>
            </div>
            <h3 className="text-lg font-bold leading-tight text-foreground line-clamp-2 text-balance">
              {title}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">{venue}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
