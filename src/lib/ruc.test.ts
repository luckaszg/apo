import { describe, expect, it } from 'vitest';
import { isValidRuc, normalizeRuc, rucCheckDigit } from './ruc';

describe('rucCheckDigit', () => {
	it('computes the módulo 11 check digit', () => {
		// 7·2 + 6·3 + 5·4 + 4·5 + 3·6 + 2·7 + 1·8 = 112; 112 % 11 = 2; 11 - 2 = 9
		expect(rucCheckDigit('1234567')).toBe(9);
	});

	it('returns 0 when the remainder is 0', () => {
		expect(rucCheckDigit('000')).toBe(0);
	});

	it('wraps the weight back to 2 after 11 and returns 0 for remainder 1', () => {
		// Eleven 1s: weights 2..11 sum to 65, the 11th digit wraps to weight 2 → 67; 67 % 11 = 1
		expect(rucCheckDigit('11111111111')).toBe(0);
	});
});

describe('isValidRuc', () => {
	it('accepts a correct RUC', () => {
		expect(isValidRuc('1234567-9')).toBe(true);
	});

	it('accepts dots and spaces', () => {
		expect(isValidRuc('1.234.567 - 9')).toBe(true);
		expect(normalizeRuc('1.234.567 - 9')).toBe('1234567-9');
	});

	it('rejects a wrong check digit', () => {
		expect(isValidRuc('1234567-8')).toBe(false);
	});

	it('rejects malformed input', () => {
		expect(isValidRuc('1234567')).toBe(false);
		expect(isValidRuc('abc-1')).toBe(false);
		expect(isValidRuc('')).toBe(false);
	});
});
