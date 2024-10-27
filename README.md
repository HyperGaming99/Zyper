NPM URL: https://www.npmjs.com/package/zyper?activeTab=readme

Installation

# 1

npm i zyper

# 2 

Go to where your Discord bot is started where your client is and put on_bot(client) there 

# 3 

You are now finished and can use Zyper


Basic Code

```javascript
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { on_bot } = require("zyper");
const BlacklistBanManager = require("zyper");

const LanguageLoder = require("zyper");
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
        console.log('Benutzer ist gebannt:', banManager.getBanInfo('1290676510306467873', '1079419675949142168'));
    }
    console.log(LanguageLoder.getTranslation('ready', 'en'));
    console.log( banManager.listBans('1290676510306467873'));
    
});


client.login(process.env.TOKEN);
