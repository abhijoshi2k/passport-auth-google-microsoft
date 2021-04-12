const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../schema/userSchema');

module.exports = () => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback'
			},
			function (accessToken, refreshToken, profile, cb) {
				User.findOne({ googleId: profile.id }, (err, user) => {
					if (err) {
						console.log(err);
						return cb(err, user);
					} else if (user) {
						return cb(null, user);
					} else {
						const newUser = new User();
						newUser.email = profile._json.email;
						newUser.googleId = profile.id;
						newUser.save((err) => {
							if (err) {
								return cb(err, newUser);
							} else {
								return cb(null, newUser);
							}
						});
					}
				});
			}
		)
	);
};
