import Stripe from 'stripe';
const secret_key = process.env.STRIPE_SECRET_KEY || 'null';
export const stripe = new Stripe(secret_key, {
	apiVersion: '2022-11-15',
});
