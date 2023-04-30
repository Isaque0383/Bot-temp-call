const Discord = require('discord.js')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const client = new Discord.Client({intents: 32767});
const config = require("./config.json"); 

require('node:http')
  .createServer((_, res) =>
    res.end(
      `Developed by DIWAS ATREYA | SAINTS `,
    ),
  )
  .listen(8080);

client.on("voiceStateUpdate", async (oldState, newState) => {


let sim =await db.get(`stats_${oldState.guild.id}`)
if(sim == null) sim = 0

if(sim == 1) {

    let channel = oldState.channelId || newState.channelId
    let dl = await db.get(`canal_${oldState.guild.id}_${channel}`)
    if(dl == null) return
}
if(newState.channelId == null) {

 
    let c = await db.get(`${newState.member.id}_${oldState.guild.id}_new`)
    let l = await db.get(`${newState.member.id}_${oldState.guild.id}_c`)
    if(!c) return
    if(l == 0) {

     
let data = new Date().getTime()

let k = Math.abs(c - data)

let q = Math.ceil(k / 1000)

console.log(q)
await db.set(`${newState.member.id}_${oldState.guild.id}_c`,2)
await db.set(`${newState.member.id}_${oldState.guild.id}_new`,0)

return await db.add(`${newState.member.id}_${oldState.guild.id}_total`,q)
    }
}


if(oldState.channelId == null) {

    let data = new Date()
    await db.set(`${newState.member.id}_${oldState.guild.id}_c`, 0)
    return await db.set(`${newState.member.id}_${oldState.guild.id}_new`, Date.now())
} 

if(newState.selfMute === true) {
    let c = await db.get(`${newState.member.id}_${oldState.guild.id}_new`)
    let l = await db.get(`${newState.member.id}_${oldState.guild.id}_c`)
    if(!c) return
    if(l === 0) {
  

let data = new Date().getTime()

let k = Math.abs(c - data)

let q = Math.ceil(k / 1000)

console.log(q)

await db.add(`${newState.member.id}_${oldState.guild.id}_total`,q)

    

    }

    await db.set(`${newState.member.id}_${oldState.guild.id}_c`, 1)
    return await db.set(`${newState.member.id}_${oldState.guild.id}_new`,0)

}
if(    newState.selfMute === false) {

    await db.set(`${newState.member.id}_${oldState.guild.id}_c`, 0)
    return await db.set(`${newState.member.id}_${oldState.guild.id}_new`,Date.now())
} 



})

process.on('multipleResolves', (type, reason, promise) => {
    console.log(`🚫 Erro Detectado\n\n` + type, promise, reason)
});
process.on('unhandRejection', (reason, promise) => {
    console.log(`🚫 Erro Detectado:\n\n` + reason, promise)
});
process.on('uncaughtException', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});

client.on('guildMemberAdd', async (member) => {

    let canalboa = db.get(`boasvindachannel_${member.guild.id}`)
    if (canalboa === null) return;
  
    let embed = new Discord.MessageEmbed()
    .setDescription(`<:ablack_vermei:1074390481603133540> **Eae ${member.user}, seja bem-vindo ja da uma passada no <#1074322670079975514> pra se registrar e claro le as regras <#1074322664426053632>** <:ablack_vermei:1074390481603133540>`)
    .setColor('BLACK')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
  
    member.guild.channels.cache.get(canalboa).send({content: `${member.user}`, embeds: [embed] }).catch(e => {})
    
}) 

client.login(config.token); 

client.once('ready', async () => {

    console.log("✅ - Estou online!")

})


client.on('messageCreate', message => {
     if (message.author.bot) return;
     if (message.channel.type == 'dm') return;
     if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
     if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(config.prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {
    console.error('Erro:' + err);
  }
})
