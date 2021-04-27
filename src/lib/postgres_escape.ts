export function postgresStringEscape(text: string): string {
    return text.replace("'", "''");
}
