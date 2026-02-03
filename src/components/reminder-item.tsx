"use client";

import type { Reminder } from '@/lib/types';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Calendar } from 'lucide-react';
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

type ReminderItemProps = {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ReminderItem({ reminder, onToggle, onDelete }: ReminderItemProps) {
  const isOverdue = !reminder.completed && new Date(reminder.dueDate) < new Date();

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-lg border",
      reminder.completed ? "bg-muted/50" : "bg-card"
    )}>
      <Checkbox
        id={`reminder-${reminder.id}`}
        checked={reminder.completed}
        onCheckedChange={() => onToggle(reminder.id)}
        aria-label="Mark reminder as complete"
      />
      <div className="flex-grow">
        <p className={cn("font-medium", reminder.completed && "line-through text-muted-foreground")}>
          {reminder.text}
        </p>
        <div className={cn(
          "text-sm flex items-center gap-2 mt-1",
          reminder.completed ? "text-muted-foreground" :
          isOverdue ? "text-destructive" : "text-muted-foreground"
        )}>
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(reminder.dueDate), "yyyy. MMMM dd.", { locale: hu })}</span>
           {isOverdue && <span className="font-semibold">(LEJÁRT)</span>}
        </div>
      </div>
       <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" className="shrink-0 h-9 w-9">
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Emlékeztető törlése</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztosan törölni szeretnéd?</AlertDialogTitle>
            <AlertDialogDescription>
              Ez a művelet nem vonható vissza. Az emlékeztető véglegesen törlődik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégse</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(reminder.id)}>
              Igen, törlés
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
