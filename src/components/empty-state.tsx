"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Plus } from "lucide-react"

type EmptyStateProps = {
    onAdd: () => void;
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
    const placeholder = PlaceHolderImages.find(p => p.id === "empty-hive");

    return (
        <div className="text-center flex flex-col items-center justify-center py-16 px-4">
             {placeholder && (
                <Image
                    src={placeholder.imageUrl}
                    alt={placeholder.description}
                    width={250}
                    height={167}
                    data-ai-hint={placeholder.imageHint}
                    className="mb-6 rounded-lg opacity-70"
                />
             )}
            <h2 className="text-2xl font-bold text-foreground mb-2">Még nincsenek kaptárak</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
                Kezdd el a méhészeted digitális nyilvántartását! Adj hozzá egy új kaptárat a kezdéshez.
            </p>
            <Button onClick={onAdd} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Első kaptár hozzáadása
            </Button>
        </div>
    )
}
