const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('./models/user');
require('dotenv').config();

const app = express();
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB);

const PORT = process.env.PORT;

app
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use('/auth', require('./api/authentication'))
	.use((req, res, next) => {
		const { authorization: token } = req.headers;
		if (!token) {
			res.status(403).send({
				success: false,
				message: 'Please login'
			})
		} else {
			jwt.verify(token, process.env.SECRET, { algorithms: 'HS512' }, (e, decoded) => {
				if (e) {
					res.json({ success: false, message: 'Failed to authenticate token, please log in again'})
				} else {
					req.username = decoded;
					// username is available in middlewares below
					res.json({ message: 'Authenticated' })
				}
			})
		}
	})
	.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`)
	});