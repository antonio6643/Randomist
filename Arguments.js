const Discord = require('discord.js')
const Util = require('./Util.js')

// ----- Strings ----- //
/**
 * @callback Parse
 * @param {String} rawValue
 * @param {Discord.Message} message
 */

exports.String = {

	Name : "String",

	/** @type {Parse} */
	Parse : async function(rawValue){
		return rawValue.toString()
	}	

}

exports.LongString = { // Special Case

	Name : "LongString"

}

exports.List = {
	
	Name : "List",

	/** @type {Parse} */
	Parse : async function(rawValue){
		let elements = rawValue.split(",").map( s => s.trim() )
		if(elements && elements.length > 0){
			return elements
		} else {
			return null
		}
	}

}

// ----- Numbers ----- //
exports.Integer = {

	Name : "Integer",

	/** @type {Parse} */
	Parse : async function(rawValue){
		let num = parseInt(rawValue)
		if(isNaN(num)){
			return null
		} else {
			return num
		}
	}

}

exports.Float = {

	Name : "Float",

	/** @type {Parse} */
	Parse : async function(rawValue){
		let num = parseFloat(rawValue)
		if(isNaN(num)){
			return null
		} else {
			return num
		}
	}

}

// ----- Boolean ----- //
exports.Boolean = {

	Name : "Boolean",

	/** @type {Parse} */
	Parse : async function(rawValue){
		if(rawValue == "yes" || rawValue == "y" || rawValue == "true" || rawValue == "t"){
			return true
		} else if(rawValue == "no" || rawValue == "n" || rawValue == "false" || rawValue == "f"){
			return false
		} else {
			return null
		}
	}

}

// ----- Discord Objects ----- //
exports.Message = {

	Name : "Message",

	/** @type {Parse} */
	Parse : async function(rawValue, message){
		let requestId = Util.isInteger(rawValue) ? rawValue : rawValue.substring(rawValue.lastIndexOf('/')+1)
		if(Util.isInteger(requestId)){
			let guild = message.guild
			for(let [id, channel] of guild.channels.cache){
				if(channel.isText()){
					try{
						let msg = await channel.messages.fetch(requestId)
						return msg
					} catch (err){
						// nothing happens
					}
				}
			}
		} else {
			console.log("Not an integer")
			return null
		}
	}

}

exports.Member = {

	Name : "User",

	/** @type {Parse} */
	Parse : async function(rawValue, message){
		if(rawValue.startsWith("<@") && rawValue.endsWith(">")){
			let mention = rawValue.slice(2, -1).replace("!", "")
			let foundUser = message.guild.members.cache.get(mention)
			return foundUser
		} else {
			return null
		}
	}

}

// ----- Generators ----- //
/**
 * Argument Generator
 * @param {Array} options 
 */
exports.Choice = function(options){

	return {
		
		Name : "Choice",

		Description : options.join(", "),

		/** @type {Parse} */
		Parse : async function(rawValue){
			if(options.includes(rawValue)){
				return rawValue
			}
			return null
		}

	}

}