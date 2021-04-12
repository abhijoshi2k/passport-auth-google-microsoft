const passport = require('passport');

User = require('../schema/userSchema');

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
};
