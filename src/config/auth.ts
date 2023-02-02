export default {
	token: {
		secret: String(process.env.SECRET),
		expiresIn: '1h',
	},
};
