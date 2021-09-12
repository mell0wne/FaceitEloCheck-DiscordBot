const Discord = require('discord.js');

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const client = new Discord.Client();

const prefix = '.'

client.on('ready', () =>{
    console.log("Bot is online!");
    client.user.setActivity("faceitelocheck.com");
})


client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command.toLowerCase() == 'ping') {
        message.channel.send('pong!');
    }
    else if(command.toLowerCase() == 'website')
    {
        message.channel.send('https://mell0w.net/')
    }
    else if(command.toLowerCase() == 'getelo')
    {

        $.ajax({
            type: "GET",
            url: "https://open.faceit.com/data/v4/players?nickname=" + args[0],
            contentType: 'application/json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer a4132beb-bad8-4078-b7e2-51fe26645e34');
                xhr.setRequestHeader("Content-type","application/json");
                },
                success: function(result) {
                    try {
                        message.channel.send('**Level:** ' + result.games.csgo.skill_level_label + "\n**Elo:** " + result.games.csgo.faceit_elo)
                      }
                      catch(err) {
                        message.channel.send('"' + args[0] + '" not found. :worried: \n **Please note:** The faceit username is case sensitive.')
                      }
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    message.channel.send('"' + args[0] + '" not found. :worried: \n **Please note:** The faceit username is case sensitive.')
                }
        })

    }
    else if(command.toLowerCase() == 'getstats')
    {
        var matchResults = [];

        //Get the Player ID
        $.ajax({
            type: "GET",
            url: "https://open.faceit.com/data/v4/players?nickname=" + args[0] ,
            contentType: 'application/json',
            beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer a4132beb-bad8-4078-b7e2-51fe26645e34');
            xhr.setRequestHeader("Content-type","application/json");
            },
            success: function (result) {
                $.ajax({
                    type: "GET",
                    url: "https://open.faceit.com/data/v4/players/" + result.player_id + "/stats/csgo",
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer a4132beb-bad8-4078-b7e2-51fe26645e34');
                        xhr.setRequestHeader("Content-type","application/json");
                        },
                        success: function(result) {
                            try {
                                
                                for(i = 0; i < 5; i++)
                                {
                                    if(result.lifetime["Recent Results"][i] === "1")
                                    {
                                        matchResults[i] = ":white_check_mark:"
                                    }
                                    else {
                                        matchResults[i] = ":x:"
                                    }
                                }
                                message.channel.send('**K/D:**   ' + result.lifetime["Average K/D Ratio"] + "\n**HS:**   " + result.lifetime["Average Headshots %"] + "%" + "\n**Winrate:**   " + result.lifetime["Win Rate %"] + "%" + "\n**Longest win streak:**   " + result.lifetime["Longest Win Streak"] + "\n**Matches played:**   " + result.lifetime["Matches"] + "\n**Recent results:**   " + matchResults[0] + " " + matchResults[1] + " " + matchResults[2] + " " + matchResults[3] + " " + matchResults[4])
                              }
                              catch(err) {
                                message.channel.send('"' + args[0] + '" not found. :worried: \n **Please note:** The faceit username is case sensitive.')
                              }
                            
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            message.channel.send('"' + args[0] + '" not found. :worried: \n **Please note:** The faceit username is case sensitive.')
                        }
                })
                
            },
        });
        
    }
    else {
        message.channel.send('Command `' + command + '` not found.')
    }

})

client.login('Add you Discord Token here');
