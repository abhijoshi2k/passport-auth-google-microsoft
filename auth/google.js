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
				User.findOrCreate(
					{ googleId: profile.id },
					function (err, user) {
						return cb(err, user);
					}
				);
			}
		)
	);
};
