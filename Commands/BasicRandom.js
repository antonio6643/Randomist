/**
 * Permission Levels:
 * 6643 - Bot Owner (me)
 * 2 - Server Owner
 * 1 - Administrator
 * 0 - User
 */
const Discord = require('discord.js')
const ArgumentType = require('../Arguments.js')
const Util = require('../Util.js')

/**
 * @callback cmdCallback
 * @param {Discord.Message} Message - The Message object of the command
 * @param {Discord.GuildMember} User - The Guild Member that called the command
 * @param {Discord.Client} Client - The bot's Discord Client
 */


module.exports = {

	"Test" : {

		Aliases : ["test", "testing"],

		Description : "This is a testing command.",

		PermissionLevel : 6643,

		Arguments : [ [ArgumentType.LongString, false, "Any string"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, firstArg){
			console.log(firstArg)
			await Message.channel.send("Command worked! Check below for the argument you supplied.")
			await Message.channel.send("Argument: "+firstArg)
		}

	},

	"Random Number" : {

		Aliases : ["number", "#", "num", "n"],

		Description : "Generates a random number from the specified range(defaults 0-100)",

		PermissionLevel : 0,

		Arguments : [ [ArgumentType.Integer, false, "Minimum number"], [ArgumentType.Integer, false, "Maximum number"] ],

		/** @type {cmdCallback} */

		Callback : async function(Message, User, Client, lowerBound, upperBound){
			let lower = lowerBound || 0
			let upper = upperBound || 100
			//let randomNumber = Math.floor( Math.random() * (upper - lower + 1) ) + lower
			let randomNumber = Util.RandomInteger(Math.min(lower, upper), Math.max(upper, lower))
			await Message.channel.send("Random Number: "+randomNumber)
		}

	},

	"Random Choice" : {

		Aliases : ["choice", "choose"],

		Description : "Selects a random element from the supplied list",

		PermissionLevel : 0,

		Arguments : [ [ArgumentType.List, true, "The list to choose from"] ],

		/** @type {cmdCallback} */
		
		Callback : async function(Message, User, Client, elements){
			let selectedElement = Util.RandomChoice(elements) //elements[Math.floor(Math.random() * elements.length)]
			await Message.channel.send("Selected element: "+selectedElement)
		}

	},

	"Roll Dice" : {

		Aliases : ['dice', 'roll', 'roll6'],

		Description : "Rolls *n* 6-sided dice and returns the results",

		PermissionLevel : 0,

		Arguments : [ [ArgumentType.Integer, false, "Number of dice to roll"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, rawDice){
			let numDice = Math.min(rawDice || 2, 6)
			let results = []
			let total = 0
			let diceString = ""
			for(let d=0; d < numDice; d++){
				let dNum = Util.RandomInteger(1, 6)
				results[d] = dNum
				total += dNum
				diceString = diceString + `**${dNum}**` + (d != numDice - 1 ? " + " : "")
			}
			await Message.channel.send(`${diceString} = **${total}**`)
		}
	},

	"Coin Flip" : {

		Aliases : ['coinflip', 'flipcoin', 'coin', 'flip'],

		Description : "Flip a coin",

		PermissionLevel : 0,

		Arguments : [ ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			let SideNum = Util.RandomInteger(1,2)
			if(SideNum == 1){
				await Message.channel.send("The coin landed on **Heads**!")
			} else if(SideNum == 2) { // Just in case I ever break my RandomInteger function somehow
				await Message.channel.send("The coin landed on **Tails**!")
			}
		}

	}

}