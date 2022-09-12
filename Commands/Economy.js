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

	"Profile" : {

		Aliases : ["profile", "p", "me"],

		Description : "Retrieves the user's profile information.",

		PermissionLevel : 0,

		Arguments : [  ],

		/** @type {cmdCallback} */

		Callback : async function(Message, User, Client){
			
			let UserInfo = await DataManager.getProfileData(User)

			let Embed = new Discord.MessageEmbed()
				.setTitle(`${User.displayName}'s Profile`)
				.setThumbnail(User.user.displayAvatarURL())
				.addField("Balance", "~~**R**~~ "+UserInfo.balance, true)
				.addField("XP", UserInfo.xp, true)
				.setColor([38, 162, 212])

			await Message.channel.send(Embed)

		}

	},

	"Daily" : {

		Aliases : ["daily", "d"],

		Description : "Redeems the daily bonus for that server",

		PermissionLevel : 0,

		Arguments : [  ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			try {
				
				let dailyResult = await DataManager.redeemDaily(User)

				let Embed = new Discord.MessageEmbed()
					.setTitle(`${User.displayName}'s Updated Profile`)
					.setThumbnail(User.user.displayAvatarURL())
					.addField("Balance", "~~**R**~~ "+dailyResult.balance, true)
					.addField("XP", dailyResult.xp, true)
					.setColor([38, 162, 212])

				Message.reply("Success!", Embed)

			} catch(err) {
				if(typeof(err) == "string"){
					Message.reply(err)
				}
			}
		}

	},

	// * Server Owner Commands * //
	"Add Rand" : {

		Aliases : ["addrand", "credit", "addcredit", "add"],

		Description : "Give rand to the designated player",

		PermissionLevel : 2,

		Arguments : [ [ArgumentType.Member, true, "Target user"], [ArgumentType.Integer, true, "Amount of Rand"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, target, amt){
			try {
				let knuStats = await DataManager.addRand(target, amt)

				let Embed = new Discord.MessageEmbed()
					.setTitle(`${User.displayName}'s Updated Profile`)
					.setThumbnail(User.user.displayAvatarURL())
					.addField("Balance", "~~**R**~~ "+knuStats.balance, true)
					.addField("XP", knuStats.xp, true)
					.setColor([38, 162, 212])

				await Message.channel.send("Success!", Embed)
			} catch (err) {
				await Message.channel.send("Operation failed. Please try again later.")
				console.log("-----")
				console.log(err)
				console.log("-----")
			}
		}

	},

	"Remove Rand" : {

		Aliases : ["removerand", "decredit", "removecredit", "deduct"],

		Description : "Remove rand from the designated player",

		PermissionLevel : 2,

		Arguments : [ [ArgumentType.Member, true, "Target user"], [ArgumentType.Integer, true, "Amount of Rand"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, target, amt){
			try {
				let knuStats = await DataManager.removeRand(target, amt)

				let Embed = new Discord.MessageEmbed()
					.setTitle(`${User.displayName}'s Updated Profile`)
					.setThumbnail(User.user.displayAvatarURL())
					.addField("Balance", "~~**R**~~ "+knuStats.balance, true)
					.addField("XP", knuStats.xp, true)
					.setColor([38, 162, 212])

				await Message.channel.send("Success!", Embed)
			} catch (error) {
				await Message.channel.send("Operation failed. Please try again later.")
				console.log("~~~~~")
				console.log(err)
				console.log("~~~~~")
			}
		}
	},

	"Set Rand" : {

		Aliases : ["setrand", "setcredit"],

		Description : "Sets the designated user's rand to the designated value",

		PermissionLevel : 2,

		Arguments : [ [ArgumentType.Member, true, "Target user"], [ArgumentType.Integer, true, "Amount of Rand"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, target, amt){
			try {
				let knuStats = await DataManager.setRand(User, amt)

				let Embed = new Discord.MessageEmbed()
					.setTitle(`${User.displayName}'s Updated Profile`)
					.setThumbnail(User.user.displayAvatarURL())
					.addField("Balance", "~~**R**~~ "+knuStats.balance, true)
					.addField("XP", knuStats.xp, true)
					.setColor([38, 162, 212])

				await Message.channel.send("Success!", Embed)
			} catch (error) {
				await Message.channel.send("Operation failed. Please try again later.")
				console.log("<><><><><>")
				console.log(err)
				console.log("<><><><><>")
			}
		}
	}

}