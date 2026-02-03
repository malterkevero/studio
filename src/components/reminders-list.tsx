"use client";

import * as React from 'react';
import type { Reminder } from '@/lib/types';
import ReminderItem from './reminder-item';

type RemindersListProps = {
  reminders: Reminder[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function RemindersList({ reminders, onToggle, onDelete }: RemindersListProps) {
  const sortedReminders = [...reminders].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const upcomingReminders = sortedReminders.filter(r => !r.completed);
  const completedReminders = sortedReminders.filter(r => r.completed);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Aktuális emlékeztetők</h3>
        {upcomingReminders.length > 0 ? (
          <div className="space-y-3">
            {upcomingReminders.map(reminder => (
              <ReminderItem key={reminder.id} reminder={reminder} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nincsenek aktuális emlékeztetők.</p>
        )}
      </div>

      {completedReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Teljesített emlékeztetők</h3>
          <div className="space-y-3">
            {completedReminders.map(reminder => (
              <ReminderItem key={reminder.id} reminder={reminder} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
