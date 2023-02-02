import { ILine_items } from './ILineItems';

export interface ICreateSessionData {
	customer_email: string;
	payment_method: any[];
	line_items: ILine_items[];
	mode: any;
	success_url: string;
	cancel_url: string | undefined;
}
