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

	"Random Emoji" : {

		Aliases : ["emoji", "react"],

		Description : "Reacts to the designated method with a random emoji.",

		PermissionLevel : 0,

		Arguments : [ [ArgumentType.Message, false, "The message to react to"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, requestMessage){
			let targetMessage = requestMessage || Message
			let authorPermissions = User.permissionsIn(targetMessage.channel)
			if(authorPermissions.has(Discord.Permissions.FLAGS.ADD_REACTIONS)){
				
				let AllEmojis = Message.guild.emojis.cache.array()
				if(AllEmojis.length > 0){
					let selectedEmoji = Util.RandomChoice(AllEmojis)

					targetMessage.react(selectedEmoji)
				}

			}
		}

	},

	"Random User" : {

		Aliases : ["user", "usr", "member", "person"],

		Description : "Gets a random user in that discord channel",

		PermissionLevel : 0,

		Arguments : [  ], // TODO: Channel argument

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){
			let targetChannel = Message.channel

			let ChannelMembers = targetChannel.members.array()
			let SelectedMember = Util.RandomChoice(ChannelMembers)

			let Embed = new Discord.MessageEmbed()
				.setTitle("Random User")
				.setDescription(`**${SelectedMember.displayName}**`)
				.setThumbnail(SelectedMember.user.displayAvatarURL())
				.addField("Nickname", SelectedMember.nickname || SelectedMember.displayName, true)
				.addField("Discord Tag", SelectedMember.user.tag, true)
				.addField("Id", SelectedMember.user.id)
				.addField("Mention", `<@${SelectedMember.user.id}>`)
				.setColor(SelectedMember.displayColor)

			Message.channel.send(Embed)
		}
	},

	"Random Role" : {

		Aliases : ["role"],

		Description : "Gets a random role in the discord",

		PermissionLevel : 1,

		Arguments : [  ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client){

			let AllRoles = Message.guild.roles.cache.array()
			let SelectedRole = Util.RandomChoice(AllRoles)

			let Embed = new Discord.MessageEmbed()
				.setTitle("Random Role")
				.setDescription(`**${SelectedRole.name}**`)
				.setColor(SelectedRole.color)
				.addField("Role Name", SelectedRole.name, true)
				.addField("Role Color", (SelectedRole.color ? "#"+SelectedRole.color.toString(16).toUpperCase() : "N/A"), true)
				.addField("Id", SelectedRole.id, true)

				Message.channel.send(Embed)

		}

	},

	"Random Reacted" : {

		Aliases : ["reacted", "reacter", "reactor", "reaction"],

		Description : "Selects a random person that reacted to the designated message",

		PermissionLevel : 0,

		Arguments : [ [ArgumentType.Message, true, "Target message to check reactions"] ],

		/** @type {cmdCallback} */
		Callback : async function(Message, User, Client, targetMessage){
			let Reactions = targetMessage.reactions.cache.array()
			if(Reactions.length > 0){
				let RandomReaction = Util.RandomChoice(Reactions)
				let AllReactors = await RandomReaction.users.fetch()
				let Reactor = Util.RandomChoice(AllReactors.array())
				
				let Embed = new Discord.MessageEmbed()
					.setTitle("Selected User")
					.setDescription(`**${Reactor.username}#${Reactor.discriminator}**`)
					.setThumbnail(Reactor.displayAvatarURL())
					.addField("Username", Reactor.username, true)
					.addField("Id", Reactor.id, true)
					.addField("Mention", `<@${Reactor.id}>`, true)
					.setColor(0xFF750A)
				
				
					await Message.channel.send(`${Reactor.username}#${Reactor.discriminator} reacted with ${RandomReaction.emoji.toString()}`, Embed)
			} else {
				await Message.channel.send("That message has no reactions!")
			}
		}

	}

}