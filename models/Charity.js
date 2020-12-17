const mongoose = require('mongoose');

const CharitySchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	requirements: [
		{
			type: String,
		}
	]
});

module.exports = mongoose.model('Charity', CharitySchema);