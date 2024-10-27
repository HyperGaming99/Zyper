const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

async function swap_pages(client, message, description, TITLE, color) { 
    let prefix = "!"
    let cmduser = message.user;
  
    let currentPage = 0;
    // GET ALL EMBEDS
    let embeds = [];
    
    if (Array.isArray(description)) {
      try {
        let k = 20;
        for (let i = 0; i < description.length; i += 20) {
          const current = description.slice(i, k);
          k += 20;
          const NormalEmbed = new EmbedBuilder()
            .setDescription(current.join("\n"))
            .setTitle(TITLE)
            .setFooter({text: `Page ${embeds.length + 1}/${Math.ceil(description.length / 20)}`});
          embeds.push(NormalEmbed);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        let k = 1000;
        for (let i = 0; i < description.length; i += 1000) {
          const current = description.slice(i, k);
          k += 1000;
          const NormalEmbed = new EmbedBuilder()
            .setDescription(current)
            .setTitle(TITLE)
            .setColor(color);
          embeds.push(NormalEmbed);
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    if (embeds.length === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("ERROR")
            .setDescription("There was an Error with the Command, please report it to the Bot Developer!")
        ]
      }).catch(e => console.log("THIS IS TO PREVENT A CRASH"));
    }
    
    if (embeds.length === 1) return message.reply({embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"));

    // Button setup
    let button_back = new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId('1').setLabel("Back");
    let button_home = new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId('2').setLabel("Home");
    let button_forward = new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId('3').setLabel("Forward");
    let button_stop = new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId('stop').setLabel("Stop");
    const allbuttons = new ActionRowBuilder().addComponents(button_back, button_home, button_forward, button_stop);

    // Send message with buttons
    let swapmsg = await message.reply({
      content: `***Click on the __Buttons__ to swap the Pages***`,
      embeds: [embeds[0]], 
      components: [allbuttons]
    });

    const collector = swapmsg.createMessageComponentCollector({
      filter: (i) =>
        i.isButton() &&
        i.user && i.user.id === cmduser.id,
      time: 180e3,
    });

    collector.on('collect', async b => {
      if (b?.user.id !== message.user.id)
        return b?.reply({content: `<:no:833101993668771842> **Only the one who typed ${prefix}help is allowed to react!**`, ephemeral: true});

      collector.resetTimer();
      
      if (b.customId === '1') {
        currentPage = currentPage === 0 ? embeds.length - 1 : currentPage - 1;
      } else if (b.customId === '2') {
        currentPage = 0;
      } else if (b.customId === '3') {
        currentPage = currentPage === embeds.length - 1 ? 0 : currentPage + 1;
      } else if (b.customId === 'stop') {
        collector.stop('stopped');
        return b?.deferUpdate();
      }

      await swapmsg.edit({ embeds: [embeds[currentPage]] }).catch(() => {});
      await b?.deferUpdate();
    });

    collector.on("end", () => {
      swapmsg.edit({ embeds: [embeds[currentPage]], components: [] }).catch(() => {});
    });
}

module.exports = swap_pages;
