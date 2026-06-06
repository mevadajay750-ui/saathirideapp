import { format, isToday, isTomorrow, parseISO } from 'date-fns';

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function formatDepartureDate(isoString: string): string {
  const date = parseISO(isoString);
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
  return format(date, 'dd MMM, h:mm a');
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatSeats(available: number, total: number): string {
  return `${available} of ${total} seats left`;
}
