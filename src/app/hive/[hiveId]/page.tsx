"use client";

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import type { Hive } from '@/lib/types';
import HiveForm from '@/components/hive-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Hexagon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HivePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const hiveId = params.hiveId as string;

  const [hives, setHives] = useLocalStorage<Hive[]>('hives', []);
  const [editingHive, setEditingHive] = React.useState<Hive | null>(null);
  
  React.useEffect(() => {
      const foundHive = hives.find((h) => h.id === hiveId);
      if (foundHive) {
          setEditingHive(foundHive);
      }
  }, [hives, hiveId]);


  const handleSave = (data: Omit<Hive, 'id'>) => {
    if (editingHive) {
      setHives(hives.map((hive) => (hive.id === editingHive.id ? { ...data, id: editingHive.id } : hive)));
       toast({
        title: "Sikeres mentés!",
        description: "A kaptár adatai frissültek.",
      });
      router.push('/');
    }
  };
  
  const handleCancel = () => {
    router.push('/');
  }
  
  // Wait until local storage is loaded
  if (hives.length > 0 && !editingHive) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Kaptár nem található</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>A keresett kaptár nem létezik vagy törölve lett.</p>
                    <Button asChild className="mt-4">
                        <Link href="/">Vissza a főoldalra</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!editingHive) {
      return (
           <div className="min-h-screen w-full flex items-center justify-center">
               <p>Adatok betöltése...</p>
           </div>
      )
  }

  return (
    <div className="min-h-screen w-full">
        <header className="bg-card border-b border-border/80 p-4 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                     <Button variant="outline" size="icon" asChild>
                        <Link href="/">
                            <ArrowLeft />
                            <span className="sr-only">Vissza</span>
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <Hexagon className="w-8 h-8 text-primary" />
                        <h1 className="text-xl md:text-2xl font-bold font-headline text-foreground">
                           Kaptár szerkesztése
                        </h1>
                    </div>
                </div>
            </div>
        </header>
       <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <HiveForm 
            onSubmit={handleSave} 
            onCancel={handleCancel}
            initialData={editingHive} 
          />
       </main>
    </div>
  );
}
