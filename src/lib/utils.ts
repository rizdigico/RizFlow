import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeInput(value: string, maxLength = 500): string {
  return value.trim().slice(0, maxLength).replace(/<[^>]*>/g, '')
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
