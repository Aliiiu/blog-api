export const generateMiddleWare = (schema) => {
	return (req, res, next) => {
		// Middleware logic
		if (schema) {
			const { error } = schema.validate(req.body);
			if (error) {
				return res
					.status(400)
					.json({ message: 'Validation error', errors: error?.details });
			}
		}
		next();
	};
};
