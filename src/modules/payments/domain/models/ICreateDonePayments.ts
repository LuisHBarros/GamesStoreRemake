export interface ICreateDonePayments {
	sessionId: string;
	customer_email: string;
	customer_name: string;
	payment_status: string;
	subtotal: number;
	total: number;
	products: string[];
}
