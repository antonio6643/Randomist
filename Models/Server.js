const mongoose = require('mongoose')

const serverSchema = new mongoose.Schema({
	serverId : { type : String, trim : true, unique : true, required : true },
	prefix : { type : String, trim : true },
	dailyAmount : { type : Number, min : 0, max : 1000, default : 100 }
})

module.exports = mongoose.model("Server", serverSchema)