const Discord = require('discord.js')
const fs = require('fs')
const DataManager = require('./DataManager.js')
const ArgTypes = require('./Arguments.js')
const Util = require('./Util.js')

const client = new Discord.Client({
	intents : [Discord.Intents.NON_PRIVILEGED, 'GUILDS', 'GUILD_MEMBERS', 'GUILD_EMOJIS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
})

const Prefix = 'rnd-'

let Commands = {}

fs.readdir("./Commands", (err, files) => {
	if(err){
		throw err
	}

	files.forEach(file => {
		let fileCmds = require('./Commands/'+file)
		for(let name in fileCmds){
			if(Commands[name]){
				console.warn(`Command <${name}> was already registered in another command file.`)
			} else {
				Commands[name] = fileCmds[name]
			}
		}
	})
})

function GetUsageEmbed(Cmd){
	let Usage = Prefix+Util.Capitalize(Cmd.Aliases[0])

	for(let arg of Cmd.Arguments){
		Usage = Usage + " **<"+arg[0].Name+">**"
	}

	let Embed = new Discord.MessageEmbed()
		.setTitle("Command Usage")
		.setDescription(`**${Cmd.Aliases[0]}**\n${Cmd.Description}\n\n**Usage**\n${Usage}`)
		.setColor(0xFF0000)

	return Embed
}

// Events
client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}`)
})

client.on("guildCreate", guild => {
	if(guild.available){
		let channelCache = guild.channels.cache.array()
		for(let channelId in channelCache){
			let channel = channelCache[channelId]
			if(channel.isText()){
				let channelPermissions = channel.permissionsFor(guild.me)
				if(channelPermissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
					channel.send("Thanks for inviting me! The default prefix is `rnd-`. To see a list of my commands, please type `rnd-commands`.")
					break
				}
			}
		}
	}
})

client.on("message", async objMessage => {
	let msg = objMessage.content

	// Checking for a prefix
	let thisPrefix = await DataManager.getPrefixForGuild(objMessage.guild.id)
	if(!thisPrefix){
		thisPrefix = Prefix
	}

	if(msg.toLowerCase() == "rnd-prefix"){ // Check the prefix for the server
		Commands["Prefix"].Callback(objMessage, objMessage.member, client)
	} else if(msg.toLowerCase().substr(0, thisPrefix.length) == thisPrefix){
		if(objMessage.channel instanceof Discord.TextChannel){
			let args = msg.slice(thisPrefix.length).split(' ')
			let command = args.shift().toLowerCase()
			if(command && command != ""){
				for(let cmdName in Commands){
					let cmdData = Commands[cmdName]
					if(cmdData.Aliases.includes(command)){
						// Verifying Permissions
						let userPermission = DataManager.getPermissionLevel(objMessage.member)
						if(userPermission >= cmdData.PermissionLevel){
							// Process the arguments
							let argsValid = true
							let processedArgs = []
							for(let a=0; a < cmdData.Arguments.length; a++){
								let argData = cmdData.Arguments[a]
								if(args[a]){
									if(argData[0] == ArgTypes.LongString || argData[0] == ArgTypes.List){
										let builtString = ""
										for(let l=a; l < args.length; l++){
											builtString = builtString + " " + args[l]
										}
										if(argData[0] == ArgTypes.List){
											let parsedArg = await argData[0].Parse(builtString.trim(), objMessage)
											if(parsedArg != null){
												processedArgs[a] = parsedArg
											} else {
												if(args[1] == true){
													argsValid = false
													break
												}
											}
										} else {
											processedArgs[a] = builtString.trim()
										}
										break
									} else {
										let parsedArg = await argData[0].Parse(args[a], objMessage)
										if(parsedArg != null){
											processedArgs[a] = parsedArg // There might be a hole in the args in some cases
										} else {
											if(argData[1] == true){
												argsValid = false
												break
											}
										}
									}
								} else {
									if(argData[1] == true){
										argsValid = false
										break
									}
								}
							}
							// Execute the command
							if(argsValid){
								cmdData.Callback(objMessage, objMessage.member, client, ...processedArgs)
							} else {
								// Post the usage
								let CmdUsage = GetUsageEmbed(cmdData)
								await objMessage.reply("Invalid Arguments supplied", CmdUsage)
							}
						}
						break
					}
				}
			}
		}
	}
})

setInterval(function(){
	let numGuilds = client.guilds.cache.size
	client.user.setPresence({
		activities : [{
			name : `${numGuilds} servers`,
			type : "WATCHING",
		}]
	})
}, 1000*60)

client.login(process.env.DISCORD_TOKEN || require('./config.js').token)