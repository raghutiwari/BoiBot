const Discord = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const keepAlive = require("./server.js")
const db = new Database()
const client = new Discord.Client()
const ytdl = require('ytdl-core');
const yts = require("yt-search");
const SERVER_NAME = "Testing2"
const CHANNEL_NAME = "bois-chet"

const queue = new Map();

const sadWords = ["sad", "depressed", "unhappy", "angry"]

const startedEncouragements = [
  "Cheer up!",
  "Chal ab uth ja bhai",
  "Oyee lovelies"
]

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
// db.delete("birthdays1").then(() => {});
// db.delete("birthdays2").then(() => {});
// db.delete("birthdays3").then(() => {});
// db.delete("birthdays4").then(() => {});
// db.delete("birthdays5").then(() => {});
// db.delete("birthdays6").then(() => {});

// To do
// // to be removed in actual server
//db.delete("birthdays7").then(() => {});

function setBdays() {
  db.get("birthdays7").then(birthdays7 => {
    if (!birthdays7 || birthdays7.length < 1) {
      db.set("birthdays7", boiBirthdays)
        console.log("Birthdays db was empty or non-existing but not anymore!")
    }
  })
}


// db.get("birthdays").then(birthdays => {
//   const bday = birthdays["data"]
//   console.log(bday[0].bdaymonth)
// })


function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " - " + data[0]["a"]
    })
}

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
 * Function to check if anyone's birthday is today.
 * 
 */
function checkBday(channel) {

  const currentDate = new Date()

  const currentMonth = currentDate.toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                    month: "2-digit"
                })

  const currentDay = currentDate.toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit"
                })

  const currentYear = currentDate.toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric"
                })
  var isBdaySetToday = 0;
  var bdayBoiName = "";

  /**
   * We iterate through the DB and check if today is anyone's birthday. If it is then we just simply send the bday message and update the bdayDoneForYear to avoid any repeated wishes.
   */
    db.get("birthdays7").then(birthdays7 => {
    const bdays = birthdays7["data"];
      for (bday of bdays) {
      if ((currentMonth === bday.bdaymonth && currentDay === bday.bdayday) && (currentYear > bday.bdayDoneForYear)) {

        channel.send("Happy Birthday " + bday.name + "!!", {files: ["resources/images/" + bday.name + ".jpg"]})
        isBdaySetToday = 1;
        bdayBoiName = bday.name;
        bday.bdayDoneForYear = currentYear;
      }

      }
      //if the bday has already occured for the year then we persist it in the DB so to not check for it after wishing.
      if(isBdaySetToday === 1) {
      db.set("birthdays7", birthdays7)
      }
      //channel.send("dd")
    }).catch() //This throws an error (Undefined, etc)
   .catch(e => console.log(e))
  

}

// inside a command, event listener, etc.
const initialMessageEmbed = new Discord.MessageEmbed()
	.setColor('#ff5733 ')
  //.setAuthor('BoiBot')
	.setTitle('BOIBOT')
  .attachFiles(['./resources/images/boiBotThumbnail.png'])
  .setImage('attachment://boiBotThumbnail.png')
	//.setURL('https://discord.js.org/')
	.setDescription('Hello bois, so I am here to make your life easier on Discord.')
	// .setThumbnail('https://replit.com/@RaghuTiwari/BoiBot#resources/images/boiBotThumbnail.png')
	.addFields(
		{ name: 'For Help', value: '!help' },
		{ name: 'To get birthdays of all bois', value: '!birthdays'},
    { name: 'To get birthday of a specific boi', value: '!birthday {boiName} ((Prefer their original first name in the command :P)'},
    { name: 'To play a song', value: '!play {song-name}'},
    { name: 'To pause a song', value: '!pause'}
	)
	// .setImage('https://replit.com/@RaghuTiwari/BoiBot#resources/images/boiBotThumbnail.png')
	.setTimestamp()
	.setFooter('This is an experimental feature so you might face some issues. Par itna tw chalta hai. ;)');


  const helpMessageEmbed = new Discord.MessageEmbed()
	.setColor('#ff5733 ')
  //.setAuthor('BoiBot')
	.setTitle('BOIBOT')
	//.setURL('https://discord.js.org/')
	.setDescription('Bois, so currently I support following commands. Feel free to check them out.')
	// .setThumbnail('https://replit.com/@RaghuTiwari/BoiBot#resources/images/boiBotThumbnail.png')
	.addFields(
		{ name: 'For Help', value: '!help' },
		{ name: 'To get birthdays of all bois', value: '!birthdays'},
    { name: 'To get birthday of a specific boi', value: '!birthday {boiName} ((Prefer their original first name in the command :P)'},
		{ name: 'To get a random meme from reddit', value: '!meme'},
    {
      name: 'To get randomly inspired', value: '!inspire'
    },
    { name: 'To play a song', value: '!play {song-name}'}
	)
	// .setImage('https://replit.com/@RaghuTiwari/BoiBot#resources/images/boiBotThumbnail.png')
	.setTimestamp()
	.setFooter('Bonus command, just type ;)');


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

const birthdaysEmbed = new Discord.MessageEmbed()
	.setColor('#ff5733')
	.setTitle('BOIBOT')
	.setDescription('Bois, so ye rahe sab k birthdays. Dekh lo re.')
	.setTimestamp()
	//.setFooter('Chalo ho gya. Bye Bye.');


client.on("message", msg => {

  if (msg.author.bot) {
    return;
  }

  /**
   * Get a random quote
   */
  if (msg.content === "!inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  /**
   * Get a random meme
   */
  if (msg.content.toLowerCase() === "!meme") {
    getRandomMeme().then(meme => msg.channel.send(meme))
  }

  /**
   * Get help option with all the commands
   */
  if (msg.content.toLowerCase().startsWith("bhai help") || msg.content.toLowerCase().startsWith("!help")) {
      msg.channel.send(helpMessageEmbed);
  }

  if (msg.content.toLowerCase().startsWith("!birthdays")) {

    
    const bdays = boiBirthdays["data"]

      for (bday of bdays) {
        birthdaysEmbed.addFields({
          name: bday.name, value: bday.bdayday + " - " + getBdayMonthByNumber(bday.bdaymonth)
        }
        )
      }

    msg.channel.send(birthdaysEmbed);
  }

  if (msg.content.toLowerCase() !== "!birthdays" &&     msg.content.toLowerCase().startsWith("!birthday ")) {

      bdayBoiName = msg.content.split("!birthday ")[1]

      const bdayBoiDetails = boiBirthdays["data"].filter(function (e) {
        return e.name.toLowerCase() === bdayBoiName.toLowerCase();
      })


      if (bdayBoiDetails.length === 0) {

        msg.channel.send('Naam toh sahi se daalo na bhai. Ese likho "!birthday Shashwat"')

      } else {

        const bdayBoiDetail = bdayBoiDetails[0]
        msg.channel.send(bdayBoiDetail.name + "'s birthday is on " + bdayBoiDetail.bdayday + " " + getBdayMonthByNumber(bdayBoiDetail.bdaymonth))

      }

  }

  const serverQueue = queue.get(msg.guild.id);

    if (msg.content.startsWith("!play")) {
      execute(msg, serverQueue);
      return;
    } else if (msg.content.startsWith("!skip")) {
      skip(msg, serverQueue);
      return;
    } else if (msg.content.startsWith("!stop")) {
      stop(msg, serverQueue);
      return;
    }

  function getBdayMonthByNumber(bdayMonth) {
    switch (bdayMonth) {
      case "01":
      return "January"
      break
      case "02":
      return "February"
      break
      case "03":
      return "March"
      break
      case "04":
      return "April"
      break
      case "05":
      return "May"
      break
      case "06":
      return "June"
      break
      case "07":
      return "July"
      break
      case "08":
      return "August"
      break
      case "09":
      return "September"
      break
      case "10":
      return "October"
      break
      case "11":
      return "November"
      break
      case "12":
      return "December"
      break;

    }
  }

})

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

// Searches YouTube with the message content (this joins the arguments
// together because songs can have spaces)
const {videos} = await yts(args.slice(1).join(" "));
if (!videos.length) return message.channel.send("No songs were found!");
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
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Ab baj rha hai: **${song.title}**`);
}

keepAlive()
client.login(process.env.TOKEN)