import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Hive } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const flattenObject = (obj: any, prefix = ''): Record<string, any> =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (k === 'id') {
      // Keep top-level id as is
      acc[k] = obj[k];
    } else if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k]) && !(obj[k] instanceof Date)) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as Record<string, any>);


export function exportHivesToCsv(hives: Hive[]) {
  if (!hives || hives.length === 0) {
    throw new Error("No data to export.");
  }

  const flattenedHives = hives.map(hive => flattenObject(hive));
  const headers = Object.keys(flattenedHives[0]);

  const csvRows = [
    headers.join(','),
    ...flattenedHives.map(row => 
      headers.map(header => {
        let cell = row[header];
        if (cell === null || cell === undefined) {
          return '';
        }
        if (cell instanceof Date) {
          return `"${cell.toISOString()}"`;
        }
        let cellString = String(cell);
        if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
          cellString = `"${cellString.replace(/"/g, '""')}"`;
        }
        return cellString;
      }).join(',')
    )
  ];
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kaptar_naplo_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
