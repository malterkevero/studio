"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import { reminderSchema } from "@/lib/schema"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"

type ReminderFormValues = z.infer<typeof reminderSchema>;

type ReminderFormProps = {
  onSubmit: (data: ReminderFormValues) => void;
  onCancel: () => void;
}

export default function ReminderForm({ onSubmit, onCancel }: ReminderFormProps) {
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      text: "",
      dueDate: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-1 mt-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emlékeztető szövege</FormLabel>
              <FormControl>
                <Textarea placeholder="Pl. Atka elleni védekezés..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Határidő</FormLabel>
                <DatePicker date={field.value} setDate={field.onChange} />
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Mégse
          </Button>
          <Button type="submit">Hozzáadás</Button>
        </div>
      </form>
    </Form>
  )
}
