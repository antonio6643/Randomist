/**
 * Permission Levels:
 * 6643 - Bot Owner (me)
 * 2 - Server Owner
 * 1 - Administrator
 * 0 - User
 */
const Discord = require('discord.js')
const axios = require('axios')
const ArgumentType = require('../Arguments.js')
const Util = require('../Util.js')

/**
 * @callback cmdCallback
 * @param {Discord.Message} Message - The Message object of the command
 * @param {Discord.GuildMember} User - The Guild Member that called the command
 * @param {Discord.Client} Client - The bot's Discord Client
 */


module.exports = {

	"Random Color" : {

		Aliases : ["color", "colour"],

		Description : "Generates a random color.",

		PermissionLevel : 0,

		Arguments : [],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			let red = Util.RandomInteger(0, 255)
			let green = Util.RandomInteger(0, 255)
			let blue = Util.RandomInteger(0, 255)
			
			let hex = Util.RGBToHex(red, green, blue)
			let colorInt = parseInt(Number("0x"+hex), 10)

			let Embed = new Discord.MessageEmbed()
				.setColor([red, green, blue])
				.setTitle("Random Color")
				.setDescription("Here is your randomly generated color!")
				.setImage(`https://singlecolorimage.com/get/${hex}/800x800`)
				.addField("Red", red, true)
				.addField("Green", green, true)
				.addField("Blue", blue, true)
				.addField("Hex", hex, true)
				.addField("Integer", colorInt, true)
				.setFooter("Randomist by Antonio", "https://i.imgur.com/SYOgzCt.png")
				.setTimestamp()
			
			Message.channel.send(Embed)

		}

	},

	"Random Cat" : {

		Aliases : ["cat", "kitty", "kitten"],

		Description : "Generates a random cat image",

		PermissionLevel : 0,

		Arguments : [],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			axios.get("https://aws.random.cat/meow")
				.then((response) => {
					
					const body = response.data
					const imageLink = body.file

					let localEmbed = new Discord.MessageEmbed()
						.setColor(0x1ABC9C)
						.setTitle("Random Cat")
						.setImage(imageLink)
						.setFooter("Randomist by Antonio", "https://i.imgur.com/SYOgzCt.png")
						.setTimestamp()

					Message.channel.send(localEmbed)

				})
		}

	},

	"Random Dog" : {

		Aliases : ["dog", "puppy"],

		Description : "Generates a random dog image",

		PermissionLevel : 0,

		Arguments : [],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			axios.get("https://random.dog/woof.json")
				.then((response) => {
					
					const body = response.data
					const imageLink = body.url

					let localEmbed = new Discord.MessageEmbed()
						.setColor(0x1ABC9C)
						.setTitle("Random Dog")
						.setImage(imageLink)
						.setFooter("Randomist by Antonio", "https://i.imgur.com/SYOgzCt.png")
						.setTimestamp()

					Message.channel.send(localEmbed)

				})
		}

	},

	"Random Fox" : {

		Aliases : ["fox"],

		Description : "Generates a random fox image",

		PermissionLevel : 0,

		Arguments : [],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			axios.get("https://randomfox.ca/floof/")
				.then((response) => {
					
					const body = response.data
					const imageLink = body.image.replace("\\", "")

					let localEmbed = new Discord.MessageEmbed()
						.setColor(0x1ABC9C)
						.setTitle("Random Fox")
						.setImage(imageLink)
						.setFooter("Randomist by Antonio", "https://i.imgur.com/SYOgzCt.png")
						.setTimestamp()

					Message.channel.send(localEmbed)

				})
		}

	},

}