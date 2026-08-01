/** Local calendar date as YYYY-MM-DD (matches HTML date inputs). */
export function localDateISO(d: Date = new Date()): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/** UTC midnight for a calendar date string. */
export function utcStartOfDate(isoDate: string): Date {
    return new Date(`${isoDate}T00:00:00.000Z`);
}

/** Add calendar days to a UTC date. */
function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
}

export type DateRange = {
    startDate: Date;
    endDate: Date;
};

export function getTimeRangeBounds(
    timeRange: string,
    now: Date = new Date(),
): DateRange {
    const today = utcStartOfDate(localDateISO(now));

    switch (timeRange) {
        case 'today':
            return {
                startDate: today,
                endDate: addDays(today, 1),
            };

        case '7days': {
            const start = utcStartOfDate(
                localDateISO(
                    new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate() - 6,
                    ),
                ),
            );

            return {
                startDate: start,
                endDate: addDays(today, 1),
            };
        }

        case 'thismonth': {
            const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
            const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));

            return {
                startDate: start,
                endDate: end,
            };
        }

        case 'thisyear':
            return {
                startDate: new Date(Date.UTC(now.getFullYear(), 0, 1)),
                endDate: new Date(Date.UTC(now.getFullYear() + 1, 0, 1)),
            };

        default:
            return {
                startDate: new Date(0),
                endDate: new Date(),
            };
    }
}