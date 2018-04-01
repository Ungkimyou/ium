const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const ytdl = require('ytdl-core');
let version = botconfig.version;
let iumics = require("./money.json");
let xp = require("./xp.json");
let coolDown = new Set();
let coolSeconds = 2;

const newUsers = new Discord.Collection();
bot.commands = new Discord.Collection();
let prefix = botconfig.prefix;

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
	  let eventFunction = require(`./commands/${file}`);
	  let eventName = file.split(".")[0];
	  bot.on(eventName, (...args) => eventFunction.run(bot, ...args));
	});
  });
  

bot.on("ready", () => {
	console.log(`${bot.user.username} is online`);
	bot.user.setActivity(`ium help | ${botconfig.version}`);
});

bot.on('ready', () => {
	console.log(`${bot.user.tag} running on ${bot.guilds.size} guilds with ${bot.users.size} users.`);
});

bot.on('warn', console.warn);

bot.on('error', console.error);

bot.on('disconnect', () => console.log('Disconnecting...'));

bot.on('reconnecting', () => console.log('Reconnecting...'));

bot.on("message", message => {
	if (message.author.bot) return;

	//XP and Level System
	let xpAdd = Math.floor(Math.random() * 7) + 8;
	//console.log(xpAdd);
	
	if(!xp[message.author.id]){
	  xp[message.author.id] = {
		xp: 0,
		level: 1
	  };
	}
  
	let curxp = xp[message.author.id].xp;
	let curlvl = xp[message.author.id].level;
	let nxtLvl = xp[message.author.id].level * 100;
	xp[message.author.id].xp =  curxp + xpAdd;
	if(nxtLvl <= xp[message.author.id].xp){
	  xp[message.author.id].level = curlvl + 1;
	  let lvlup = new Discord.RichEmbed()
	  .setTitle("You Leveled Up!")
	  .setColor("#FFFFFF")
	  .addField("New Level", curlvl + 1);
  
	  //message.channel.send(lvlup);
	}
	fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
	  if(err) console.log(err)
	});

	if(message.content.indexOf(botconfig.prefix) !== 0) return;


  	//Prefix + Command
	let args = message.content.slice(botconfig.prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();


	//CoolDown
	if(!message.content.startsWith(prefix)) return;
	if(coolDown.has(message.author.id)){
		message.delete();
		let cooldownEmbed = new Discord.RichEmbed()
		.setAuthor(message.author.username)
		.setColor("#FFFFFF")
		.addField("Cooldown! 🙃", `You must wait **2** seconds between commands.`)
		return message.channel.send(cooldownEmbed).then(message => {message.delete(5000)});
	}
	if(!message.member.hasPermission("ADMINISTRATOR")){
		coolDown.add(message.author.id);
	}


	//Currency
	if(!iumics[message.author.id]){
		iumics[message.author.id] = {
			iumics: 0
		}
	}

	let iumicAmt = Math.floor(Math.random() * 15) + 1;
	let baseAmt = Math.floor(Math.random() * 15) + 1;

	if(iumicAmt === baseAmt){
		iumics[message.author.id] = {
			iumics: iumics[message.author.id].iumics + iumicAmt
		}
	fs.writeFile("./money.json", JSON.stringify(iumics), (err) => {
		if(err) console.log(err)
	});
	let moneyEmbed = new Discord.RichEmbed()
	.setAuthor(message.author.username)
	.setColor("#FFFFFF")
	.addField("💰", `**${iumicAmt}** iumics added!`)
	
	message.channel.send(moneyEmbed).then(message => {message.delete(8000)});

	}

	//Commands
	try {
	  let commandFile = require(`./commands/${command}.js`);
	  commandFile.run(bot, message, args);
	} catch (err) {
	  console.error(err);
	}

	setTimeout(() => {
		coolDown.delete(message.author.id)
	}, coolSeconds * 1000)
});

bot.login(botconfig.token);
