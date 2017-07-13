const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = mongoose.model('User');

router
	.post('/signup', async (req, res) => {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (user) {
			res.send({
				success: false,
				message: 'Username is already taken'
			});
		}
		else {
			const passHash = await bcrypt.hash(password, 10);
			const account = new User({
				username,
				password: passHash
			});
			await account.save()
			res.json({ success: 'true', message: 'Please log in' });
		}
	})
	.post('/login', async (req, res) => {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			res.json({ success: false, message: 'Username or password is incorrect' });
		} else {
			jwt.sign(username, process.env.SECRET, { algorithm: 'HS512'}, (e, token) => {
				res.json({ success: true, message: 'Token generated!', token });
			})
		}
	})

module.exports = router;