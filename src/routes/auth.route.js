import express from 'express';
import * as authControllers from '../controllers/auth.controller.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ErrorWithStatus } from '../exceptions/error-with-status.exceptions.js';

const authRoute = express.Router();

authRoute.post(
	'/signup',
	passport.authenticate('signup', { session: false }),
	authControllers.signUp
);

authRoute.post('/login', async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if (err) {
				return next(err);
			}
			if (!user) {
				const error = new ErrorWithStatus(
					'Username or password is incorrect',
					400
				);
				return next(error);
			}

			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);
				const { email, _id } = user;

				const token = jwt.sign({ user }, process.env.JWT_SECRET, {
					expiresIn: '1h',
				});

				return res.json({
					message: 'Login Successful',
					data: {
						accessToken: token,
						user,
					},
				});
			});
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
});

export default authRoute;
