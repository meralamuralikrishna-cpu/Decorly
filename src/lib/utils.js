import { clsx } from 'clsx';
export function cn(...inputs) {
    return clsx(inputs);
}
export function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
export function formatDate(iso, locale = 'en-IN') {
    return new Date(iso).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
