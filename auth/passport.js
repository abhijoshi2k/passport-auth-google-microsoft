const passport = require('passport');

const User = require('../schema/userSchema');

const GoogleStrategy = require('./google');
const OIDCStrategy = require('./microsoft');

module.exports = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(User.createStrategy());

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	GoogleStrategy();
	OIDCStrategy();
};
