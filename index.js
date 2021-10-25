// Discord.js Library
const Discord = require("discord.js")
// Node-fetch Library to get data from external apis.
const fetch = require("node-fetch")
// Replit Database
const Database = require("@replit/database")
// Importing server.js to keep it alive.
const keepAlive = require("./server.js")
// Youtube video streaming liberary to play songs
const ytdl = require('ytdl-core');
// Youtube search library to search songs on YT.
const yts = require("yt-search");


// created an instance of Database
const db = new Database()
// created an instance of Discord client
const client = new Discord.Client()
// Server Name on which the ready function will work on.
const SERVER_NAME = "BOIs"
// Channel Name on which the ready function will work on.
const CHANNEL_NAME = "bois-chet"
// queue to hold songs 
const queue = new Map();

// Json which hold Bois Birthdays.
const boiBirthdays = {
  "data" : [
    {
      "name": "Dhote",
      "bdayday": "04",
      "bdaymonth": "02",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Snehaj",
      "bdayday": "18",
      "bdaymonth": "02",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Milind",
      "bdayday": "21",
      "bdaymonth": "02",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Aseem",
      "bdayday": "01",
      "bdaymonth": "03",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Shashwat",
      "bdayday": "11",
      "bdaymonth": "04",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Virat",
      "bdayday": "09",
      "bdaymonth": "05",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Anish",
      "bdayday": "04",
      "bdaymonth": "08",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Varun",
      "bdayday": "25",
      "bdaymonth": "08",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Abhishek",
      "bdayday": "10",
      "bdaymonth": "09",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Raghu",
      "bdayday": "24",
      "bdaymonth": "09",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "Pranav",
      "bdayday": "03",
      "bdaymonth": "10",
      "bdayDoneForYear": "2021"
    },
    {
      "name": "KD",
      "bdayday": "22",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Raj",
      "bdayday": "25",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Maheshwari",
      "bdayday": "04",
      "bdaymonth": "11",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Taori",
      "bdayday": "20",
      "bdaymonth": "12",
      "bdayDoneForYear": "2020"
    }
  ]
}

// To be removed in actual server
//db.delete("birthdays7").then(() => {});

/**
 * Function to set bdays in the database if the key is not already        present.
 */
function setBdays() {
  db.get("birthdays7").then(birthdays7 => {
    if (!birthdays7 || birthdays7.length < 1) {
      db.set("birthdays7", boiBirthdays)
        console.log("Birthdays db was empty or non-existing but not anymore!")
    }
  })
}

/**
 * Initial message embed if need to use later on.
 */
const initialMessageEmbed = new Discord.MessageEmbed()
	.setColor('#ff5733 ')
	.setTitle('BOIBOT')
  .attachFiles(['./resources/images/boiBotThumbnail.png'])
  .setImage('attachment://boiBotThumbnail.png')
	.setDescription('Hello bois, so I am here to make your life easier on Discord.')
	.addFields(
		{ name: 'For Help', value: '!help' },
		{ name: 'To get birthdays of all bois', value: '!birthdays'},
    { name: 'To get birthday of a specific boi', value: '!birthday {boiName} ((Prefer their original first name in the command :P)'},
    { name: 'To play a song', value: '!play {song-name}'},
    { name: 'To stop a song', value: '!stop'}
	)
	.setTimestamp()
	.setFooter('This is an experimental feature so you might face some issues. Par itna tw chalta hai. ;)');

/**
 * Message Embed for !help command
 */
const helpMessageEmbed = new Discord.MessageEmbed()
	.setColor('#ff5733 ')
	.setTitle('BOIBOT')
	.setDescription('Bois, so currently I support following commands. Feel free to check them out.')
	.addFields(
		{ name: 'For Help', value: '!help' },
		{ name: 'To get birthdays of all bois', value: '!birthdays'},
    { name: 'To get birthday of a specific boi', value: '!birthday {boiName} ((Prefer their original first name in the command :P)'},
    { name: 'To play a song', value: '!play {song-name}'},
    { name: 'To stop a song', value: '!stop'},
    { name: 'To skip a song', value: '!skip'},
		{ name: 'To get a random meme from reddit', value: '!meme'},
    {
      name: 'To get randomly inspired', value: '!inspire'
    },
    {
      name: 'Use this if I am unresponsive',
      value: '!restart boibot'
    }
	)
	.setTimestamp()

/**
 * Method to get a random quote from ZenQuotes API
 */
function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " - " + data[0]["a"]
    })
}

/**
 * Method to get a random Meme from mem-api open source api
 */
function getRandomMeme() {
  return fetch("https://meme-api.herokuapp.com/gimme")
    .then(res => {
      return res.json()
      console.log(res.json())
    })
    .then(data => {
      const lastIndex = data["preview"].length - 1
      return data["preview"][lastIndex]
    })
}

/**
 * Method to check if anyone's birthday is today.
 */
function checkBday(channel) {

  // Get Current Date on which we will do a check
  const currentDate = new Date()
  /**
   * new Date() returns date in UTC/GMT format but we need in
   * Indian format so to get month, day and year, we have to convert
   * it in indian timezone and then extract.
   */
  // extract current month in 2-digit format
  const currentMonth = currentDate.toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                    month: "2-digit"
                })

  // extract current day in 2-digit format
  const currentDay = currentDate.toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit"
                })
  // extract current year in YYYY format. 
  const currentYear = currentDate.toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric"
                })

  // variable to check if someone's bday occured today
  var isBdaySetToday = 0;
  // variable to hold bdayBoi's name
  var bdayBoiName = "";
  /**
   * We iterate through the DB and check if today is anyone's birthday.   If it is then we just simply send the bday message and update the    bdayDoneForYear to avoid any repeated wishes.
   */
    db.get("birthdays7").then(birthdays7 => {
    const bdays = birthdays7["data"];
      for (bday of bdays) {

          // if the bday month and day matches todays month and day
          // and
          // if the bday message is not sent for the current year,
          // we send the message and update the bdayDoneForYear.
          if ((currentMonth === bday.bdaymonth && currentDay === bday.bdayday) && (currentYear > bday.bdayDoneForYear)) {

            channel.send(`Happy Birthday **${bday.name}**!!`, {files: ["resources/images/" + bday.name + ".jpg"]})
            isBdaySetToday = 1;
            bdayBoiName = bday.name;
            bday.bdayDoneForYear = currentYear;
          }

      }
      //if the bday has already occured for the year then we persist it   in the DB so to not check for it after wishing.
      if(isBdaySetToday === 1) {
        db.set("birthdays7", birthdays7)
      }
      //channel.send("dd")
    }).catch() //This throws an error (Undefined, etc)
   .catch(e => console.log(e))
  
}

/**
 * Get Server name from the map of servers based on server name
 */
function getServerByName(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value.name === searchValue)
      return key;
  }
  return -1
}


//-----------------------CLIENT READY START--------------------------//
/**
 * Method to call when the client is ready to recieve bot interaction.
 */
client.on("ready", async () => {
  //get Bot user tag
  console.log(`Logged in as ${client.user.tag}!`)

  // get all the servers associated with the Bot in a collection of map
  const guilds = client.guilds.cache

  // get server based on Server Name
  const server = guilds.get(getServerByName(guilds, SERVER_NAME))
  if (server === null) {
    return 0;
  }
  // get channel based on channel name
  const channel = server.channels.cache.filter(function(chan) {
    return chan.type === "text" && chan.name === CHANNEL_NAME
  }).values().next().value

  //channel.send(initialMessageEmbed);
  await setBdays();
  // check if the current day is a birthday of someone
  setInterval(checkBday, 3000, channel)

})

//-----------------------CLIENT READY END--------------------------//

/**
 * Birthdays List Embed for !birthdays command
 */
const birthdaysEmbed = new Discord.MessageEmbed()
	.setColor('#ff5733')
	.setTitle('BOIBOT')
	.setDescription('So ye rahe sab k birthdays. Dekh lo.')
	.setTimestamp()

/**
 * Method to get Month Name by Month number
 */
function getBdayMonthByNumber(bdayMonth) {
    switch (bdayMonth) {
      case "01":
      return "January"
      case "02":
      return "February"
      case "03":
      return "March"
      case "04":
      return "April"
      case "05":
      return "May"
      case "06":
      return "June"
      case "07":
      return "July"
      case "08":
      return "August"
      case "09":
      return "September"
      case "10":
      return "October"
      case "11":
      return "November"
      case "12":
      return "December"

    }
  }

//-----------------------CLIENT MESSAGE START--------------------------//
client.on("message", msg => {

  /**
   * If the author of the message is bot then return the control.
   */
  if (msg.author.bot) {
    return;
  }

  /**
   * Get a random quote if asked for
   */
  if (msg.content.toLowerCase() === "!inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  /**
   * Get a random meme if asked for
   */
  if (msg.content.toLowerCase() === "!meme") {
    getRandomMeme().then(meme => msg.channel.send(meme))
  }

  /**
   * Get help option with all the commands with `!help` or `bhai help` command
   */
  if (msg.content.toLowerCase().startsWith("bhai help") || msg.content.toLowerCase().startsWith("!help")) {

      msg.channel.send(helpMessageEmbed);

  }

  /**
   * Get the list of birthdays if asked for
   */
  if (msg.content.toLowerCase().startsWith("!birthdays")) {

    const bdays = boiBirthdays["data"]

      for (bday of bdays) {
        birthdaysEmbed.addFields({
          name: bday.name, value: bday.bdayday + " " + getBdayMonthByNumber(bday.bdaymonth)
        })
      }
    msg.channel.send(birthdaysEmbed);

  }

  /**
   * Get the birthday of a specific boi if asked for
   */
  if (msg.content.toLowerCase() !== "!birthdays" && msg.content.toLowerCase().startsWith("!birthday ")) {

      // get the boi's name for whom it is asked for
      const bdayBoiName = msg.content.split("!birthday ")[1]

      // get the details of the boi based on the name passed.
      const bdayBoiDetails = boiBirthdays["data"].filter(function (e) {
        return e.name.toLowerCase() === bdayBoiName.toLowerCase();
      })

      /**
       * If the name doesnt match the list of bois then send back a message to
       * give the name correctly.
       */
      if (bdayBoiDetails.length === 0) {

        msg.channel.send('Naam toh sahi se daalo na bhai. For example "!birthday shashwat"')

      } else {
        // if the name is correct, we send the bday of the boi.
        const bdayBoiDetail = bdayBoiDetails[0]
        msg.channel.send(bdayBoiDetail.name + "'s birthday is on " + bdayBoiDetail.bdayday + " " + getBdayMonthByNumber(bdayBoiDetail.bdaymonth) + "!")

      }

  }

  // get the server for which the queue will be set.
  try {
    const serverQueue = queue.get(msg.guild.id);
  } catch(e) {
    console.log(e)
    return;
  }
  const serverQueue = queue.get(msg.guild.id);

    /**
     * play the song if asked for.
     */
    if (msg.content.toLowerCase().startsWith("!play")) {
      execute(msg, serverQueue);
      return;
    } else if (msg.content.toLowerCase().startsWith("!skip")) {
      /**
       * Skip the song to go to next song if any present in the queue.
       */
      skip(msg, serverQueue);
      return;
    } else if (msg.content.toLowerCase().startsWith         ("!stop")) {
      /**
       * Stop the song if asked for.
       */
      stop(msg, serverQueue);
      return;
    }

    if (msg.content.toLowerCase() === "!restart boibot") {
      
      msg.channel.send("Wait for 2 seconds kyuki koi perfect nahi hota, " + msg.author.username + "! :/");

      setTimeout(function() {
        process.exit();
      }, 2000);

    }

})
//-----------------------CLIENT MESSAGE END--------------------------//


//-------------------CLIENT VOICE STATE UPDATE START------------------------//

client.on('voiceStateUpdate', (oldState, newState) => {
    // check if someone connects or disconnects
    if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
    // check if the bot is disconnecting
    if (newState.id !== client.user.id) return;
    // clear the queue
    return queue.delete(oldState.guild.id);
    
});


client.on('voiceStateUpdate', (oldState, newState) => {

  // if nobody left the channel in question, return.
  if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
    return;

  // otherwise, check how many people are in the channel now
  if (!oldState.channel.members.size - 1) 
    setTimeout(() => { // if 1 (you), wait five minutes
      if (!oldState.channel.members.size - 1) // if there's still 1 member, 
         oldState.channel.leave(); // leave
    }, 1000 * 60); // (5 min in ms)
});

//-------------------CLIENT VOICE STATE UPDATE END------------------------//



process.on('exit', function(code) {
    return console.log(`Exited Proces with code: ${code}`);
});

/**
 * Method to execute/play a song if everything is okay.
 */
async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      message.author.username + " bhai voice channel me toh aao pehle!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  // Searches YouTube with the message content (this joins the arguments
  // together because songs can have spaces)
  if (!args.slice(1).join(" "))
    return message.channel.send("Please append the song's name after the command.")
  
  const {videos} = await yts(args.slice(1).join(" "));
  if (!videos.length) return message.channel.send("Koi song nhi mila, kuch aur search karo!");
  const song = {
    title: videos[0].title,
    url: videos[0].url
  };

  if (!serverQueue) {

    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
    } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
    }

  } else {

    serverQueue.songs.push(song);
    return message.channel.send(`**${song.title}** ko queue me add kar diya hai!`);

  }
}


/**
 * Method to skip the song if any other is present in the queue.
 */
function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      message.author.username + " bhai bina voice channel me aye bina skip kaise karoge?"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  try {
    serverQueue.songs.shift()
    play(message.guild, serverQueue.songs[0])
  } catch(e) {
    console.log(e);
  } 
}


/**
 * Method to stop the song
 */
function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      message.author.username + " bhai bina voice channel me aye bina stop kaise karoge??"
    );
    
  if (!serverQueue)
    return message.channel.send("Stop karne ke liye pehle gana toh bajao!");
    
  serverQueue.songs = [];
  try {
    //message.guild.me.voice.channel.leave();
    if (serverQueue.connection.dispatcher !== null) {
    serverQueue.connection.dispatcher.end();
    }
  } catch(e) {
    console.log(e);
  }
}


/**
 * Method to find the song and play it.
 */
function play(guild, song) {

  const serverQueue = queue.get(guild.id);
  console.log(serverQueue);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  
  const stream = ytdl(song.url)

  dispatcher = serverQueue.connection
    .play(stream)
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.send(`Ab aap sunn rhe hai: **${song.title}**`);

  //console.log(stream.listeners('error')[0]);
  const funcao = stream.listeners('error')[0];
  stream.removeListener('error', funcao);

        stream.on('error', (err) => {
          try {
            throw new Error();
          } catch {
            stream.destroy();
            console.log(err);
          }
        });

}

// Start the server to listen it on a port defined on server.js
keepAlive()

// Logs the client in, establishing a websocket connection to Discord.
client.login(process.env.TOKEN)


//------------------------------THE END------------------------------//