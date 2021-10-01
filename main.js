const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json')
const express = require('express');
const app = express();

// Keep Alive

app.listen(() => console.log('Broadcast'));
app.use('/ping', (req, res) => {
    res.send(new Date());
});

// Console

client.on("ready", () => {

    console.log(`Logged in as: ${client.user.tag}`);
    console.log(`-> Servers / Members: ${client.guilds.cache.size} server / ${client.users.cache.size} member`);

});

// Staus Bot

client.on('ready', async () => {
    client.user.setStatus('');
    client.user.setActivity(
        `X4U Broadcast`,
        { type: 'PLAYING' }
    ); 
});

// Config 


let prefix = config.Prefix;

let owners = config.owners;

let timeS = config.Time

let vip = config.Vip

// Spefic Server

client.on('guildCreate',async (guild) =>{
  if (vip.includes (guild.id)) return;
  else guild.leave();
})

client.on(`ready`, () => {
client.guilds.cache.forEach(guild => {
if (vip.includes (guild.id)) return;
else guild.leave();
});
});

// Timeout Function

const timeIIa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

client.on("message", async message => {

    if (!message.channel.guild) return;

    if (message.content === prefix + "bc") {

        if (owners.includes(message.author.id)) {

            let loading = new Discord.MessageEmbed()

                .setTitle("X4U GAMERS")
                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                .setColor(message.member.roles.highest.hexColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .addField("Loading . . .", "Loading . . .")
                .addField("Loading . . .", "Loading . . .")
                .addField("Loading . . .", "Loading . . .")
                .addField("Loading . . .", "**Loading . . .**")
                .setFooter("BY X4U TEAM")

            let embed = new Discord.MessageEmbed()

                .setTitle("X4U GAMERS")
                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                .setColor(message.member.roles.highest.hexColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .addField("🟢", "Send to online members **only** `[ " + message.guild.members.cache.filter(m => m.presence.status === "dnd" || m.presence.status === "idle" || m.presence.status === "online" && !m.user.bot).size + " ] member`")
                .addField("🟠", "Send to **role** members")
                .addField("🔵", "Send to **all** members `[ " + message.guild.memberCount + " ] member`")
                .addField("❌", "**Cancel**")
                .setFooter("BY X4U TEAM")

            message.channel.send(loading).then(async (m) => {

                await m.react("🟢");
                await m.react("🟠");
                await m.react("🔵")
                await m.react("❌").then(() => {

                    m.edit(embed);

                })

                let ReactionFilter = (r, user) => {
                    return user.id === message.author.id && ["🟢", "🟠", "🔵", "❌"].includes(r.emoji.name);
                };
                let ReactionCollector = m.createReactionCollector(ReactionFilter, { time: 15000 });

                ReactionCollector.on("collect", re => {

                    if (re.emoji.name === "❌") {

                        m.delete({ timeout: 150 });
                        message.channel.send(`**:x: Canceled by: ${message.member}**`)

                        return;
                    }

                    if (re.emoji.name === "🔵") {

                        m.reactions.removeAll();

                        ReactionCollector.stop("Done2");

                    } else if (re.emoji.name === "🟢") {

                        m.reactions.removeAll();

                        ReactionCollector.stop("Done1");

                    } else if (re.emoji.name === "🟠") {

                        m.reactions.removeAll();

                        ReactionCollector.stop("Done3");

                    }

                });

                ReactionCollector.on("end", async (col, reason) => {

                    if (reason === "Done1") {

                        //Online only

                        let msgEmbed = new Discord.MessageEmbed()

                            .setTitle("X4U GAMERS")
                            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                            .setColor(message.member.roles.highest.hexColor)
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            .setDescription(":white_check_mark:** | Write your message.**")
                            .setFooter("BY X4U TEAM")

                        m.edit(msgEmbed).then(() => {


                            let MsgFilter = m => m.author.id === message.author.id;

                            let MsgCollector = m.channel.createMessageCollector(MsgFilter, { time: 60000, max: 1 });

                            MsgCollector.on("collect", msg => {

                                let SureEmbed = new Discord.MessageEmbed()

                                    .setTitle("Are you sure you want to send this message ?")
                                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                    .setColor(message.member.roles.highest.hexColor)
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    .setDescription(msg.content)
                                    .setFooter("BY X4U TEAM")

                                msg.delete({ timeout: 500 });
                                m.delete({ timeout: 500 });

                                msg.channel.send(SureEmbed).then(async (mSure) => {


                                    await mSure.react("✅");
                                    await mSure.react("❌");

                                    let ReactionFilter = (r, user) => {

                                        return user.id === message.author.id && ["✅", "❌"].includes(r.emoji.name);

                                    }

                                    let ReactionCollector = mSure.createReactionCollector(ReactionFilter, { time: 15000 });

                                    ReactionCollector.on("collect", r => {

                                        if (r.emoji.name === "✅") {


                                            mSure.reactions.removeAll();
                                            ReactionCollector.stop("Done1" + msg.content);

                                        } else if (r.emoji.name === "❌") {

                                            mSure.reactions.removeAll();

                                            ReactionCollector.stop("Done2");

                                        }

                                    })

                                    ReactionCollector.on("end", async (col, reason) => {

                                        if (reason.startsWith("Done1")) {

                                            let msg = reason.replace("Done1", "");

                                            //Send


                                            let sendEmbed = new Discord.MessageEmbed()
                                                .setTitle("X4U GAMERS")
                                                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                .setColor(message.member.roles.highest.hexColor)
                                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                .setDescription(`:white_check_mark: **| Sending... | All Members: ${message.guild.members.cache.filter(m => m.presence.status === "dnd" || m.presence.status === "idle" || m.presence.status === "online" && !m.user.bot).size}**`)
                                                .setFooter("BY X4U TEAM")

                                            mSure.edit(sendEmbed);

                                            let members = message.guild.members.cache.filter(m => m.presence.status === "dnd" || m.presence.status === "idle" || m.presence.status === "online" && !m.user.bot).array();


                                            for (var i = 0; i < members.length; i++) {

                                                try {

                                                    await members[i].send(msg) // Send Message;

                                                    await timeIIa(timeS);


                                                } catch {

                                                }

                                            }

                                            setInterval(() => {

                                                let edddd = new Discord.MessageEmbed()
                                                    .setTitle("X4U GAMERS")
                                                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                    .setColor(message.member.roles.highest.hexColor)
                                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                    .setDescription(`:white_check_mark: **| Sending... | All Members: ${message.guild.members.cache.filter(m => m.presence.status === "dnd" || m.presence.status === "idle" || m.presence.status === "online" && !m.user.bot).size}**`)
                                                    .setFooter("BY X4U TEAM")

                                                mSure.edit(edddd);

                                            }, 1 * 10000);

                                        } else if (reason === "Done2") {

                                            //Cancel

                                            let cancelEmbed = new Discord.MessageEmbed()
                                                .setTitle("X4U GAMERS")
                                                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                .setColor(message.member.roles.highest.hexColor)
                                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                .setDescription(":x:** | Canceled.**")
                                                .setFooter("BY X4U TEAM")

                                            mSure.edit(cancelEmbed);
                                            mSure.reactions.removeAll();

                                        } else if (!reason.startsWith("Done1") && !reason.startsWith("Done2")) {

                                            let timeoutEmbed = new Discord.MessageEmbed()
                                                .setTitle("X4U GAMERS")
                                                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                .setColor(message.member.roles.highest.hexColor)
                                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                .setDescription(":x:** | Reaction timeout.**")
                                                .setFooter("BY X4U TEAM")


                                            mSure.reactions.removeAll();
                                            mSure.edit(timeoutEmbed);

                                        }



                                    })


                                })

                            });

                            MsgCollector.on("end", async (ccol, reason) => {


                            });

                        })

                    } else if (reason === "Done2") {

                        //All

                        let msgEmbed = new Discord.MessageEmbed()

                            .setTitle("X4U GAMERS")
                            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                            .setColor(message.member.roles.highest.hexColor)
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            .setDescription(":white_check_mark:** | Write your message.**")
                            .setFooter("BY X4U TEAM")

                        m.edit(msgEmbed).then(() => {

                            let MsgFilter = m => m.author.id === message.author.id;
                            let MsgCollector = m.channel.createMessageCollector(MsgFilter, { time: 60000, max: 1 });

                            MsgCollector.on("collect", msg => {

                                let SureEmbed = new Discord.MessageEmbed()

                                    .setTitle("Are you sure you want to send this message ?")
                                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                    .setColor(message.member.roles.highest.hexColor)
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    .setDescription(msg.content)
                                    .setFooter("BY X4U TEAM")

                                msg.delete({ timeout: 500 });
                                m.delete({ timeout: 500 });

                                msg.channel.send(SureEmbed).then(async (mSure) => {

                                    await mSure.react("✅");
                                    await mSure.react("❌");

                                    let ReactionFilter = (r, user) => {

                                        return user.id === message.author.id && ["✅", "❌"].includes(r.emoji.name);

                                    }
                                    let ReactionCollector = mSure.createReactionCollector(ReactionFilter, { time: 15000 });

                                    ReactionCollector.on("collect", r => {

                                        if (r.emoji.name === "✅") {


                                            mSure.reactions.removeAll();
                                            ReactionCollector.stop("Done1" + msg.content);

                                        } else if (r.emoji.name === "❌") {

                                            mSure.reactions.removeAll();

                                            ReactionCollector.stop("Done2");

                                        }

                                    })

                                    ReactionCollector.on("end", async (col, reason) => {


                                        if (reason.startsWith("Done1")) {

                                            let msg = reason.replace("Done1", "");

                                            //Send

                                            let sendEmbed = new Discord.MessageEmbed()
                                                .setTitle("X4U GAMERS")
                                                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                .setColor(message.member.roles.highest.hexColor)
                                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                .setDescription(`:white_check_mark: **| Sending... | All Members: ${message.guild.members.cache.filter(m => !m.user.bot).size}**`)
                                                .setFooter("BY X4U TEAM")

                                            mSure.edit(sendEmbed);

                                            let members = message.guild.members.cache.filter(m => !m.user.bot).array();

                                            for (var i = 0; i < members.length; i++) {

                                                try {

                                                    await members[i].send(msg) // Send Message;

                                                    await timeIIa(timeS);


                                                } catch {

                                                }

                                            }



                                            setInterval(() => {

                                                let edddd = new Discord.MessageEmbed()
                                                    .setTitle("X4U GAMERS")
                                                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                    .setColor(message.member.roles.highest.hexColor)
                                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                    .setDescription(`:white_check_mark: **| Sending... | All Members: ${message.guild.memberCount}**`)
                                                    .setFooter("BY X4U TEAM")

                                                mSure.edit(edddd);

                                            }, 1 * 10000);

                                        } else if (reason === "Done2") {

                                            //Cancel

                                            let cancelEmbed = new Discord.MessageEmbed()
                                                .setTitle("X4U GAMERS")
                                                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                .setColor(message.member.roles.highest.hexColor)
                                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                .setDescription(":x:** | Canceled.**")
                                                .setFooter("BY X4U TEAM")

                                            mSure.reactions.removeAll();
                                            mSure.edit(cancelEmbed);


                                        } else if (!reason.startsWith("Done1") && !reason.startsWith("Done2")) {

                                            let timeoutEmbed = new Discord.MessageEmbed()
                                                .setTitle("X4U GAMERS")
                                                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                .setColor(message.member.roles.highest.hexColor)
                                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                .setDescription(":x:** | Reaction timeout.**")
                                                .setFooter("BY X4U TEAM")

                                            mSure.reactions.removeAll();
                                            mSure.edit(timeoutEmbed);

                                        }



                                    })


                                })

                            });

                            MsgCollector.on("end", reason => {


                            });
                        })

                    } else if (reason === "Done3") {

                        //Role

                        message.channel.send("🟠 **| Mention the role: **").then((rmm) => {

                            let MsgFilter = m => m.author.id === message.author.id;
                            let MsgCollector = rmm.channel.createMessageCollector(MsgFilter, { time: 60000, max: 1 });

                            MsgCollector.on("collect", msg => {

                                let role = msg.mentions.roles.first();

                                if (role) {

                                    rmm.delete({ timeout: 150 });
                                    msg.delete({ timeout: 150 })
                                    let msgEmbed = new Discord.MessageEmbed()

                                        .setTitle("X4U GAMERS")
                                        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                        .setColor(message.member.roles.highest.hexColor)
                                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                        .setDescription(":white_check_mark:** | Write your message.**")
                                        .setFooter("BY X4U TEAM")

                                    m.edit(msgEmbed).then(() => {

                                        let MsgFilter = m => m.author.id === message.author.id;
                                        let MsgCollector = m.channel.createMessageCollector(MsgFilter, { time: 60000, max: 1 });

                                        MsgCollector.on("collect", msg => {

                                            let SureEmbed = new Discord.MessageEmbed()

                                                .setTitle("Are you sure you want to send this message ?")
                                                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                .setColor(message.member.roles.highest.hexColor)
                                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                .setDescription(msg.content)
                                                .setFooter("BY X4U TEAM")

                                            msg.delete({ timeout: 500 });
                                            m.delete({ timeout: 500 });

                                            msg.channel.send(SureEmbed).then(async (mSure) => {

                                                await mSure.react("✅");
                                                await mSure.react("❌");

                                                let ReactionFilter = (r, user) => {

                                                    return user.id === message.author.id && ["✅", "❌"].includes(r.emoji.name);

                                                }
                                                let ReactionCollector = mSure.createReactionCollector(ReactionFilter, { time: 15000 });

                                                ReactionCollector.on("collect", r => {

                                                    if (r.emoji.name === "✅") {


                                                        mSure.reactions.removeAll();
                                                        ReactionCollector.stop("Done1" + msg.content);

                                                    } else if (r.emoji.name === "❌") {

                                                        mSure.reactions.removeAll();

                                                        ReactionCollector.stop("Done2");

                                                    }

                                                })

                                                ReactionCollector.on("end", async (col, reason) => {

                                                    if (reason.startsWith("Done1")) {

                                                        let msg = reason.replace("Done1", "");

                                                        //Send


                                                        let sendEmbed = new Discord.MessageEmbed()
                                                            .setTitle("X4U GAMERS")
                                                            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                            .setColor(message.member.roles.highest.hexColor)
                                                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                            .setDescription(`:white_check_mark: **| Sending... | All Members: ${message.guild.members.cache.filter(m => m.roles.cache.find(r => r.id === role.id) && !m.user.bot).size}**`)
                                                            .setFooter("BY X4U TEAM")

                                                        mSure.edit(sendEmbed);

                                                        let members = message.guild.members.cache.filter(m => m.roles.cache.find(r => r.id === role.id) && !m.user.bot).array();


                                                        for (var i = 0; i < members.length; i++) {

                                                            try {

                                                                await members[i].send(msg) // Send Message;

                                                                await timeIIa(timeS);


                                                            } catch {

                                                            }

                                                        }

                                                        setInterval(() => {

                                                            let edddd = new Discord.MessageEmbed()
                                                                .setTitle("X4U GAMERS")
                                                                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                                .setColor(message.member.roles.highest.hexColor)
                                                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                                .setDescription(`:white_check_mark: **| Sending... | All Members: ${message.guild.members.cache.filter(m => m.roles.cache.find(r => r.id === role.id) && !m.user.bot).size}**`)
                                                                .setFooter("BY X4U TEAM")

                                                            mSure.edit(edddd);

                                                        }, 1 * 10000);

                                                    } else if (reason === "Done2") {

                                                        //Cancel

                                                        let cancelEmbed = new Discord.MessageEmbed()
                                                            .setTitle("X4U GAMERS")
                                                            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                            .setColor(message.member.roles.highest.hexColor)
                                                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                            .setDescription(":x:** | Canceled.**")
                                                            .setFooter("BY X4U TEAM")

                                                        mSure.reactions.removeAll();
                                                        mSure.edit(cancelEmbed);

                                                    } else if (!reason.startsWith("Done1") && !reason.startsWith("Done2")) {

                                                        let timeoutEmbed = new Discord.MessageEmbed()
                                                            .setTitle("X4U GAMERS")
                                                            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                                                            .setColor(message.member.roles.highest.hexColor)
                                                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                                            .setDescription(":x:** | Reaction timeout.**")
                                                            .setFooter("BY X4U TEAM")

                                                        mSure.reactions.removeAll();
                                                        mSure.edit(timeoutEmbed);

                                                    }



                                                })


                                            })

                                        });

                                        MsgCollector.on("end", reason => {


                                        });
                                    })

                                } else {

                                    MsgCollector.stop();
                                    rmm.edit(":x: ** | Bad answer.**")
                                }

                            });

                        })


                    } else if (reason != "Done1" && reason != "Done2" && reason != "Done3") {

                        let timeoutEmbed = new Discord.MessageEmbed()

                            .setTitle("X4U GAMERS")
                            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                            .setColor(message.member.roles.highest.hexColor)
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            .setDescription(":x:** | Reaction timeout**")
                            .setFooter("BY X4U TEAM")

                        m.reactions.removeAll();
                        m.edit(timeoutEmbed);

                    }

                })

            })

        }

    }

});

client.login(process.env.TOKEN);
