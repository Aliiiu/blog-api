import express from 'express';
import * as authControllers from '../controllers/auth.controller.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { generateMiddleWare } from '../middleware/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';

const authRoute = express.Router();

authRoute.post(
	'/signup',
	generateMiddleWare(registerSchema),
	passport.authenticate('signup', { session: false }),
	authControllers.signUp
);

authRoute.post(
	'/login',
	generateMiddleWare(loginSchema),
	async (req, res, next) => {
		passport.authenticate('login', async (err, user) => {
			try {
				if (err) {
					return next(err);
				}

				req.login(user, { session: false }, async (error) => {
					if (error) return next(error);

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
	}
);

export default authRoute;
