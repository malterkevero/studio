"use client";

import * as React from 'react';
import { Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import type { Hive, Reminder } from '@/lib/types';
import { exportHivesToCsv } from '@/lib/utils';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import PageHeader from '@/components/page-header';
import HiveCard from '@/components/hive-card';
import HiveForm from '@/components/hive-form';
import EmptyState from '@/components/empty-state';
import RemindersList from '@/components/reminders-list';
import ReminderForm from '@/components/reminder-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EmptyReminders from '@/components/empty-reminders';
import HiveDetailsDialog from '@/components/hive-details-dialog';

const getUuid = () => (typeof uuidv4 === 'function' ? uuidv4() : Math.random().toString(36).substring(2, 15));

function PageContent() {
  const [hives, setHives] = useLocalStorage<Hive[]>('hives', []);
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);

  const [isHiveSheetOpen, setIsHiveSheetOpen] = React.useState(false);
  const [isReminderSheetOpen, setIsReminderSheetOpen] = React.useState(false);
  const { toast } = useToast();
  
  const [selectedHive, setSelectedHive] = React.useState<Hive | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);

  const [activeTab, setActiveTab] = React.useState('hives');
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const tab = searchParams.get('tab');
    const action = searchParams.get('action');

    if (tab || action) {
      if (tab === 'reminders') {
        setActiveTab('reminders');
      }
  
      if (action === 'add-reminder') {
        setActiveTab('reminders');
        setIsReminderSheetOpen(true);
      }
      router.replace('/', { shallow: true });
    }
  }, [searchParams, router, setActiveTab, setIsReminderSheetOpen]);


  // Hive Handlers
  const handleAddHive = () => {
    setIsHiveSheetOpen(true);
  };
  
  const handleCloseHiveSheet = () => {
    setIsHiveSheetOpen(false);
  }

  const handleDeleteHive = (id: string) => {
    setHives(hives.filter((hive) => hive.id !== id));
    toast({
      title: "Sikeres törlés!",
      description: "A kaptár adatai törölve lettek.",
    });
  };

  const handleSaveHive = (data: Omit<Hive, 'id'>) => {
    setHives([...hives, { ...data, id: getUuid() }]);
     toast({
      title: "Sikeres hozzáadás!",
      description: "Az új kaptár mentésre került.",
    });
    handleCloseHiveSheet();
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

  const handleViewHiveDetails = (hive: Hive) => {
    setSelectedHive(hive);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    // Add a delay to allow the dialog to animate out before clearing the data
    setTimeout(() => {
        setSelectedHive(null);
    }, 300);
  };


  // Reminder Handlers
  const handleAddReminder = () => {
    setIsReminderSheetOpen(true);
  };

  const handleCloseReminderSheet = () => {
    setIsReminderSheetOpen(false);
  };

  const handleSaveReminder = (data: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminder: Reminder = {
      ...data,
      id: getUuid(),
      completed: false,
    };
    setReminders([...reminders, newReminder]);
    toast({
      title: "Sikeres hozzáadás!",
      description: "Az új emlékeztető mentésre került.",
    });
    handleCloseReminderSheet();
  };
  
  const handleToggleReminder = (id: string) => {
    setReminders(
      reminders.map(r =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({
      title: "Emlékeztető törölve!",
    });
  };


  return (
    <div className="min-h-screen w-full">
      <PageHeader onAddHive={handleAddHive} onExport={handleExport} />
      <main className="p-4 sm:p-6 lg:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="hives">Kaptárak</TabsTrigger>
                <TabsTrigger value="reminders">Emlékeztetők</TabsTrigger>
            </TabsList>

            <TabsContent value="hives">
                {hives.length === 0 ? (
                <EmptyState onAdd={handleAddHive} />
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {hives.map((hive) => (
                    <HiveCard 
                        key={hive.id} 
                        hive={hive} 
                        onViewDetails={() => handleViewHiveDetails(hive)}
                        onDelete={() => handleDeleteHive(hive.id)} 
                    />
                    ))}
                </div>
                )}
            </TabsContent>
            
            <TabsContent value="reminders">
                 {reminders.length === 0 ? (
                    <EmptyReminders onAdd={handleAddReminder} />
                ) : (
                    <>
                        <div className="flex justify-end mb-4">
                            <Button onClick={handleAddReminder}>
                                <Plus className="mr-2 h-4 w-4" />
                                Új emlékeztető
                            </Button>
                        </div>
                        <RemindersList 
                            reminders={reminders}
                            onToggle={handleToggleReminder}
                            onDelete={handleDeleteReminder}
                        />
                    </>
                )}
            </TabsContent>
        </Tabs>
      </main>
      
      <Sheet open={isHiveSheetOpen} onOpenChange={setIsHiveSheetOpen}>
        <SheetContent className="sm:max-w-lg w-full overflow-y-auto">
           <SheetHeader>
            <SheetTitle>Új kaptár hozzáadása</SheetTitle>
          </SheetHeader>
          <HiveForm 
            onSubmit={handleSaveHive} 
            onCancel={handleCloseHiveSheet}
            initialData={null} 
          />
        </SheetContent>
      </Sheet>

      <Sheet open={isReminderSheetOpen} onOpenChange={setIsReminderSheetOpen}>
        <SheetContent 
            className="sm:max-w-lg w-full"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
        >
           <SheetHeader>
            <SheetTitle>Új emlékeztető</SheetTitle>
          </SheetHeader>
          <ReminderForm 
            onSubmit={handleSaveReminder} 
            onCancel={handleCloseReminderSheet}
          />
        </SheetContent>
      </Sheet>
      
      <HiveDetailsDialog 
        hive={selectedHive}
        open={isDetailsDialogOpen}
        onOpenChange={handleCloseDetailsDialog}
      />
    </div>
  );
}


export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center">
        <p>Adatok betöltése...</p>
      </div>
    }>
      <PageContent />
    </Suspense>
  )
}
