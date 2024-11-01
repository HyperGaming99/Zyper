require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const chalk = require('chalk');
const AsciiTable = require('ascii-table');
const BlacklistBanManager = require('./BlacklistBanManager');
const swap_pages = require('./Swappages');
const fs = require('fs');
const path = require('path');

const startTimestamp = Date.now();

function printReadyTable(client, slashCommands) {
    console.log(chalk.cyan(`You are running with Zyper 1.1.6`));

    const readyTimestamp = Date.now();
    const timeDifference = readyTimestamp - startTimestamp;
    
    let table = new AsciiTable()
        .setHeading('Bot', 'ID', 'Discord.js', 'Slash Commands', 'Guilds', 'Latency')
        .addRow(
            client.user.tag,
            client.user.id,
            require('discord.js').version,
            slashCommands ? slashCommands.size : 'Disabled',
            client.guilds.cache.size,
            `${timeDifference} ms`
        )
        .setBorder('│', '─', '', '', '╯', '╰');

    console.log(chalk.yellow(table.toString()));
}

class Bot {
    constructor(intents) {
        this.client = new Client({ intents });
        this.token = null;
        this.slashCommands = new Collection();
        this.enableCommands = false;
    }

    start(token) {
        this.token = token;
        this.client.once('ready', () => {
            if (this.enableCommands) {
                this.loadSlashCommands();
                this.registerCommands();
            }
            printReadyTable(this.client, this.slashCommands);
        });
        this.client.login(this.token);
    }

    on(event, callback) {
        this.client.on(event, callback);
    }

    once(event, callback) {
        this.client.once(event, callback);
    }

    enableSlashCommands() {
        this.enableCommands = true;
    }

    loadSlashCommands(dir) {
        const commandsPath = path.join(process.cwd(), dir || 'slashCommands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (command.data && command.execute) {
                this.slashCommands.set(command.data.name, command);
            } else {
                console.warn(`Failed to load command at ${file}. Make sure it exports 'data' and 'execute'.`);
            }
        }
    }
    

    async registerCommands() {
        const rest = new REST({ version: '10' }).setToken(this.token);
        const commands = this.slashCommands.map(command => command.data.toJSON());

        try {
            await rest.put(
                Routes.applicationCommands(this.client.user.id),
                { body: commands }
            );

        } catch (error) {
            console.error(`Error registering commands: ${error}`);
        }
    }

    blacklistBanManager() {
        return new BlacklistBanManager(this.client);
    }

    swap_pages() {
        return swap_pages;
    }
}

module.exports = Bot;
