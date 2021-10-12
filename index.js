const Discord = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const keepAlive = require("./server.js")
const db = new Database()
const client = new Discord.Client()

const SERVER_NAME = "Testing2"
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
      "bdayday": "22",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    },
    {
      "name": "Rajzzz",
      "bdayday": "11",
      "bdaymonth": "10",
      "bdayDoneForYear": "2020"
    }
  ]
}
//db.delete("birthdays").then(() => {});

db.get("birthdays").then(birthdays => {
  if (!birthdays || birthdays.length < 1) {
    db.set("birthdays", boiBirthdays)
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


  const bdays = boiBirthdays["data"];

  for (bday of bdays) {

    //check if the current days is a birthday in the list of bdays
    // also check if already wished, then no need to wish again.
    if ((currentMonth === bday.bdaymonth && currentDay === bday.bdayday) && (currentYear > bday.bdayDoneForYear)) {

      channel.send("Happy Birthday " + bday.name + "!!", {files: ["resources/images/happyBday.jpg"]})
      bday.bdayDoneForYear = currentYear

    }
  }

}

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

  // get channel based on channel name
  const channel = server.channels.cache.filter(function(chan) {
    return chan.type === "text" && chan.name === CHANNEL_NAME
  }).values().next().value

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
}

// client.on("message", msg => {

//   if (msg.author.bot) {
//     return;
//   }

//   if (msg.content === "$inspire") {
//     getQuote().then(quote => msg.channel.send(quote))
//   }

//   db.get("responding").then(responding => {
//     if (responding && sadWords.some(word => msg.content.includes(word))) {
//       db.get("encouragements").then(encouragements => {
//           const encouragement = encouragements[Math.floor(Math.random() *
//           encouragements.length)]
//           msg.reply(encouragement)
//       })
      
//     }   
//   })


//   if (msg.content.startsWith("$new")) {
//     encouragingMessage = msg.content.split("$new ")[1]
//     updateEncouragements(encouragingMessage)
//     msg.channel.send("New encouraging message added.")
//   }

//   if (msg.content.startsWith("$del")) {
//     index = parseInt(msg.content.split("$del ")[1])
//     deleteEncouragements(index)
//     msg.channel.send("Encouraging message deleted.")
//   }

//   if (msg.content.startsWith("$list")) {
//     db.get("encouragements"). then(encouragements => {
//       msg.channel.send(encouragements)
//     })
//   }

//   if (msg.content.startsWith("$responding")) {
//     value = msg.content.split("$responding ")[1]

//     if (value.toLowerCase() === "true") {
//       db.set("responding", true)
//       msg.channel.send("Responding is on.")
//     } else {
//       db.set("responding", false)
//       msg.channel.send("Responding is off.")
//     }
//   }

// })


keepAlive()
client.login(process.env.TOKEN)