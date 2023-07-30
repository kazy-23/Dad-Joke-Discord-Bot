const express = require("express");
const request = require('request');
const fetch = require('node-fetch');
const app = express();
let intr = null;

const options = {
  url: 'https://icanhazdadjoke.com/',
  headers: {
    'Accept': 'text/plain'
  }
};

async function callback(error, response, body) {
  let message;

  if (error) {
    message = error;
  } else if (response && response.statusCode !== 200) {
    message = `Error ${response.statusCode} connecting.`;
  } else {
    message = body;
  }

  const giphyApiKey = process.env.giphy;
  const giphyUrl = `https://api.giphy.com/v1/gifs/random?api_key=${giphyApiKey}&tag=laugh`;
  const res= await fetch(giphyUrl);
  const data = await res.json();

  const gifUrl = data.data.url;

  intr.reply(message + '\n' + gifUrl)
}

app.listen(3000, () => {
  console.log("Project is running!");
})

app.get("/", (req, res) => {
  res.send("Hello world!");
})

const { Client, IntentsBitField } = require("discord.js")

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
})

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content.includes("dad joke")) {
    message.channel.send('Did I hear something a about dad jokes? Type /dadjoke and I will tell you a joke!')
  }
})

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'dadjoke') {
    intr = interaction;
    request(options, callback);
  }
})

const {REST, Routes} = require('discord.js');

const commands = [
    {
        name: 'dadjoke',
        description: 'Tells you a dad joke!'
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.token);

const register = async (id)=>{
    try {
        console.log('Registering...')
        
        await rest.put(
            Routes.applicationGuildCommands(process.env.clientID, id),
            {body: commands}
        )

        console.log('Registered!')
    }
    catch(error) {
        console.log(error)
    }
}

client.on('guildCreate', (guild) => {
  register(guild.id);
})

client.login(process.env.token)

