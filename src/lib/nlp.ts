import * as chrono from 'chrono-node';

export interface ParsedDate {
    date: Date;
    text: string;
    index: number;
}

export const parseDateFromText = (text: string): ParsedDate | null => {
    const results = chrono.parse(text);

    if (results.length === 0) return null;

    // Use the first result
    const result = results[0];
    const date = result.start.date();

    return {
        date,
        text: result.text,
        index: result.index,
    };
};

export const removeDateFromText = (text: string, matchText: string): string => {
    return text.replace(matchText, '').trim();
};
