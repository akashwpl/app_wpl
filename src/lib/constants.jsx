export const BASE_URL = "http://139.59.58.53:3000"

export const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function getTimestampFromNow(input) {
    const [number, unit] = input.split(' '); // Split the input into number and unit
    const duration = parseInt(number, 10); // Convert the number to an integer
    const now = new Date(); // Get the current date

    switch (unit.toLowerCase()) {
        case 'day':
        case 'days':
            now.setDate(now.getDate() + duration);
            break;
        case 'week':
        case 'weeks':
            now.setDate(now.getDate() + duration * 7); // 7 days in a week
            break;
        case 'month':
        case 'months':
            now.setMonth(now.getMonth() + duration);
            break;
        default:
            throw new Error('Invalid time unit. Please use "day", "week", or "month".');
    }

    return now.getTime(); // Return the timestamp in milliseconds
}