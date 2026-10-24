/** Public order code from the row id: 42 → "APO-0042". Grows past 4 digits naturally. */
export function orderCode(id: number): string {
	return `APO-${id.toString().padStart(4, '0')}`;
}

/** Unguessable token for the order tracking link. */
export function orderToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(16));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
