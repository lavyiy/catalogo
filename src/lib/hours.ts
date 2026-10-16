/**
 * Calcula si una tienda está abierta o cerrada según sus hours y la hora actual
 * en la zona horaria de Argentina (America/Argentina/Buenos_Aires).
 */

import { env } from '../config/env';

const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires';

// Mapeo de días ingleses a índices (0=lunes, 6=domingo)
const DAY_INDEX: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

/**
 * Parsea una cadena de hours tipo "HH:MM-HH:MM" o "closed"
 */
export const parseHoursRange = (range: string): {
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  isClosed: boolean;
} => {
  if (range.toLowerCase() === 'closed' || range.toLowerCase() === 'closed all day') {
    return { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 }, isClosed: true };
  }

  const [start, end] = range.split('-');
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  return {
    start: { hour: startHour, minute: startMinute },
    end: { hour: endHour, minute: endMinute },
    isClosed: false,
  };
};

/**
 * Obtiene el día actual en formato clave (lunes, martes, etc.)
 */
export const getCurrentDayKey = (): keyof typeof DAY_INDEX => {
  const now = new Date();
  const utc = now.getUTCDate();
  const argentina = new Date(now.toLocaleString('en-US', { timeZone: ARGENTINA_TZ }));
  const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  return dayNames[ argentina.getDay() - 1 ] as keyof typeof DAY_INDEX;
};

/**
 * Verifica si la tienda está abierta en este momento
 */
export const isStoreOpen = (hours: Store['hours']): boolean => {
  const currentDay = getCurrentDayKey();
  const dayRange = hours[currentDay];

  if (!dayRange) return false;

  const parsed = parseHoursRange(dayRange);

  if (parsed.isClosed) return false;

  const now = new Date();
  const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: ARGENTINA_TZ }));

  const currentMinutes =
    argentinaTime.getHours() * 60 + argentinaTime.getMinutes();

  const startMinutes =
    parsed.start.hour * 60 + parsed.start.minute;
  const endMinutes =
    parsed.end.hour * 60 + parsed.end.minute;

  // Caso normal: el rango está dentro del mismo día
  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  // Caso de madrugada (ej: 22:00-06:00)
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
};

/**
 * Obtiene el mensaje de estado de la tienda
 */
export const getStoreStatusMessage = (hours: Store['hours']): {
  isOpen: boolean;
  message: string;
  nextOpen?: string;
} => {
  const currentDay = getCurrentDayKey();
  const dayRange = hours[currentDay];

  if (!dayRange) {
    return {
      isOpen: false,
      message: 'Horario no disponible',
    };
  }

  const parsed = parseHoursRange(dayRange);

  if (parsed.isClosed) {
    // Calcular cuando abre mañana
    const now = new Date();
    const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: ARGENTINA_TZ }));
    const nextDay = ( argentinaTime.getDay() % 7) + 1;
    const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const nextDayName = dayNames[nextDay - 1];

    return {
      isOpen: false,
      message: `Cierra hoy, abre ${nextDayName} a las ${parsed.start.hour.toString().padStart(2, '0')}:${parsed.start.minute.toString().padStart(2, '0')}`,
    };
  }

  const now = new Date();
  const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: ARGENTINA_TZ }));
  const currentMinutes =
    argentinaTime.getHours() * 60 + argentinaTime.getMinutes();

  const startMinutes =
    parsed.start.hour * 60 + parsed.start.minute;
  const endMinutes =
    parsed.end.hour * 60 + parsed.end.minute;

  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    return {
      isOpen: true,
      message: 'Abierto',
    };
  }

  // Próximo apertura hoy
  let nextOpen: string;
  if (currentMinutes < startMinutes) {
    nextOpen = `Abre hoy a las ${parsed.start.hour.toString().padStart(2, '0')}:${parsed.start.minute.toString().padStart(2, '0')}`;
  } else {
    // Hoy ya pasó la hora, mañana
    const nextDayIdx = ( argentinaTime.getDay() % 7) + 1;
    const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const nextDayName = dayNames[nextDayIdx - 1];
    nextOpen = `Abre ${nextDayName} a las ${parsed.start.hour.toString().padStart(2, '0')}:${parsed.start.minute.toString().padStart(2, '0')}`;
  }

  return {
    isOpen: false,
    message: 'Cerrado',
    nextOpen,
  };
};