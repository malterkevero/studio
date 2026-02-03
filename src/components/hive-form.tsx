"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import { hiveSchema } from "@/lib/schema"
import { QueenColors, type Hive } from "@/lib/types"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "@/components/date-picker"

type HiveFormValues = z.infer<typeof hiveSchema>;

type HiveFormProps = {
  onSubmit: (data: HiveFormValues) => void;
  onCancel: () => void;
  initialData?: Hive | null;
}

const currentYear = new Date().getFullYear();

export default function HiveForm({ onSubmit, onCancel, initialData }: HiveFormProps) {
  const form = useForm<HiveFormValues>({
    resolver: zodResolver(hiveSchema),
    defaultValues: initialData 
      ? { ...initialData, lastIntervention: { ...initialData.lastIntervention, date: new Date(initialData.lastIntervention.date) } }
      : {
      name: "",
      queen: {
        year: currentYear,
        color: QueenColors.find(c => (currentYear % 5) === (QueenColors.indexOf(c) + 1)) || "fehér",
        type: "",
      },
      strength: 3,
      health: {
        miteLevel: "",
        diseases: "",
      },
      food: {
        honey: 10,
        pollen: 2,
      },
      lastIntervention: {
        date: new Date(),
        type: "",
      },
      notes: "",
    },
  });
  
  const strength = form.watch("strength");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-1 mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kaptár azonosító</FormLabel>
              <FormControl>
                <Input placeholder="Pl. 01-es kaptár" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Méhanya adatai</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="queen.year"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Évjárat</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="queen.color"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Szín</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Válassz színt" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {QueenColors.map(color => (
                            <SelectItem key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="queen.type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Típus</FormLabel>
                    <FormControl>
                        <Input placeholder="Pl. Buckfast, Krajnai" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>

        <FormField
          control={form.control}
          name="strength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Család erőssége: {strength} / 5</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="space-y-4 p-4 border rounded-lg">
             <h3 className="font-medium">Egészségügyi állapot</h3>
            <FormField
            control={form.control}
            name="health.miteLevel"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Atkaszint</FormLabel>
                <FormControl>
                    <Input placeholder="Pl. 1 atka / 100 méh" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="health.diseases"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Betegségek, tünetek</FormLabel>
                <FormControl>
                    <Textarea placeholder="Pl. Fiasítás meszesedés jelei láthatók..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
             <h3 className="font-medium">Élelemkészlet</h3>
             <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="food.honey"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Méz (kg)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="food.pollen"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Virágpor (kg)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>

         <div className="space-y-4 p-4 border rounded-lg">
             <h3 className="font-medium">Utolsó beavatkozás</h3>
            <FormField
                control={form.control}
                name="lastIntervention.date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Dátum</FormLabel>
                    <DatePicker date={field.value} setDate={field.onChange} />
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="lastIntervention.type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Típus</FormLabel>
                    <FormControl>
                        <Input placeholder="Pl. Bővítés, pergetés, etetés" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Megjegyzések</FormLabel>
              <FormDescription>Jegyzetek a következő látogatáshoz.</FormDescription>
              <FormControl>
                <Textarea placeholder="Pl. Következő héten anyarács behelyezése esedékes." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Mégse
          </Button>
          <Button type="submit">{initialData ? "Mentés" : "Hozzáadás"}</Button>
        </div>
      </form>
    </Form>
  )
}
