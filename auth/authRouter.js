var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email']
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	}
);

router.get(
	'/microsoft',
	passport.authenticate('azuread-openidconnect', {
		failureRedirect: '/login',
		tenantIdOrName: process.env.MICROSOFT_TENANT_ID
	}),
	function (req, res) {
		log.info('Login was called in the Sample');
		res.redirect('/');
	}
);

function regenerateSessionAfterAuthentication(req, res, next) {
	var passportInstance = req.session.passport;
	return req.session.regenerate(function (err) {
		if (err) {
			return next(err);
		}
		req.session.passport = passportInstance;
		return req.session.save(next);
	});
}

// POST /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   home page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.post(
	'/microsoft/callback',
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
	regenerateSessionAfterAuthentication,
	function (req, res) {
		res.redirect('/');
	}
);

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
