// Paraguayan RUC: base number + check digit (módulo 11, SET algorithm), e.g. "1234567-9".

export function rucCheckDigit(base: string): number {
	let total = 0;
	let k = 2;
	for (let i = base.length - 1; i >= 0; i--) {
		total += Number(base[i]) * k;
		k = k === 11 ? 2 : k + 1;
	}
	const rest = total % 11;
	return rest > 1 ? 11 - rest : 0;
}

/** Strips spaces and dots so "1.234.567 - 9" becomes "1234567-9". */
export function normalizeRuc(input: string): string {
	return input.replace(/[\s.]/g, '');
}

export function isValidRuc(input: string): boolean {
	const match = /^(\d{3,9})-(\d)$/.exec(normalizeRuc(input));
	if (!match) return false;
	return rucCheckDigit(match[1]) === Number(match[2]);
}
