import { describe, expect, it } from 'vitest';
import { formatGs } from './money';
import { orderCode, orderToken } from './orders';
import { whatsappLink } from './whatsapp';

describe('formatGs', () => {
	it('uses dots as thousands separators', () => {
		expect(formatGs(85000)).toBe('Gs. 85.000');
		expect(formatGs(1250000)).toBe('Gs. 1.250.000');
		expect(formatGs(500)).toBe('Gs. 500');
	});
});

describe('orderCode', () => {
	it('pads to 4 digits', () => {
		expect(orderCode(42)).toBe('APO-0042');
		expect(orderCode(12345)).toBe('APO-12345');
	});
});

describe('orderToken', () => {
	it('is 32 hex chars and random', () => {
		expect(orderToken()).toMatch(/^[0-9a-f]{32}$/);
		expect(orderToken()).not.toBe(orderToken());
	});
});

describe('whatsappLink', () => {
	it('strips non-digits and encodes the message', () => {
		expect(whatsappLink('+595 981 123-456', 'Hola, pedido APO-0042')).toBe(
			'https://wa.me/595981123456?text=Hola%2C%20pedido%20APO-0042',
		);
	});
});
