var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.send(req.user);
	} else {
		res.send(
			'Not signed in. <a href="/auth/google" role="button">click</a>'
		);
	}
});

module.exports = router;
