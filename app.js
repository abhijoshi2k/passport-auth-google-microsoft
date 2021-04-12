require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const mongoose = require('./db/mongoose');
const passport = require('./auth/passport');
const authRouter = require('./auth/authRouter');

const app = express();

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URL //mongoose.connection
		})
	})
);
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

passport(app);

app.use('/auth', authRouter);

app.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.send(req.user);
	} else {
		res.send(
			'Not signed in. <a href="/auth/google" role="button">click</a>'
		);
	}
});

app.listen(3000, () => {
	console.log('Listening to port 3000');
});
