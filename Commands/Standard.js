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
 const fs = require('fs')
 const path = require('path')
 const DataManager = require('../DataManager.js')
 
 /**
  * @callback cmdCallback
  * @param {Discord.Message} Message - The Message object of the command
  * @param {Discord.GuildMember} User - The Guild Member that called the command
  * @param {Discord.Client} Client - The bot's Discord Client
  */
 
let AllCommands = {}

fs.readdir("./Commands", (err, files) => {
	if(err){
		throw err
	}

	files.forEach(file => {
		let fileCmds = require(path.join(__dirname, file))
		let categoryName = file.slice(0, -3)
		AllCommands[categoryName] = {}
		
		let thisCategory = AllCommands[categoryName]
		for(let name in fileCmds){
			if(fileCmds[name].PermissionLevel < 100){
				if(thisCategory[name]){
					console.warn(`Command <${name}> was already registered in this command file.`)
				} else {
					thisCategory[name] = fileCmds[name]
				}
			}
		}
	})
})

function GetPermissionString(PermissionNumber){
	if(PermissionNumber == 0){
		return "Anyone"
	} else if(PermissionNumber == 1){
		return "Administrators"
	} else if(PermissionNumber == 2){
		return "Server Owner"
	}
	return "Unknown"
}

module.exports = {
 
	"Help" : {

		Aliases : ["help"],

		Description : "Get information about a specific command.",

		PermissionLevel : 0,

		Arguments : [ [ArgumentType.String, false, "Target command"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, alias){
			let commandFound = false

			for(let category in AllCommands){
				for(let cmdName in AllCommands[category]){
					let Command = AllCommands[category][cmdName]
					if(Command.Aliases.includes(alias.toLowerCase())){
						commandFound = true

						let embedDescription = ""
						embedDescription += Command.Description
						embedDescription += "\n\n"
						embedDescription += "**Aliases:** "+(Command.Aliases.join(", "))
						embedDescription += "\n\n"
						embedDescription += "**Permission Level:** "+GetPermissionString(Command.PermissionLevel)
						embedDescription += "\n\n"

						let UsageString = Command.Aliases[0]
						for(let ArgData of Command.Arguments){
							let WrappedArgType = ArgData[1] ? `[${ArgData[0].Name}]` : `<${ArgData[0].Name}>`
							UsageString += (" "+WrappedArgType)
						}

						embedDescription += "**Usage:** rnd-"+UsageString
						if(Command.Arguments.length > 0){
							embedDescription += "\n\n\n"
							embedDescription += "**__Arguments__**"

							for(let ArgData of Command.Arguments){
								let WrappedArgType = ArgData[1] ? `[${ArgData[0].Name}]` : `<${ArgData[0].Name}>`
								let Optional = ArgData[1] ? "(REQUIRED)" : "(OPTIONAL)"
								let ArgDescription = ArgData[2]
								embedDescription += "\n\n"
								embedDescription += `${WrappedArgType} - **${Optional}** ${ArgDescription}`
							}
						}

						let infoEmbed = new Discord.MessageEmbed()
							.setTitle(cmdName)
							.setDescription(embedDescription)
							.setColor(0x1ABC9C)
							.setFooter("Randomist by Antonio", "https://i.imgur.com/SYOgzCt.png")
							.setTimestamp()

						Message.reply(infoEmbed)

						break
					}
				}
			}

			if(!commandFound){
				Message.reply("Command not found.")
			}
		}

	},

	"Commands" : {

		Aliases : ["commands", "cmds"],

		Description : "Shows a list of all the commands the bot has.",

		PermissionLevel : 0,

		Arguments : [ ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			
			let commandEmbed = new Discord.MessageEmbed()
				.setTitle("Randomist Commands")
				.setDescription("To get information about any of these commands, do `rnd-help <command>`")
				.setColor(0x1ABC9C)
				.setFooter("Randomist by Antonio", "https://i.imgur.com/SYOgzCt.png")
				.setTimestamp()

			for(let category in AllCommands){
				let commandString = ""
				for(let cmdName in AllCommands[category]){
					let cmd = AllCommands[category][cmdName]
					commandString += '`'+cmd.Aliases[0]+'` '
				}
				commandString.trim()
				commandEmbed.addField(category, commandString, true)
			}

			Message.reply(commandEmbed)

		}

	},

	"Prefix" : {

		Aliases : ["prefix", "setprefix"],

		Description : "View or change the prefix for your guild.",

		PermissionLevel : 2,

		Arguments : [ [ArgumentType.String, false, "New prefix"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, knuPrefix){
			if(knuPrefix){

				if(knuPrefix.length > 0 && knuPrefix.length <= 10){
					DataManager.setPrefixForGuild(Message.guild.id, knuPrefix)
						.then(() => {
							Message.reply("Successfully set the prefix to `"+knuPrefix+"`.")
						})
						.catch(() => {
							Message.reply("Failed to set the prefix due to an internal error.")
						})
				} else {
					Message.reply("Invalid prefix speciifed. Prefix must be less than 10 characters.")
				}

			} else {

				let currentPrefix = await DataManager.getPrefixForGuild(Message.guild.id)
				if(!currentPrefix){
					currentPrefix = "rnd-"
				}
				Message.reply(`The prefix for this guild is \`${currentPrefix}\`.`)

			}
		}

	},

	"Invite" : {

		Aliases : ["invite"],

		Description : "Gives the invite link for this bot",

		PermissionLevel : 0,

		Arguments : [ ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			
			let inviteEmbed = new Discord.MessageEmbed()
				.setTitle("Randomist Invite (Click me)")
				.setDescription("Invite this bot to your server by clicking above!")
				.setURL("https://discord.com/oauth2/authorize?client_id=792584842789257227&scope=bot&permissions=67488832")
				.setTimestamp()
				.setFooter("Randomist by Antonio", "https://i.imgur.com/SYOgzCt.png")

			Message.reply(inviteEmbed)

		}

	},
}