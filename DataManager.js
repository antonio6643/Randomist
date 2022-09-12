const Discord = require('discord.js')
const mongoose = require('mongoose')

const _useLocalStorage = true;
let _storage = [];

let DAILY_AMOUNT = 1000
let epoch = new Date()

let dbString = process.env.DBString || require('./config.js').dbPassword

mongoose.connect(dbString, {
	useNewUrlParser : true,
	useUnifiedTopology : true
})

/**
 * Get the PermissionLevel of the specified GuildMember.
 * @param {Discord.GuildMember} Member 
 */
module.exports.getPermissionLevel = function(Member){
	let GuildId = Member.guild.id
	if(Member.id == "152144229936660482"){ // me
		return 6643
	} else {
		if(Member.guild.ownerID == Member.id){
			return 2 // Server Owner
		} else if(Member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){ // TODO: Custom Administrator roles
			return 1 // Administrator
		}
		return 0
	}
}

// * Economy Commands
const Profile = require('./Models/Profile.js')

/**
 * Retrieves the profile information for the designated user
 * @param {Discord.GuildMember} target 
 */
module.exports.getProfileData = async function(target){
	return new Promise(function(resolve, reject){
		let targetId = target.id
		let serverId = target.guild.id

		Profile.findOne({
			userid : targetId
		}, (err, data) => {
			if(err) {
				console.error(err)
				reject(err)
			}

			if(data){
				resolve({ balance : data.balances.get(serverId), xp : data.xp })
			} else { // * Only create a profile if they gain money
				resolve({ balance : 0, xp : 0, existed : false })
			}
		})
	})
}

/**
 * Add Rand to the player's database profile
 * @param {Discord.GuildMember} target 
 * @param {Number} amount 
 */
module.exports.addRand = async function(target, amount){
	return new Promise(function(resolve, reject){
		let targetId = target.id
		let serverId = target.guild.id

		if(amount <= 0){
			reject("Amount must be a positive number")
		}

		Profile.findOne({
			userid : targetId
		}, (err, data) => {
			if(err){
				reject(err)
			}

			if(data){
				let currentMoney = data.balances.get(serverId) || 0
				currentMoney = currentMoney + amount
				data.balances.set(serverId, currentMoney)
				data.save().catch(err => reject(err)).then( () => {
					resolve({ balance : currentMoney, xp : data.xp })
				})
			} else {
				console.log(`Creating profile for ${targetId}`)
				let knuProfile = new Profile({
					userid : targetId,
					balances : {},// balances would go here
				})
				knuProfile.balances.set(serverId, amount)
				knuProfile.save().catch(err => reject(err)).then( () => {
					resolve({ balance : amount, xp : 0 })
				})
			}
		})
	})
}

/**
 * Remove Rand from the player's database profile
 * @param {Discord.GuildMember} target 
 * @param {Number} amount 
 */
module.exports.removeRand = async function(target, amount){
	return new Promise(function(resolve, reject){
		let targetId = target.id
		let serverId = target.guild.id

		if(amount <= 0){
			reject("Amount must be a positive number")
		}

		Profile.findOne({
			userid : targetId
		}, (err, data) => {
			if(err){
				reject(err)
			}

			if(data){
				let currentMoney = data.balances.get(serverId) || 0
				currentMoney = Math.max(currentMoney - amount, 0)
				data.balances.set(serverId, currentMoney)
				data.save().catch(err => reject(err)).then( () => {
					resolve({ balance : currentMoney, xp : data.xp })
				})
			} else {
				console.log(`${targetId} has no money to lose`)
				resolve({ balance : 0, xp : 0, existed : false })
			}
		})
	})
}

/**
 * Sets <target>'s Rand to <amount>.
 * @param {Discord.GuildMember} target 
 * @param {Number} amount 
 */
module.exports.setRand = async function(target, amount){
	return new Promise(function(resolve, reject){
		let targetId = target.id
		let serverId = target.guild.id

		Profile.findOne({
			userid : targetId
		}, (err, data) => {
			if(err){
				reject(err)
			}

			if(data){
				data.balances.set(serverId, amount)
				data.save().catch(err => reject(err)).then( () => {
					resolve({ balance : amount, xp : data.xp })
				})
			} else {
				console.log(`Creeating profile for ${targetId}`)
				let knuProfile = new Profile({
					userid : targetId,
					balances : {},// balances would go here
				})
				knuProfile.balances.set(serverId, amount)
				knuProfile.save().catch(err => reject(err)).then( () => {
					resolve({ balance : amount, xp : 0 })
				})
			}
		})
	})
}

/**
 * Redeems the daily bonus for the designated GuildMember.
 * Does nothing if the daily has already been redeemed for that guild.
 * @param {Discord.GuildMember} member 
 */
module.exports.redeemDaily = function(member){
	return new Promise(function(resolve, reject){
		let targetId = member.id
		let serverId = member.guild.id

		Profile.findOne({
			userid:  targetId
		}, (err, data) => {
			if(err){
				reject(err)
			}

			if(data){
				let now = Date.now()
				let lastDaily = data.dailys.get(serverId) || epoch
				let diffSec = (now - lastDaily) / 1000
				let diffHrs = Math.floor( diffSec / 3600 )
				let diffMins = Math.floor( (diffSec % 3600) / 60 )
				if(diffHrs >= 24){
					let currentMoney = data.balances.get(serverId) || 0
					let knuMoney = currentMoney + DAILY_AMOUNT
					data.balances.set(serverId, knuMoney)
					data.dailys.set(serverId, now)
					data.save().catch(err => reject(err)).then(() => {
						resolve({ balance : knuMoney, xp : data.xp })
					})
				} else {
					let hoursRemaining = 23-diffHrs
					let minsRemaining = 59-diffMins
					reject(`You must wait ${hoursRemaining} and ${minsRemaining} minute${minsRemaining != 1 ? "s" : ""} to redeem your daily.`)
				}
			} else {
				console.log(`Creating profile for ${targetId}`)
				let knuProfile = new Profile({
					userid : targetId,
					balances : {},
					dailys : {}
				})
				knuProfile.balances.set(serverId, DAILY_AMOUNT)
				knuProfile.dailys.set(serverId, Date.now())
				knuProfile.save().catch(err => reject(err)).then( () => {
					resolve({ balance : DAILY_AMOUNT, xp : 0 })
				})
			}
		})
	})
}

// Guild Commands
const Server = require("./Models/Server.js")

module.exports.getPrefixForGuild = function(guildId){
	return new Promise(function(resolve, reject){
		Server.findOne({
			serverId : guildId
		}, (err, data) => {
			if(err){
				reject(err)
			}

			if(data){
				resolve(data.prefix)
			} else {
				resolve(null)
			}
		})
	})
}

module.exports.setPrefixForGuild = function(guildId, knuPrefix){
	return new Promise(function(resolve, reject){
		Server.findOne({
			serverId : guildId
		}, (err, data) => {
			if(err){
				reject(err)
			}

			if(data){
				data.prefix = knuPrefix
				data.save().catch(err => reject(err)).then( () => {
					resolve()
				})
			} else {
				console.log("Creating knu guild profile for "+guildId)
				let knuServer = new Server({
					serverId : guildId,
					prefix : knuPrefix,
				})

				knuServer.save().catch(err => reject(err)).then( () => {
					resolve()
				})
			}
		})
	})
}