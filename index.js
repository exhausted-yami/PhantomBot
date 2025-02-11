const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(category => {
    const categoryPath = path.join(commandsPath, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
        fs.readdirSync(categoryPath).forEach(file => {
            if (file.endsWith(".js")) {
                const command = require(path.join(categoryPath, file));
                client.commands.set(command.name, command);
            }
        });
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error executing this command!", ephemeral: true });
    }
});

client.login("YOUR_BOT_TOKEN");
