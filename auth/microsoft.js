const passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const User = require('../schema/userSchema');

let allowHTTP = false;
if (process.env.NODE_ENV === 'dev') {
	allowHTTP = true;
}

module.exports = () => {
	passport.use(
		new OIDCStrategy(
			{
				identityMetadata: process.env.MICROSOFT_METADATA_ENDPOINT,
				clientID: process.env.MICROSOFT_CLIENT_ID,
				responseType: process.env.MICROSOFT_RESPONSE_TYPE,
				responseMode: process.env.MICROSOFT_RESPONSE_MODE,
				redirectUrl: process.env.MICROSOFT_REDIRECT_URL,
				allowHttpForRedirectUrl: allowHTTP,
				clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
				validateIssuer: true,
				scope: ['email', 'profile']
			},
			function (iss, sub, profile, accessToken, refreshToken, done) {
				console.log(profile);

				if (!profile.oid) {
					return done(new Error('No oid found'), null);
				}
				// asynchronous verification, for effect...
				process.nextTick(function () {
					User.findOne({ oid: profile.oid }, function (err, user) {
						if (err) {
							return done(err);
						} else if (user) {
							return done(null, user);
						} else {
							// "Auto-registration"
							let newUser = new User();
							newUser.oid = profile.oid;
							newUser.email = profile._json.email;
							newUser.save((error) => {
								if (error) {
									console.log(error);
									return done(error);
								} else {
									return done(null, newUser);
								}
							});
						}
					});
				});
			}
		)
	);
};
