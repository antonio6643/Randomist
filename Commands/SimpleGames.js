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

const DataManager = require('../DataManager.js')

/**
 * @callback cmdCallback
 * @param {Discord.Message} Message - The Message object of the command
 * @param {Discord.GuildMember} User - The Guild Member that called the command
 * @param {Discord.Client} Client - The bot's Discord Client
 */


module.exports = {

	"Guessing Game" : {

		Aliases : ["guess", "guessing", "guessinggame"],

		Description : "Retrieves the user's profile information.",

		PermissionLevel : 0,

		Arguments : [ [ArgumentType.Integer, true, "The highest number you can guess"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, rawMax){
			
			let maxNumber = Math.min(Math.max(rawMax, 10), 1000)
			let attempts = maxNumber <= 50 ? Math.min(3, Math.floor(maxNumber / 5)) : 10

			let myNumber = Util.RandomInteger(1, maxNumber)

			console.log(`Max Number: ${maxNumber} | Attempts: ${attempts}`)
			console.log("Number:  "+myNumber)

			await Message.channel.send("Guess what number I'm thinking!")

			let collector = new Discord.MessageCollector(Message.channel, m => m.author.id == User.id, { maxProcessed : 20 })

			collector.on('collect', async msg => {
				let num = parseInt(msg.content)
				if(num && num > 0 && num <= maxNumber){
					if(num == myNumber){
						msg.reply(`You guessed my magic number! You get ${maxNumber} rand.`)
						collector.stop("win")
					} else {
						if(num > myNumber){
							msg.reply(`Your answer is **greater than** the magic number. You have ${attempts - 1} attempts left.`)
						} else if(num < myNumber){
							msg.reply(`Your number is **less than** the magic number. You have ${attempts - 1} attempts left.`)
						}
						attempts = attempts - 1
						if(attempts <= 0){
							Message.channel.send(`Sorry! The number was ${myNumber}`)
							collector.stop('lose')
						}
					}

				} else if(msg.content.toLowerCase() == "quit") {
					Message.channel.send(`Game ended! The number was ${myNumber}`)
					collector.stop('quit')
				} else {
					Message.channel.send("Invalid guess! Please guess a positive number inside the range")
				}
			})

			collector.on('end', async (collected, reason) => {
				if(reason == "win"){
					try {
						await DataManager.addRand(User, maxNumber)
					} catch (error) {
						await Message.channel.send(`Failed to add rand for <@!${User.id}>`)
					}
				} else if(reason == "timeout"){
					await Message.reply("Game timed out.")
				}
			})

			// Timeout
			setTimeout(function(){
				if(!collector.ended){
					collector.stop("timeout")
				}
			}, 60*1000)

		}

	}

}