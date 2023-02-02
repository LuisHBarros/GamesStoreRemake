export interface IDonePayments {
	id: string;
	customer_email: string;
	customer_name: string;
	payment_status: string;
	subtotal: number;
	total: number;
	products: string[];
	created_at: Date;
	paid_at: Date | null;
	session_id?: string;
}
