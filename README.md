NPM URL: https://www.npmjs.com/package/zyper?activeTab=readme

Installation

# 1

npm i zyper

# 2 

Use the Basic Code

# 3 

You are now finished and can use Zyper


Basic Code

```javascript
require('dotenv').config();
const { config } = require('dotenv');
const Bot = require("zyper");
const { GatewayIntentBits } = require('discord.js');

const bot = new Bot([GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]);
bot.start(process.env.TOKEN);
bot.enableSlashCommands();

bot.on('ready', () => {
    if(!bot.blacklistBanManager().isBanned('1290676510306467873', '1079419675949142168')) {
        bot.blacklistBanManager().addBan('1290676510306467873', '1079419675949142168', 'Testing ban');
        }
        
        if (bot.blacklistBanManager().isBanned('1290676510306467873', '1079419675949142168')) {
            console.log('User is banned');
        }
        console.log(bot.blacklistBanManager().listBans('1290676510306467873'));
    
});