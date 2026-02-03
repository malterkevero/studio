"use client"

import { Button } from "@/components/ui/button"
import { BellRing, Plus } from "lucide-react"

type EmptyRemindersProps = {
    onAdd: () => void;
}

export default function EmptyReminders({ onAdd }: EmptyRemindersProps) {
    return (
        <div className="text-center flex flex-col items-center justify-center py-16 px-4">
            <BellRing className="w-16 h-16 text-muted-foreground opacity-50 mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Nincsenek emlékeztetők</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
                Állíts be emlékeztetőket a fontos teendőkhöz, hogy ne felejts el semmit.
            </p>
            <Button onClick={onAdd} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Első emlékeztető
            </Button>
        </div>
    )
}
