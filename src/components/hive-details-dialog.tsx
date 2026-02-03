"use client";

import type { Hive } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Crown, ShieldCheck, Hexagon, CalendarDays, ClipboardList, Info } from "lucide-react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { cn } from "@/lib/utils"

type HiveDetailsDialogProps = {
  hive: Hive | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const queenColorMap: Record<string, string> = {
  fehér: "bg-gray-200 text-gray-800",
  sárga: "bg-yellow-400 text-yellow-900",
  piros: "bg-red-500 text-white",
  zöld: "bg-green-500 text-white",
  kék: "bg-blue-500 text-white",
};

export default function HiveDetailsDialog({ hive, open, onOpenChange }: HiveDetailsDialogProps) {
  if (!hive) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-start">
              <DialogTitle className="font-headline text-2xl">{hive.name}</DialogTitle>
              <Badge variant="secondary" className="font-mono mt-1">ID: {hive.id.substring(0,6)}</Badge>
          </div>
          <DialogDescription>
            Részletes kaptár adatok
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <Crown className="w-5 h-5 text-primary mt-1" />
                <div>
                    <h4 className="font-semibold">Méhanya</h4>
                    <p>Évjárat: {hive.queen.year}</p>
                    <div className="flex items-center gap-2">
                        <p>Szín:</p>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", queenColorMap[hive.queen.color])}>
                            {hive.queen.color}
                        </span>
                    </div>
                    {hive.queen.type && <p>Típus: {hive.queen.type}</p>}
                </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <ShieldCheck className="w-5 h-5 text-green-600 mt-1" />
                <div>
                    <h4 className="font-semibold">Általános állapot</h4>
                    <p>Család erőssége: {hive.strength}/5</p>
                    {hive.health.miteLevel && <p>Atkaszint: {hive.health.miteLevel}</p>}
                    {hive.health.diseases && <p>Betegségek: {hive.health.diseases}</p>}
                </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <Hexagon className="w-5 h-5 text-yellow-600 mt-1" />
                <div>
                    <h4 className="font-semibold">Élelemkészlet</h4>
                    <p>Méz: {hive.food.honey ?? 0} kg</p>
                    <p>Virágpor: {hive.food.pollen ?? 0} kg</p>
                </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <ClipboardList className="w-5 h-5 text-blue-600 mt-1" />
                 <div>
                    <h4 className="font-semibold">Utolsó beavatkozás</h4>
                    <div className="flex items-center gap-2">
                       <CalendarDays className="w-4 h-4 text-muted-foreground" />
                       <span>{format(new Date(hive.lastIntervention.date), "yyyy. MM. dd.", { locale: hu })}</span>
                    </div>
                    {hive.lastIntervention.type && <p>Típus: {hive.lastIntervention.type}</p>}
                </div>
            </div>

             {hive.notes && (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <Info className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                        <h4 className="font-semibold">Megjegyzések</h4>
                        <p className="whitespace-pre-wrap">{hive.notes}</p>
                    </div>
                </div>
             )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
