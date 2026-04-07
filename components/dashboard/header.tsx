"use client"

import { Search, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  userName: string
  userCity: string
  userAvatar?: string
}

export function Header({ userName, userCity, userAvatar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-foreground">
            GresK
          </span>
        </div>

        {/* Search */}
        <div className="hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar eventos, artistas..."
              className="w-full pl-10 bg-secondary border-0 placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {userCity}
            </p>
          </div>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-secondary text-foreground font-medium">
              {userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
