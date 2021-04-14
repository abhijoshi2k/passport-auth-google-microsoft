var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.send(req.user);
	} else {
		res.send(
			'Not signed in.<br><a href="/auth/google" role="button">Google</a><br><a href="/auth/microsoft" role="button">Microsoft</a>'
		);
	}
});

module.exports = router;
