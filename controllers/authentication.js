const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	// 'sub' = 'subject', 'iat' = 'issued at time'
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// User has already had their email and password auth'd
	// We just need to give them a token
	// passport is kind enough to provide us the user model in the request
	res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) return res.status(422).send({ error: 'You must provide email and password' });

	// See if a user with the given email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if (err) return next(err);

		// If a user with email does exist, then return an error
		if (existingUser) return res.status(422).send({ error: 'Email is in use' });

		// If a user with email does not exist, then create and save user record
		const user = new User({
			email: email,
			password: password
		});

		user.save(function(err) {
			if (err) return next(err);

			// Respond to request indicating the user was createed
			res.json({ token: tokenForUser(user) });
		});

	});
}
