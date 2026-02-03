"use client";

import { Button } from "@/components/ui/button"
import { Hexagon, Plus, Download } from "lucide-react"

type PageHeaderProps = {
    onAdd: () => void;
    onExport: () => void;
}

export default function PageHeader({ onAdd, onExport }: PageHeaderProps) {
    return (
        <header className="bg-card border-b border-border/80 p-4 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Hexagon className="w-8 h-8 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold font-headline text-foreground">
                        Kaptár Napló
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onExport} className="hidden sm:inline-flex">
                        <Download className="mr-2 h-4 w-4"/>
                        Export CSV
                    </Button>
                    <Button size="sm" onClick={onAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Új Kaptár
                    </Button>
                     <Button variant="outline" size="icon" onClick={onExport} className="sm:hidden">
                        <Download className="h-4 w-4"/>
                        <span className="sr-only">Export CSV</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
