/** wa.me link that opens a chat with `phone` and a prefilled message. */
export function whatsappLink(phone: string, message: string): string {
	// wa.me wants the number in international format with digits only, e.g. 595981123456
	const digits = phone.replace(/\D/g, '');
	return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
