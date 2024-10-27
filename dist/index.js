const chalk = require('chalk');
const AsciiTable = require('ascii-table');
const LanguageLoder = require('./LanguageLoder');
const BlacklistBanManager = require('./BlacklistBanManager');
const swap_pages = require('./Swappages');


// Credis to Ezcord ( https://github.com/tibue99/ezcord )

function printReadyTable(client) {
  console.log(chalk.cyan(`You running with Zyper 1.0.9`));


  let table = new AsciiTable()
      .setHeading('Bot', 'ID', 'Discord.js', 'Guilds', 'Latency')
      .addRow(
          client.user.tag,                      
          client.user.id,                      
          require('discord.js').version,     
          client.guilds.cache.size,            
          `${client.ws.ping}ms`                  
      )
      .setBorder('│', '─', '', '', '╯', '╰'); 

  console.log(chalk.yellow(table.toString()));
}



function on_bot(client) {
    client.on('ready', () => {
        printReadyTable(client);
    });


}



module.exports = { on_bot , LanguageLoder, BlacklistBanManager, swap_pages };