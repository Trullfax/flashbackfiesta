// src/stores/toastStore.ts
import { writable } from 'svelte/store';

// Define a type for your toast
interface Toast {
  id?: number;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  timeout?: number;
}

export const toasts = writable<Toast[]>([]);

export const addToast = (toast: Toast) => {
  const id = Math.floor(Math.random() * 10000);

  const defaults: Toast = {
    id,
    type: 'info',
    dismissible: true,
    timeout: 3000,
    ...toast, // Add this to merge the incoming toast properties
  };

  toasts.update((all) => [defaults, ...all]);

  if (defaults.timeout) setTimeout(() => dismissToast(id), defaults.timeout);
};

export const dismissToast = (id: number) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
