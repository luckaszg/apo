/** Formats integer guaraníes as "Gs. 85.000". */
export function formatGs(amount: number): string {
	return `Gs. ${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}
