"use client"

import type { Hive } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Crown, ShieldCheck, Hexagon, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"

type HiveCardProps = {
  hive: Hive
  onEdit: () => void
  onDelete: () => void
}

const queenColorMap: Record<string, string> = {
  fehér: "bg-gray-200 text-gray-800",
  sárga: "bg-yellow-400 text-yellow-900",
  piros: "bg-red-500 text-white",
  zöld: "bg-green-500 text-white",
  kék: "bg-blue-500 text-white",
};


export default function HiveCard({ hive, onEdit, onDelete }: HiveCardProps) {
  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl">{hive.name}</CardTitle>
            <Badge variant="secondary" className="font-mono">ID: {hive.id.substring(0,6)}</Badge>
        </div>
        <CardDescription>Utolsó beavatkozás: {hive.lastIntervention.type || 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-primary" />
          <div className="flex items-center gap-2">
            <span>Anya: {hive.queen.year}</span>
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", queenColorMap[hive.queen.color])}>
              {hive.queen.color}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span>Erősség: {hive.strength}/5</span>
        </div>
        <div className="flex items-center gap-3">
            <Hexagon className="w-5 h-5 text-yellow-600" />
            <span>Élelem: {hive.food.honey ?? 0}kg méz, {hive.food.pollen ?? 0}kg virágpor</span>
        </div>
         <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-muted-foreground" />
            <span>Dátum: {format(new Date(hive.lastIntervention.date), "yyyy. MM. dd.", { locale: hu })}</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-4 border-t border-border/50">
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Szerkesztés
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Törlés
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Biztosan törölni szeretnéd?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ez a művelet nem vonható vissza. A kaptár ({hive.name}) minden adata véglegesen törlődik.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Mégse</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Igen, törlés
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  )
}
function cn(arg0: string, arg1: string | undefined): string | undefined {
    return [arg0, arg1].filter(Boolean).join(' ');
}
