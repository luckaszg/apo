import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Prices are stored as integer guaraníes (PYG has no decimals).

const timestamps = {
	createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
};

export const products = sqliteTable('products', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	description: text('description').notNull().default(''),
	kind: text('kind', { enum: ['own_design', 'blank'] }).notNull(),
	category: text('category').notNull(),
	basePrice: integer('base_price').notNull(),
	featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0),
	...timestamps,
});

export const productImages = sqliteTable('product_images', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	r2Key: text('r2_key').notNull(),
	sortOrder: integer('sort_order').notNull().default(0),
});

export const productVariants = sqliteTable('product_variants', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	size: text('size'),
	color: text('color'),
	priceOverride: integer('price_override'),
	// null = stock not tracked
	stock: integer('stock'),
});

export const portfolioItems = sqliteTable('portfolio_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	description: text('description').notNull().default(''),
	category: text('category').notNull(),
	technique: text('technique').notNull(),
	clientLabel: text('client_label'),
	featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
	visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0),
	...timestamps,
});

export const portfolioImages = sqliteTable('portfolio_images', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	portfolioItemId: integer('portfolio_item_id')
		.notNull()
		.references(() => portfolioItems.id, { onDelete: 'cascade' }),
	r2Key: text('r2_key').notNull(),
	sortOrder: integer('sort_order').notNull().default(0),
});

export const orders = sqliteTable(
	'orders',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		// Public code shown to customers, e.g. APO-0042. Derived from id (see lib/orders.ts).
		code: text('code').unique(),
		// Random secret for the tracking link /pedido/<code>?t=<token>
		token: text('token').notNull(),
		kind: text('kind', { enum: ['store', 'custom'] }).notNull(),
		status: text('status', {
			enum: ['nuevo', 'presupuestado', 'confirmado', 'en_produccion', 'listo', 'entregado', 'cancelado'],
		})
			.notNull()
			.default('nuevo'),
		paymentMethod: text('payment_method', { enum: ['transfer', 'cash'] }),
		paymentStatus: text('payment_status', { enum: ['pendiente', 'comprobante_recibido', 'pagado'] })
			.notNull()
			.default('pendiente'),
		customerName: text('customer_name').notNull(),
		customerPhone: text('customer_phone').notNull(),
		customerEmail: text('customer_email'),
		deliveryMethod: text('delivery_method').notNull(),
		deliveryCity: text('delivery_city'),
		deliveryAddress: text('delivery_address'),
		deliveryCost: integer('delivery_cost').notNull().default(0),
		subtotal: integer('subtotal').notNull().default(0),
		total: integer('total').notNull().default(0),
		quotedPrice: integer('quoted_price'),
		invoiceRequired: integer('invoice_required', { mode: 'boolean' }).notNull().default(false),
		ruc: text('ruc'),
		razonSocial: text('razon_social'),
		invoiceIssued: integer('invoice_issued', { mode: 'boolean' }).notNull().default(false),
		notes: text('notes').notNull().default(''),
		internalNotes: text('internal_notes').notNull().default(''),
		...timestamps,
	},
	(t) => [index('orders_status_idx').on(t.status), index('orders_created_idx').on(t.createdAt)],
);

export const orderItems = sqliteTable('order_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	orderId: integer('order_id')
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
	variantId: integer('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
	// Snapshot so the order stays readable if the product is edited or deleted.
	nameSnapshot: text('name_snapshot').notNull(),
	unitPrice: integer('unit_price').notNull(),
	quantity: integer('quantity').notNull(),
});

export const customRequests = sqliteTable('custom_requests', {
	orderId: integer('order_id')
		.primaryKey()
		.references(() => orders.id, { onDelete: 'cascade' }),
	productType: text('product_type').notNull(),
	techniquePref: text('technique_pref'),
	quantity: integer('quantity').notNull(),
	// e.g. {"S": 5, "M": 10}
	sizeBreakdown: text('size_breakdown', { mode: 'json' }).$type<Record<string, number>>(),
	garmentColor: text('garment_color'),
	placement: text('placement'),
	needsDesign: integer('needs_design', { mode: 'boolean' }).notNull().default(false),
	designDescription: text('design_description'),
	neededBy: text('needed_by'),
	portfolioRefId: integer('portfolio_ref_id').references(() => portfolioItems.id, { onDelete: 'set null' }),
});

export const orderFiles = sqliteTable('order_files', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	orderId: integer('order_id')
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	kind: text('kind', { enum: ['design', 'receipt'] }).notNull(),
	r2Key: text('r2_key').notNull(),
	filename: text('filename').notNull(),
	size: integer('size').notNull(),
});

export const settings = sqliteTable('settings', {
	key: text('key').primaryKey(),
	value: text('value', { mode: 'json' }).notNull(),
});
