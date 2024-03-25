const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

require("dotenv/config");

const token = process.env.token;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const eventFolder = fs.readdirSync("./src/events");
for (const file of eventFolder) {
  if (file.endsWith(".js")) {
    require(`./events/${file}`)(client);
  }
}

client.login(token);
