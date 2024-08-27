import { ClassValue } from 'class-variance-authority/types'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const accessTokenConfig = {
  set: (token: string) => {
    localStorage.setItem('accessToken', token)
  },
  get: () => {
    return localStorage.getItem('accessToken')
  },
  remove: () => {
    localStorage.removeItem('accessToken')
  },
}
