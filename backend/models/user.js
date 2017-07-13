const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('User', new Schema({
	username: String,
	password: String
}));