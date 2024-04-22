export const signUp = (req, res) => {
	const { firstName, lastName, email, id, createdAt, updatedAt } = req.user;
	res.json({
		message: 'Signup Successful',
		data: {
			id,
			firstName,
			lastName,
			email,
			updatedAt,
			createdAt,
		},
	});
};
