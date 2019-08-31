{
    const botName = 'X-Bot';
    const botVersion = '10.0.6';
    const botDescript = 'Personal-Bot for the Xeniour\'s';
    const {Client, Attachment} = require('discord.js');
    const Discord = require('discord.js');
    const bot = new Client();
    const PREFIX = '~';
    const rulesAndReg = 'Please be Generous and polite to Other Members of this Server and Do not use slangs and such Disrespectful Words the consequences of this will result in Permenent Mute or Ban';

    const token = 'NjE2MjA4NTc3MDIzMTgwODEy.XWjQZA.LJ6CHqEQ-0RCmp4OrBC1UqROXxY';

    const cooldown_help = new Set();
    const cooldown_invite = new Set();

    bot.on('ready',()=>{
        console.log("X-Bot is Online now...");
        bot.user.setActivity('NETFLIX',{type : 'WATCHING'}).catch(console.error);
    });

    bot.on('message',(msg)=>{
       let command = msg.content.substring(PREFIX.length).split(" ");
       switch(command[0]){
            case 'help':
                generateHelp(msg);
                break; 
            case 'info':
                msg.channel.send("Name : " + botName +"\nVersion : " + botVersion + "\nDescription : " + botDescript).then(msg => msg.delete(4000));
                break;
            case 'profile':
                generateProfile(msg);
                break;
            case 'del':
                delMessages(msg);
                break;
            case 'generate':
                if(!command[1]) {
                    return;
                }else{
                    if(command[1] === 'brickball')
                    {
                        const ballgame = new Attachment("//Users//king//BallBreakout.jar");
                        msg.channel.send(msg.author,ballgame).then(msg=>msg.delete(60000));
                    }
                }
                break;
            case 'invitation':
                if(!cooldown_invite.has(msg.member.id)) 
                {
                    replyWithInvite(msg);
                    cooldown_invite.add(msg.author.id);
                    setTimeout(()=>{
                        cooldown_invite.delete(msg.author.id)
                    },120000);
                }
                else{
                    msg.reply('Cannot Spam Commands you are on a 30 seconds cooldown')
                    .then(msg=>msg.delete(5000));
                }
                break;
            default:
                break;
            
       }
    });


    bot.on('guildMemberAdd',(member)=>{
        const channel0 = member.guild.channels.find(chan=>chan.name === 'greetings');
        const channel1 = member.guild.channels.find(ch=>ch.name === 'info-and-rules');
        if(!channel0) return;
        channel0.send(`Welcome ${member} to The XENIOUR's Den,Read The Rules and Regulation Carefully`);
        if(!channel1) return;
        const embedRules = new Discord.RichEmbed();
        embedRules.setTitle('Rules And Regulation')
        .setColor(0x01c701)
        .setThumbnail(member.guild.icon)
        .addField(rulesAndReg);
        channel1.send(embedRules);
    });

    bot.login(process.env.BOT_TOKEN);


    async function replyWithInvite(message){
        let invite = await message.channel.createInvite({
            maxAge : 30000,
            maxUses : 3
        }, `Requested by ${message.author.username}`).catch(console.error);
        message.reply(invite ? `Requested an Invite: ${invite}` : "There has been an error during the creation of the invite.").then(msg=>msg.delete(30000));
        
    }

    function generateProfile(msg){
        let embed = new Discord.RichEmbed();
        embed.setTitle('User Profile');
        embed.addField('Server Name:',msg.guild.name);
        embed.addField('Member Name: ',msg.author.username);
        embed.setThumbnail(msg.author.avatarURL);
        embed.setImage(msg.guild.iconURL);
        embed.setColor(msg.member.highestRole.color);
        msg.channel.send(embed).then(msg=> msg.delete(7000));
    }

    function generateHelp(msg){
        if(!cooldown_help.has(msg.author.id)){
            const commandList = new Discord.RichEmbed();
            commandList.setTitle("Commands For X-BOT")
            .setColor(msg.member.highestRole.color)
            .addField("~help","Show\'s list of All the Command X-Bot can understand")
            .addField('~info', 'Show the Version and Description of the X-Bot')
            .addField('~del','\(number\): delete Messages in the current channel<Admin & Moderator Only>')
            .addField('~profile','Show your Current Profile Info')
            .addField('~generate \(filename\)','To Generate a File stored in the Server')
            .addField('~invitation','This Command will generate an Invitation For the Server');
            msg.reply(commandList).then(msg => msg.delete(20000));
            cooldown_help.add(msg.author.id);
            setTimeout(()=>{
                cooldown_help.delete(msg.author.id);
            }, 20000);
        }else{
            msg.reply('Cannot Spam Commands you are on a 20 seconds cooldown').then(msg=>msg.delete(5000));
        }
    }

    function delMessages(msg){
        if((msg.member.roles.find(r => r.name === 'Administrator')) || (msg.member.roles.find(r => r.name === 'Moderator'))){
            if(!command[1]){
                msg.channel.bulkDelete(2).catch(console.error);
            }else{
                msg.channel.bulkDelete(command[1]).catch(console.error);
            }
        }else{
            return msg.reply('Command Require Administrator privileges').then(msg => msg.delete(5000));
        }
    }

}
