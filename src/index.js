const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { on_bot } = require("../dist/index.js");
const BlacklistBanManager = require("../dist/BlacklistBanManager.js");

const LanguageLoder = require("../dist/LanguageLoder.js");
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const banManager = new BlacklistBanManager(client);
on_bot(client);



client.once('ready', () => {
    // Benutzer in einer bestimmten Guild bannen
if(!banManager.isBanned('1290676510306467873', '1079419675949142168')) {
    banManager.addBan('1290676510306467873', '1079419675949142168', 'Verstoß gegen Regeln');
    }
    
    // Überprüfen, ob ein Benutzer in einer bestimmten Guild gebannt ist
    if (banManager.isBanned('1290676510306467873', '1079419675949142168')) {
        console.log('Benutzer ist in guild_1 gebannt:', banManager.getBanInfo('1290676510306467873', '1079419675949142168'));
    }
    console.log(LanguageLoder.getTranslation('ready', 'en'));
    console.log( banManager.listBans('1290676510306467873'));
    
});


client.login(process.env.TOKEN);
