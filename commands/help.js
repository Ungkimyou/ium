const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
    const serverEmbed = new Discord.RichEmbed()
    .setColor('#ffffff')
    .addField("Commands", "Prefix: **ium **")
    .addField("Info", "define, avatar, ping, xp")
    .addField("Bot Info", "discord, invite, info, dev, version, ium, stats")
    .addField("Moderation", "ban, kick, mute, unmute, report")
    .addField("Fun", "dog, 8ball, choose, say, money, pay, mock, reverse, furry, bond, wave, rate")
    .addField("scale, search, announce, weather, hastebin, translate")
    .addField("ium", "We are constantly adding more and more commands to make this bot much better.");

    return message.channel.send(serverEmbed);
}
