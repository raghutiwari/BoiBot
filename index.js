const Discord = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const keepAlive = require("./server.js")
const db = new Database()
const client = new Discord.Client()

const SERVER_NAME = "Testing21"
const CHANNEL_NAME = "bois-chet"

const sadWords = ["sad", "depressed", "unhappy", "angry"]

const startedEncouragements = [
  "Cheer up!",
  "Chal ab uth ja bhai",
  "Oyee lovelies"
]

const boiBirthdays = {
  "data" : [
    {
      "name": "KD boi",
      "bdayday": "13",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Rajzzz",
      "bdayday": "14",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Maheshwari",
      "bdayday": "15",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Taori Boi",
      "bdayday": "16",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Milinoo",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Dhotess",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Seemuu",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Shankar ji",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Viru boi",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Phalakk",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Anishh",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Pranav boii",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Gopal",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    }
  ]
}
db.delete("birthdays1").then(() => {});
db.delete("birthdays2").then(() => {});
db.delete("birthdays3").then(() => {});
db.delete("birthdays4").then(() => {});
db.delete("birthdays5").then(() => {});
db.delete("birthdays6").then(() => {});
// to be removed in actual server
db.delete("birthdays7").then(() => {});

db.get("birthdays7").then(birthdays7 => {
  if (!birthdays7 || birthdays7.length < 1) {
    db.set("birthdays7", boiBirthdays)
      console.log("Birthdays db was empty or non-existing but not anymore!")
  }
})

// db.get("birthdays").then(birthdays => {
//   const bday = birthdays["data"]
//   console.log(bday[0].bdaymonth)
// })

console.log(db.get("birthdays"))

db.get("encouragements").then(encouragements => {
  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", startedEncouragements)   
  }
})

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }
})

function updateEncouragements(encouragingMessage) {
  db.get("encouragements").then(encouragements => {
    encouragements.push([encouragingMessage])
    db.set("encouragements", encouragements)
  })
}

function deleteEncouragements(index) {
  db.get("encouragements").then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1)
      db.set("encouragments", encouragements)
    }
  })
}

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
     console.log("When updating DB\n")
     console.log(birthdays7["data"])
    for (bday of bdays) {
    if ((currentMonth === bday.bdaymonth && currentDay === bday.bdayday) && (currentYear > bday.bdayDoneForYear)) {

      channel.send("Happy Birthday " + bday.name + "!!", {files: ["resources/images/happyBday.jpg"]})
      isBdaySetToday = 1;
      console.log("isbdayset? " + isBdaySetToday)
      bdayBoiName = bday.name;
      bday.bdayDoneForYear = currentYear;
    }

    }
    //if the bday has already occured for the year then we persist it in the DB so to not check for it after wishing.
    if(isBdaySetToday === 1) {
    db.set("birthdays7", birthdays7)
    }

  })   

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
		{ name: 'To play a game of scribble', value: '!scribble'},
    { name: 'To play a song', value: '!play {song-name}'}
	)
	// .setImage('https://replit.com/@RaghuTiwari/BoiBot#resources/images/boiBotThumbnail.png')
	.setTimestamp()
	.setFooter('Bonus command, just type ;)');


/**
 * Method to call when the client is ready to recieve bot interaction.
 */
client.on("ready", async () => {
  // get Bot user tag
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

  channel.send(initialMessageEmbed);

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

client.on("message", msg => {

  if (msg.author.bot) {
    return;
  }

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  if (msg.content.toLowerCase().startsWith("bhai help")) {
      msg.channel.send(helpMessageEmbed);
  }

  db.get("responding").then(responding => {
    if (responding && sadWords.some(word => msg.content.includes(word))) {
      db.get("encouragements").then(encouragements => {
          const encouragement = encouragements[Math.floor(Math.random() *
          encouragements.length)]
          msg.reply(encouragement)
      })
      
    }   
  })


  if (msg.content.startsWith("$new")) {
    encouragingMessage = msg.content.split("$new ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("New encouraging message added.")
  }

  if (msg.content.startsWith("$del")) {
    index = parseInt(msg.content.split("$del ")[1])
    deleteEncouragements(index)
    msg.channel.send("Encouraging message deleted.")
  }

  if (msg.content.toLowerCase().startsWith("!birthdays")) {
    db.get("encouragements"). then(encouragements => {
      msg.channel.send(encouragements)
    })
  }

  if (msg.content.startsWith("$responding")) {
    value = msg.content.split("$responding ")[1]

    if (value.toLowerCase() === "true") {
      db.set("responding", true)
      msg.channel.send("Responding is on.")
    } else {
      db.set("responding", false)
      msg.channel.send("Responding is off.")
    }
  }

})


keepAlive()
client.login(process.env.TOKEN)