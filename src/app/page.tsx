"use client";

import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import type { Hive } from '@/lib/types';
import { exportHivesToCsv } from '@/lib/utils';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import PageHeader from '@/components/page-header';
import HiveCard from '@/components/hive-card';
import HiveForm from '@/components/hive-form';
import EmptyState from '@/components/empty-state';

// Since uuid is a CJS module, we need to handle its import.
// A simple way is to check if it's a function.
const getUuid = () => (typeof uuidv4 === 'function' ? uuidv4() : Math.random().toString(36).substring(2, 15));


export default function Home() {
  const [hives, setHives] = useLocalStorage<Hive[]>('hives', []);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingHive, setEditingHive] = React.useState<Hive | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingHive(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (hive: Hive) => {
    setEditingHive(hive);
    setIsSheetOpen(true);
  };
  
  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingHive(null);
  }

  const handleDelete = (id: string) => {
    setHives(hives.filter((hive) => hive.id !== id));
    toast({
      title: "Sikeres törlés!",
      description: "A kaptár adatai törölve lettek.",
    });
  };

  const handleSave = (data: Omit<Hive, 'id'>) => {
    if (editingHive) {
      setHives(hives.map((hive) => (hive.id === editingHive.id ? { ...data, id: editingHive.id } : hive)));
       toast({
        title: "Sikeres mentés!",
        description: "A kaptár adatai frissültek.",
      });
    } else {
      setHives([...hives, { ...data, id: getUuid() }]);
       toast({
        title: "Sikeres hozzáadás!",
        description: "Az új kaptár mentésre került.",
      });
    }
    handleCloseSheet();
  };

  const handleExport = () => {
    if (hives.length === 0) {
      toast({
        variant: "destructive",
        title: "Nincs adat!",
        description: "Nincsenek kaptárak az exportáláshoz.",
      });
      return;
    }
    try {
      exportHivesToCsv(hives);
      toast({
        title: "Exportálás sikeres",
        description: "A kaptáradatok CSV fájlba lettek mentve.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Exportálási hiba",
        description: "Hiba történt az adatok exportálása közben.",
      });
    }
  };


  return (
    <div className="min-h-screen w-full">
      <PageHeader onAdd={handleAdd} onExport={handleExport} />
      <main className="p-4 sm:p-6 lg:p-8">
        {hives.length === 0 ? (
          <EmptyState onAdd={handleAdd} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hives.map((hive) => (
              <HiveCard key={hive.id} hive={hive} onEdit={() => handleEdit(hive)} onDelete={() => handleDelete(hive.id)} />
            ))}
          </div>
        )}
      </main>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-full overflow-y-auto" onInteractOutside={handleCloseSheet}>
           <SheetHeader>
            <SheetTitle>{editingHive ? 'Kaptár szerkesztése' : 'Új kaptár hozzáadása'}</SheetTitle>
          </SheetHeader>
          <HiveForm 
            onSubmit={handleSave} 
            onCancel={handleCloseSheet}
            initialData={editingHive} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
