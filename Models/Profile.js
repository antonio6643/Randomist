const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
	userid : { type : String, trim : true, unique : true, required : true },
	balances : { type : Map, of : Number, default : {} },
	xp : { type : Number, min : 0, default : 0 }, // Level can be calculated from xp
	dailys : { type : Map, of : Date, default : {} }
})

module.exports = mongoose.model("Profile", profileSchema)