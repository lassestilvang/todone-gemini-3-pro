import { addDays, addWeeks, addMonths, addYears, parseISO, format } from 'date-fns';

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays';

export const calculateNextDueDate = (currentDate: string, pattern: string): string => {
    const date = parseISO(currentDate);

    switch (pattern) {
        case 'daily': {
            return format(addDays(date, 1), 'yyyy-MM-dd');
        }
        case 'weekdays': {
            const nextDay = addDays(date, 1);
            const day = nextDay.getDay();
            if (day === 0) return format(addDays(nextDay, 1), 'yyyy-MM-dd'); // Sunday -> Monday
            if (day === 6) return format(addDays(nextDay, 2), 'yyyy-MM-dd'); // Saturday -> Monday
            return format(nextDay, 'yyyy-MM-dd');
        }
        case 'weekly': {
            return format(addWeeks(date, 1), 'yyyy-MM-dd');
        }
        case 'monthly': {
            return format(addMonths(date, 1), 'yyyy-MM-dd');
        }
        case 'yearly': {
            return format(addYears(date, 1), 'yyyy-MM-dd');
        }
        default: {
            return currentDate;
        }
    }
};

export const humanizeRecurrence = (pattern: string): string => {
    switch (pattern) {
        case 'daily': return 'Every day';
        case 'weekdays': return 'Every weekday';
        case 'weekly': return 'Every week';
        case 'monthly': return 'Every month';
        case 'yearly': return 'Every year';
        default: return pattern;
    }
};
