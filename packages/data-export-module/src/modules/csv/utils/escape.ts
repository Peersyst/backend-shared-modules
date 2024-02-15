export function escapeString(value: string): string {
    return value.replace(/\"/g, '""');
}
